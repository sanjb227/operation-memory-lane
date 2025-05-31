
import React, { useState } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import MissionBriefing from '../components/MissionBriefing';
import ClueInterface from '../components/ClueInterface';
import { GamePhase } from '../types/game';

const correctCodes = [
  "BACKPACK", // Checkpoint 1 - bag riddle
  "CLASSROOM", // Checkpoint 2 - Torrington Place  
  "WATERSTONES", // Checkpoint 3 - bookstore
  "LIBRARY", // Checkpoint 4 - Science Library
  "MEDAWAR", // Checkpoint 5 - Medawar Building
  "CAFE", // Checkpoint 6 - Print Room Cafe
  "CROATIA", // Checkpoint 7 - IOE planning room
  "STAIRS", // Checkpoint 8 - IOE stairs
  "ALLNIGHT" // Checkpoint 9 - Student centre final
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
    const correctCode = correctCodes[currentCheckpoint];
    
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
      // For now, just show an alert - can be enhanced with actual hints
      alert('Lifeline used! Hint functionality coming soon...');
    }
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
          <div className="text-center space-y-6">
            <div className="text-2xl font-bold text-green-300 mb-8">
              MISSION ACCOMPLISHED
            </div>
            <div className="text-lg">
              Congratulations, Agent Aishu!
            </div>
            <div className="text-sm opacity-80">
              Your diploma awaits...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
