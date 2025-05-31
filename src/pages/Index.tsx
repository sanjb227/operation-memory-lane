
import React, { useState } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import MissionBriefing from '../components/MissionBriefing';
import ClueInterface from '../components/ClueInterface';
import { GamePhase } from '../types/game';

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

  const handleBeginMission = () => {
    setCurrentPhase('briefing');
  };

  const handleStartClues = () => {
    setCurrentPhase('clue');
  };

  const handleCodeSubmit = (code: string) => {
    const trimmedCode = code.trim().toUpperCase();
    const correctCode = correctCodes[currentCheckpoint].toUpperCase();
    
    if (trimmedCode === correctCode) {
      // Correct code
      setEnteredCodes([...enteredCodes, trimmedCode]);
      setShowSuccess(true);
      setShowError(false);
      
      setTimeout(() => {
        setShowSuccess(false);
        if (currentCheckpoint < correctCodes.length - 1) {
          setCurrentCheckpoint(currentCheckpoint + 1);
        } else {
          // Mission complete
          setCurrentPhase('final');
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
      setLifelinesRemaining(lifelinesRemaining - 1);
      return true; // Indicate lifeline was used
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* UCL Logo Watermark */}
      <div className="fixed top-4 right-4 opacity-20 text-green-600 text-sm font-bold z-10">
        UCL
      </div>

      {currentPhase === 'welcome' && (
        <WelcomeScreen onBeginMission={handleBeginMission} />
      )}
      
      {currentPhase === 'briefing' && (
        <MissionBriefing onStartClues={handleStartClues} />
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
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6">
            <div className="border border-green-400 p-6 bg-black/90">
              <div className="text-lg font-bold mb-4 text-green-300">
                MISSION ACCOMPLISHED
              </div>
              <div className="text-xs leading-relaxed whitespace-pre-line">
                {`You actually made it? Didn't think you'd crack the code, Agent—but here you are, standing at the final checkpoint, top floor, secret lair of questionable armchairs and even more questionable life choices.

Don't get too comfortable—HQ says you're not technically cleared to graduate until the grades are in (bureaucracy, am I right?) But your next assignment begins now: we'll be watching RRR. Consider it vital research for your ongoing secret agent mission. Debrief snacks will be provided.

But for now, come outside the room, please.`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
