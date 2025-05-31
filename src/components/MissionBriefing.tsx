
import React from 'react';

interface MissionBriefingProps {
  onStartClues: () => void;
}

const MissionBriefing: React.FC<MissionBriefingProps> = ({ onStartClues }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="border border-green-400 p-6 bg-black/90">
          <div className="text-lg font-bold mb-4 text-green-300">
            MISSION BRIEFING - HANDLER AVEN
          </div>
          
          <div className="text-xs leading-relaxed space-y-3">
            <p>Agent, I'm your handler, Aven.</p>
            
            <p>Your mission is to recover top-secret intel related to your stolen diploma. These have been cunningly stashed across campus by our most devious operatives (and possibly by San, in a fit of mischief).</p>
            
            <p>There are 8 secret checkpoints scattered around UCL campus. At each checkpoint, your mission is to find a secret code hidden inside a discreet envelope. Once you've got the code, enter it here to unlock your next clue and keep the mission moving.</p>
            
            <p>Make it all the way to the final location and you'll unlock a classified "briefing"—and, just maybe, the safe return of your precious graduation diploma… but only after you complete one last top-secret assignment.</p>
            
            <p>If you get desperate along the way, you have 3 Lifelines at your disposal, which will offer you hints. Use them wisely—HQ's budget isn't what it used to be.</p>
            
            <p>Lucky you—your first clue comes with no password required. Consider it a freebie from HQ (don't get used to it).</p>
            
            <p>Good luck. This message will self-destruct in… just kidding.</p>
          </div>
          
          <button
            onClick={onStartClues}
            className="mt-6 w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-4 transition-colors duration-200 border border-green-400"
          >
            [INITIATE OPERATION]
          </button>
        </div>
        
        <div className="text-center text-xs opacity-60">
          HANDLER: AVEN • CLEARANCE: ALPHA
        </div>
      </div>
    </div>
  );
};

export default MissionBriefing;
