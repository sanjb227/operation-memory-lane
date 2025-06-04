
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { method } = req;
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    if (method === 'POST' && path === 'start') {
      const { checkpoint, sessionId } = await req.json();
      console.log('Starting checkpoint timer:', { checkpoint, sessionId });
      
      const startTime = new Date().toISOString();
      
      // Insert or update checkpoint timing
      const { error } = await supabase
        .from('checkpoint_timing')
        .upsert({
          session_id: sessionId,
          checkpoint_number: checkpoint,
          start_time: startTime,
          lifelines_used_count: 0,
          invalid_attempts_count: 0
        }, {
          onConflict: 'session_id,checkpoint_number'
        });

      if (error) {
        console.error('Error starting checkpoint timer:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        });
      }

      return new Response(JSON.stringify({ success: true, startTime }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'POST' && path === 'attempt') {
      const { checkpoint, sessionId, code, correctCodes } = await req.json();
      console.log('Validating attempt:', { checkpoint, sessionId, code });
      
      const correctCode = correctCodes[checkpoint]?.toUpperCase();
      const isCorrect = code.trim().toUpperCase() === correctCode;
      
      if (!isCorrect) {
        console.log('Invalid attempt detected');
        // Log invalid attempt
        const { error: attemptError } = await supabase
          .from('invalid_attempts')
          .insert({
            session_id: sessionId,
            checkpoint_number: checkpoint,
            attempted_code: code.trim(),
            penalty_applied: -2
          });

        if (attemptError) {
          console.error('Error logging invalid attempt:', attemptError);
        }

        // Update checkpoint timing with invalid attempt count
        const { data: timingData } = await supabase
          .from('checkpoint_timing')
          .select('invalid_attempts_count')
          .eq('session_id', sessionId)
          .eq('checkpoint_number', checkpoint)
          .single();

        const newInvalidCount = (timingData?.invalid_attempts_count || 0) + 1;

        await supabase
          .from('checkpoint_timing')
          .update({
            invalid_attempts_count: newInvalidCount,
            invalid_attempt_penalty: newInvalidCount * 2
          })
          .eq('session_id', sessionId)
          .eq('checkpoint_number', checkpoint);

        return new Response(JSON.stringify({ 
          success: true, 
          correct: false, 
          penalty: -2,
          message: 'Invalid code - 2 point penalty applied',
          totalInvalidAttempts: newInvalidCount
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      console.log('Code accepted');
      return new Response(JSON.stringify({ 
        success: true, 
        correct: true,
        message: 'Code accepted!'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'POST' && path === 'complete') {
      const { checkpoint, sessionId, lifelinesUsed, invalidAttempts } = await req.json();
      console.log('Completing checkpoint:', { checkpoint, sessionId });
      
      const endTime = new Date().toISOString();
      
      // Get start time
      const { data: timingData } = await supabase
        .from('checkpoint_timing')
        .select('start_time, lifelines_used_count, invalid_attempts_count')
        .eq('session_id', sessionId)
        .eq('checkpoint_number', checkpoint)
        .single();

      if (!timingData) {
        console.error('Timing data not found for checkpoint completion');
        return new Response(JSON.stringify({ success: false, error: 'Timing data not found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        });
      }

      const startTime = new Date(timingData.start_time);
      const duration = Math.floor((new Date(endTime).getTime() - startTime.getTime()) / 1000);
      const durationMinutes = duration / 60;

      // Calculate score - ENSURE SCORE IS ALWAYS CALCULATED
      const PAR_TIME_MINUTES = 7;
      let timeScore = 0;
      
      if (durationMinutes <= PAR_TIME_MINUTES) {
        timeScore = 10;
      } else if (durationMinutes <= PAR_TIME_MINUTES + 3) {
        timeScore = 7;
      } else {
        timeScore = 4;
      }
      
      const lifelinePenalty = (timingData.lifelines_used_count || 0) * 3;
      const invalidAttemptPenalty = (timingData.invalid_attempts_count || 0) * 2;
      const netScore = Math.max(0, timeScore - lifelinePenalty - invalidAttemptPenalty);

      console.log('Score calculation:', { timeScore, lifelinePenalty, invalidAttemptPenalty, netScore, durationMinutes });

      // Update checkpoint timing
      const { error } = await supabase
        .from('checkpoint_timing')
        .update({
          end_time: endTime,
          duration_seconds: duration,
          time_score: timeScore,
          lifeline_penalty: lifelinePenalty,
          invalid_attempt_penalty: invalidAttemptPenalty,
          net_score: netScore
        })
        .eq('session_id', sessionId)
        .eq('checkpoint_number', checkpoint);

      if (error) {
        console.error('Error completing checkpoint:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        });
      }

      const scoreBreakdown = {
        timeScore,
        lifelinePenalty,
        invalidAttemptPenalty,
        netScore,
        duration,
        durationMinutes: Math.round(durationMinutes * 100) / 100
      };

      console.log('Checkpoint completed successfully:', scoreBreakdown);

      return new Response(JSON.stringify({ 
        success: true, 
        endTime,
        score: scoreBreakdown,
        totalInvalidAttempts: timingData.invalid_attempts_count || 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'POST' && path === 'lifeline') {
      const { checkpoint, sessionId } = await req.json();
      console.log('Recording lifeline use:', { checkpoint, sessionId });
      
      // Update lifeline count
      const { data: timingData } = await supabase
        .from('checkpoint_timing')
        .select('lifelines_used_count')
        .eq('session_id', sessionId)
        .eq('checkpoint_number', checkpoint)
        .single();

      const newLifelineCount = (timingData?.lifelines_used_count || 0) + 1;

      const { error } = await supabase
        .from('checkpoint_timing')
        .update({
          lifelines_used_count: newLifelineCount
        })
        .eq('session_id', sessionId)
        .eq('checkpoint_number', checkpoint);

      if (error) {
        console.error('Error updating lifeline count:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        });
      }

      console.log('Lifeline recorded successfully');
      return new Response(JSON.stringify({ 
        success: true, 
        totalLifelinesUsed: newLifelineCount,
        penalty: -3
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET' && path === 'current-score') {
      const sessionId = url.searchParams.get('sessionId');
      console.log('Getting current score for session:', sessionId);
      
      if (!sessionId) {
        return new Response(JSON.stringify({ success: false, error: 'Session ID required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      // Get all completed checkpoints
      const { data: checkpointScores } = await supabase
        .from('checkpoint_timing')
        .select('*')
        .eq('session_id', sessionId)
        .not('net_score', 'is', null)
        .order('checkpoint_number');

      const currentScore = checkpointScores?.reduce((sum, score) => sum + (score.net_score || 0), 0) || 0;
      
      console.log('Current score calculated:', currentScore);

      return new Response(JSON.stringify({
        success: true,
        currentScore,
        checkpoints: checkpointScores || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET' && path === 'final-score') {
      const sessionId = url.searchParams.get('sessionId');
      console.log('Getting final score for session:', sessionId);
      
      if (!sessionId) {
        return new Response(JSON.stringify({ success: false, error: 'Session ID required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      // Get all checkpoint scores
      const { data: checkpointScores } = await supabase
        .from('checkpoint_timing')
        .select('*')
        .eq('session_id', sessionId)
        .order('checkpoint_number');

      if (!checkpointScores || checkpointScores.length === 0) {
        console.error('No checkpoint data found for final score');
        return new Response(JSON.stringify({ success: false, error: 'No checkpoint data found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        });
      }

      console.log('Final score checkpoint data:', checkpointScores);

      const totalCheckpointScore = checkpointScores.reduce((sum, score) => sum + (score.net_score || 0), 0);
      const totalLifelinesUsed = checkpointScores.reduce((sum, score) => sum + (score.lifelines_used_count || 0), 0);
      const totalInvalidAttempts = checkpointScores.reduce((sum, score) => sum + (score.invalid_attempts_count || 0), 0);
      
      const noLifelineBonus = totalLifelinesUsed === 0 ? 10 : 0;
      const perfectCodeBonus = totalInvalidAttempts === 0 ? 5 : 0;
      const completionBonus = 10;
      
      const finalScore = totalCheckpointScore + noLifelineBonus + perfectCodeBonus + completionBonus;

      const AGENT_RANKS = [
        { min: 95, max: 100, title: "The Spy Who Scored Me", color: "#FFD700" },
        { min: 80, max: 94, title: "Undercover Overachiever", color: "#C0C0C0" },
        { min: 65, max: 79, title: "Secret Agent...ish", color: "#CD7F32" },
        { min: 45, max: 64, title: "Agent Almost-There", color: "#87CEEB" },
        { min: 0, max: 44, title: "Operation: Whoopsie", color: "#FF6B6B" }
      ];

      const agentRank = AGENT_RANKS.find(rank => finalScore >= rank.min && finalScore <= rank.max) || AGENT_RANKS[4];

      console.log('Final score calculated successfully:', { finalScore, agentRank });

      return new Response(JSON.stringify({
        success: true,
        totalScore: finalScore,
        agentRank,
        breakdown: checkpointScores,
        totalLifelinesUsed,
        totalInvalidAttempts,
        noLifelineBonus,
        perfectCodeBonus,
        completionBonus
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Endpoint not found:', path);
    return new Response(JSON.stringify({ success: false, error: 'Endpoint not found' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
})
