
export const getClueText = (checkpoint: number): string => {
  const clues = [
    // Checkpoint 1 - BAGGAGE CLAIMED (Bag)
    `Silent companion, worn and tried,
Keeper of secrets you cannot hide.
Locked with zips, yet always near—
Your journey starts where you hold dear.`,

    // Checkpoint 2 - STAIRWAY SPY (IOE Stairs)
    `Steps that echo with captured time,
A moment frozen, a silent rhyme.
Find where memories quietly rest—
Your next clue waits within this nest.`,

    // Checkpoint 3 - READ BETWEEN (Waterstones)
    `Among silent sentinels of ink and page,
Stories wait beyond the stage.
Near the boundary where inside meets out,
Lies the secret you seek without doubt.`,

    // Checkpoint 4 - TAP SECRET (Torrington Place 1-19)
    `Behind guarded doors, knowledge hums low,
Screens flicker where few dare to go.
Descend to the chamber where lessons convene—
Access granted, though rarely seen.`,

    // Checkpoint 5 - SCI SPY (Science Library)
    `Between the atoms of knowledge tightly packed,
Your clue hides in circuits, no text intact,
A gateway lit by cold blue light,
Log in to find what's out of sight.`,

    // Checkpoint 6 - BUDDING GENIUS (Gordon Square Gardens)
    `Beneath leafy shade and whispered lore,
A plaque stands watch forevermore.
History's voice in black and white,
Reveals the path from shadowed light.`,

    // Checkpoint 7 - MUFFIN MISSION (Print Room Cafe)
    `Where once stacks of paper flew,
Now silence serves a different brew.
Approach with calm, your phrase prepared—
"I left something here," be unafraid to declare.`,

    // Checkpoint 8 - ARMCHAIR AGENT (Student Centre)
    `Above the noise, a refuge calls,
Where weary minds find their walls.
Chairs embrace the night's retreat—
The final secret there you'll meet.`
  ];

  return clues[checkpoint] || "No clue available.";
};

export const getLifelineText = (checkpoint: number): { coordinates: string; briefing: string } => {
  const lifelines = [
    // Checkpoint 1 - BAGGAGE CLAIMED (Bag)
    {
      coordinates: "Your Current Location",
      briefing: "The envelope is in the bag you are holding right now. Check all compartments immediately."
    },

    // Checkpoint 2 - STAIRWAY SPY (IOE Stairs)
    {
      coordinates: "51.52302308286143, -0.12790571724339553",
      briefing: "The envelope is found after the first flight of stairs (outside) at the back exit on top of the light fixture. Watch for surveillance."
    },

    // Checkpoint 3 - READ BETWEEN (Waterstones)
    {
      coordinates: "51.522454165104975, -0.13215314814843546",
      briefing: "The envelope is on the 2nd floor, at the windowsill near the Economics section in that reading nook with 3 large windows. Intelligence suggests it's well-concealed."
    },

    // Checkpoint 4 - TAP SECRET (Torrington Place 1-19)
    {
      coordinates: "51.522022847922706, -0.13446886094632468",
      briefing: "The envelope is taped near the card reader outside room B07 in the basement. Approach with caution."
    },

    // Checkpoint 5 - SCI SPY (Science Library)
    {
      coordinates: "51.52345342599542, -0.1325734055812665",
      briefing: "The envelope is digital, accessible only by logging into a PC at this location and navigating to this website. Mobile access has been compromised for security."
    },

    // Checkpoint 6 - BUDDING GENIUS (Gordon Square Gardens)
    {
      coordinates: "51.52378626521969, -0.13017621987985467",
      briefing: "The envelope is located on the black Welcome sign at the entrance near the café. Exercise stealth."
    },

    // Checkpoint 7 - MUFFIN MISSION (Print Room Cafe)
    {
      coordinates: "51.524104345112725, -0.13334199788377926",
      briefing: "The envelope can be retrieved by asking the waiter at the counter \"I left something here—a small envelope.\" They may ask for your name. Use cover identity if necessary."
    },

    // Checkpoint 8 - ARMCHAIR AGENT (Student Centre)
    {
      coordinates: "51.52480024237343, -0.13243339957986588",
      briefing: "The envelope is found inside Group Study Room 4.04. This is your final extraction point."
    }
  ];

  return lifelines[checkpoint] || { coordinates: "No coordinates available.", briefing: "No briefing available." };
};
