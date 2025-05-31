
import React from 'react';
import AudioPlayer from './AudioPlayer';

const MissionAccomplished: React.FC = () => {
  const audioUrl = "https://epukqhdfdoxvowyflral.supabase.co/storage/v1/object/public/audio-files/mission-accomplished.mp3";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="border border-green-400 p-6 bg-black/90">
          <div className="text-lg font-bold mb-4 text-green-300">
            MISSION ACCOMPLISHED
          </div>
          
          <div className="text-xs leading-relaxed whitespace-pre-line mb-6">
            {`You actually made it? Didn't think you'd crack the code, Agent—but here you are, standing at the final checkpoint, top floor, secret lair of questionable armchairs and even more questionable life choices.

Don't get too comfortable—HQ says you're not technically cleared to graduate until the grades are in (bureaucracy, am I right?) But your next assignment begins now: we'll be watching RRR. Consider it vital research for your ongoing secret agent mission. Debrief snacks will be provided.

But for now, come outside the room, please.`}
          </div>

          <AudioPlayer
            src={audioUrl}
            label="MISSION ACCOMPLISHED"
            autoPlay={true}
          />
        </div>
      </div>
    </div>
  );
};

export default MissionAccomplished;
