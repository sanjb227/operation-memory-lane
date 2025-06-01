import React, { useState, useEffect } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import MissionBriefing from '../components/MissionBriefing';
import ClueInterface from '../components/ClueInterface';
import Checkpoint7Handler from '../components/Checkpoint7Handler';
import MissionAccomplished from '../components/MissionAccomplished';
import { GamePhase } from '../types/game';
import { useGameProgress } from '../hooks/useGameProgress';

const correctCodes = [
  "HANDBAG",     // Checkpoint 1
  "CLASSROOM",   // Checkpoint 2  
  "BOOKMARK",    // Checkpoint 3
  "LABCOAT",     // Checkpoint 4
  "ATTENDANCE",  // Checkpoint 5
  "ESPRESSO",    // Checkpoint 6
  "PHOTOSHOOT",  // Checkpoint 7 (was 8)
  "ALLNIGHT"     // Checkpoint 8 (was 9, final)
];

const Index = () => {
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [lifelinesRemaining, setLifelinesRemaining] = useState(3);
  const [enteredCodes, setEnteredCodes] = useState<string[]>([]);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('welcome');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCheckpoint7Handler, setShowCheckpoint7Handler] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);

  const { sessionId, isLoading, saveProgress, loadProgress } = useGameProgress();

  // Load saved progress on component mount (only once)
  useEffect(() => {
    const initializeProgress = async () => {
      if (isLoading || progressLoaded) return;

      console.log('Initializing progress...');
      const savedProgress = await loadProgress();
      
      if (savedProgress) {
        console.log('Restoring saved progress:', savedProgress);
        setCurrentCheckpoint(savedProgress.current_checkpoint);
        setLifelinesRemaining(savedProgress.lifelines_remaining);
        setEnteredCodes(savedProgress.completed_checkpoints);
        
        // Determine phase based on checkpoint
        if (savedProgress.current_checkpoint >= correctCodes.length) {
          setCurrentPhase('final');
        } else if (savedProgress.current_checkpoint > 0) {
          setCurrentPhase('clue');
        } else {
          setCurrentPhase('welcome');
        }
      } else {
        console.log('No saved progress found, starting fresh');
        setCurrentPhase('welcome');
      }
      
      setProgressLoaded(true);
    };

    initializeProgress();
  }, [isLoading, loadProgress, progressLoaded]);

  // Monitor phase changes for debugging
  useEffect(() => {
    console.log('Current phase changed to:', currentPhase);
  }, [currentPhase]);

  const handleBeginMission = () => {
    console.log('BEGIN MISSION clicked - current phase:', currentPhase);
    console.log('Setting phase to briefing...');
    setCurrentPhase('briefing');
    
    // Save initial progress
    if (sessionId && progressLoaded) {
      saveProgress(0, 3, []);
    }
  };

  const handleStartClues = () => {
    console.log('START CLUES clicked - setting phase to clue');
    setCurrentPhase('clue');
  };

  const handleBackToWelcome = () => {
    console.log('BACK TO WELCOME clicked - returning to welcome screen');
    setCurrentPhase('welcome');
  };

  const handleCodeSubmit = (code: string) => {
    const trimmedCode = code.trim().toUpperCase();
    const correctCode = correctCodes[currentCheckpoint].toUpperCase();
    
    console.log('Code submitted:', trimmedCode, 'Expected:', correctCode);
    
    if (trimmedCode === correctCode) {
      // Correct code
      const newEnteredCodes = [...enteredCodes, trimmedCode];
      setEnteredCodes(newEnteredCodes);
      setShowSuccess(true);
      setShowError(false);
      
      setTimeout(() => {
        setShowSuccess(false);
        if (currentCheckpoint < correctCodes.length - 1) {
          const nextCheckpoint = currentCheckpoint + 1;
          
          // Show checkpoint 7 handler before checkpoint 7 (index 6)
          if (nextCheckpoint === 6) {
            setShowCheckpoint7Handler(true);
            // Save progress before showing handler
            if (sessionId && progressLoaded) {
              saveProgress(nextCheckpoint, lifelinesRemaining, newEnteredCodes);
            }
          } else {
            setCurrentCheckpoint(nextCheckpoint);
            // Save progress
            if (sessionId && progressLoaded) {
              saveProgress(nextCheckpoint, lifelinesRemaining, newEnteredCodes);
            }
          }
        } else {
          // Mission complete
          setCurrentPhase('final');
          // Save final progress
          if (sessionId && progressLoaded) {
            saveProgress(correctCodes.length, lifelinesRemaining, newEnteredCodes);
          }
        }
      }, 2000);
    } else {
      // Incorrect code
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleUseLifeline = () => {
    if (lifelinesRemaining > 0) {
      const newLifelines = lifelinesRemaining - 1;
      setLifelinesRemaining(newLifelines);
      
      // Save updated lifelines
      if (sessionId && progressLoaded) {
        saveProgress(currentCheckpoint, newLifelines, enteredCodes);
      }
      
      return true; // Indicate lifeline was used
    }
    return false;
  };

  const handleCheckpoint7Continue = () => {
    console.log('Checkpoint 7 handler - continuing to clue');
    setShowCheckpoint7Handler(false);
    setCurrentCheckpoint(6); // Checkpoint 7 (index 6)
  };

  // Show loading while progress is being loaded
  if (isLoading || !progressLoaded) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-300 text-lg font-bold mb-2">
            INITIALIZING SECURE CONNECTION...
          </div>
          <div className="text-xs opacity-60">
            SESSION ID: {sessionId || 'GENERATING...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* UCL Logo Watermark */}
      <div className="fixed top-4 right-4 opacity-20 text-green-600 text-sm font-bold z-10">
        UCL
      </div>

      {/* Checkpoint 7 Handler Modal */}
      {showCheckpoint7Handler && (
        <Checkpoint7Handler onContinue={handleCheckpoint7Continue} />
      )}

      {currentPhase === 'welcome' && (
        <WelcomeScreen onBeginMission={handleBeginMission} />
      )}
      
      {currentPhase === 'briefing' && (
        <MissionBriefing 
          onStartClues={handleStartClues} 
          onBackToWelcome={handleBackToWelcome}
        />
      )}
      
      {currentPhase === 'clue' && (
        <ClueInterface
          currentCheckpoint={currentCheckpoint}
          lifelinesRemaining={lifelinesRemaining}
          onCodeSubmit={handleCodeSubmit}
          onUseLifeline={handleUseLifeline}
          showError={showError}
          showSuccess={showSuccess}
          totalCheckpoints={correctCodes.length}
        />
      )}

      {currentPhase === 'final' && (
        <MissionAccomplished />
      )}
    </div>
  );
};

export default Index;
