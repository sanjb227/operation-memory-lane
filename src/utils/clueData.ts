export const getClueText = (checkpoint: number): string => {
  const clues = [
    // Checkpoint 1 - BAGGAGE CLAIMED
    `I'm zipped, I'm clipped, I'm slung with pride,
Your daily sidekick, stuff inside.
To start your quest, don't look too far—
Your answer's where your essentials are.`,

    // Checkpoint 2 - TAP SECRET
    `Near the hum of trains and city's flow,
A chilly breeze from vents that blow.
Screens appear at a gentle command,
Down the stairs, deep in recess.
Seek the spot where access is granted—
A secret awaits, hidden from view.`,

    // Checkpoint 3 - SCI SPY
    `Agent, your next clue isn't hidden in a book or behind a monitor—it's somewhere only the truly tech-savvy can find.

In Malet's maze where quiet thrives,
We've sat together, shared plenty of vibes.
Screens glow softly, rows on rows,
Floors above and floors below.
To unlock your next secret's gate,
Log in now—don't hesitate.
On any PC, open this site,
The bigger screen reveals your light.`,

    // Checkpoint 4 - READ BETWEEN
    `Where tales flow like rivers, calm and deep,
And pages rest where quiet waters sleep.
On the second floor, you know it well.
By a window's edge, with light just right,
She captured her profile in the soft daylight.
Seek the spot where books and views entwine—
The clue awaits where glass and stories align.`,

    // Checkpoint 5 - BUDDING GENIUS
    `In a square where education's heart beats near,
A garden thrives, calm and clear.
Find the black sign where stories are told,
Of learning's past and wisdom old.`,

    // Checkpoint 6 - STAIRWAY SPY
    `On sunny steps where light would play,
You snapped my red dress in perfect sway.
A friend nearby, the scene was bright,
Posing there felt just right.
Find the stairs where memories gleam—
Your next clue waits beside the beam.`,

    // Checkpoint 7 - MUFFIN MISSION
    `Where pages once turned and printers roared,
Now quiet sips replace what's poured.
You're on a coffee ban, but memories stay—
Go up to the counter or a waiter,
Say, 'I left something here—a small envelope.'
Don't worry—they don't know about the mission,
Just ask confidently, and you'll get what you came for!`,

    // Checkpoint 8 - ARMCHAIR AGENT
    `At the peak of study, high above the ground,
A room exists where comfort's found.
Comfy armchairs just outside its door,
Where three friends stayed when night was in store.
Parents away, a late-night stay,
Too dark to wander home that day.
A place where all blend—
Your final clue waits at the very end.`
  ];

  return clues[checkpoint] || "No clue available.";
};

export const getLifelineText = (checkpoint: number): { coordinates: string; briefing: string } => {
  const lifelines = [
    // Checkpoint 1 - BAGGAGE CLAIMED
    {
      coordinates: "Your Current Location",
      briefing: "The envelope is in the bag you are holding right now. Check all compartments immediately."
    },

    // Checkpoint 2 - TAP SECRET
    {
      coordinates: "51.522022847922706, -0.13446886094632468",
      briefing: "The envelope is taped near the card reader outside room B07 in the basement. Approach with caution."
    },

    // Checkpoint 3 - SCI SPY
    {
      coordinates: "51.52345342599542, -0.1325734055812665",
      briefing: "The envelope is digital, accessible only by logging into a PC at this location and navigating to this website. Mobile access has been compromised for security."
    },

    // Checkpoint 4 - READ BETWEEN
    {
      coordinates: "51.522454165104975, -0.13215314814843546",
      briefing: "The envelope is on the 2nd floor, at the windowsill near the Economics section in that reading nook with 3 large windows. Intelligence suggests it's well-concealed."
    },

    // Checkpoint 5 - BUDDING GENIUS
    {
      coordinates: "51.52378626521969, -0.13017621987985467",
      briefing: "The envelope is located on the black Welcome sign at the entrance near the café. Exercise stealth."
    },

    // Checkpoint 6 - STAIRWAY SPY
    {
      coordinates: "51.52302308286143, -0.12790571724339553",
      briefing: "The envelope is found after the first flight of stairs (outside) at the back exit on top of the light fixture. Watch for surveillance."
    },

    // Checkpoint 7 - MUFFIN MISSION
    {
      coordinates: "51.524104345112725, -0.13334199788377926",
      briefing: "The envelope can be retrieved by asking the waiter at the counter \"I left something here—a small envelope.\" They may ask for your name. Use cover identity if necessary."
    },

    // Checkpoint 8 - ARMCHAIR AGENT
    {
      coordinates: "51.52480024237343, -0.13243339957986588",
      briefing: "The envelope is found inside Group Study Room 4.04. This is your final extraction point."
    }
  ];

  return lifelines[checkpoint] || { coordinates: "No coordinates available.", briefing: "No briefing available." };
};
