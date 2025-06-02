
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

    // Checkpoint 3 - READ BETWEEN
    `Where tales flow like rivers, calm and deep,
And pages rest where quiet waters sleep.
On the second floor, you know it well.
By a window's edge, with light just right,
She captured her profile in the soft daylight.
Seek the spot where books and views entwine—
The clue awaits where glass and stories align.`,

    // Checkpoint 4 - SCI SPY
    `Agent, your next clue isn't hidden in a book or behind a monitor—it's somewhere only the truly tech-savvy can find.

In Malet's maze where quiet thrives,
We've sat together, shared plenty of vibes.
Screens glow softly, rows on rows,
Floors above and floors below.
To unlock your next secret's gate,
Log in now—don't hesitate.
On any PC, open this site,
The bigger screen reveals your light.`,

    // Checkpoint 5 - BUDDING GENIUS
    `In a square where education's heart beats near,
A garden thrives, calm and clear.
Find the black sign where stories are told,
Of learning's past and wisdom old.`,

    // Checkpoint 6 - MUFFIN MISSION
    `Where pages once turned and printers roared,
Now quiet sips replace what's poured.
You're on a coffee ban, but memories stay—
Go up to the counter or a waiter,
Say, 'I left something here—a small envelope.'
Don't worry—they don't know about the mission,
Just ask confidently, and you'll get what you came for!`,

    // Checkpoint 7 - STAIRWAY SPY
    `On sunny steps where light would play,
You snapped my red dress in perfect sway.
A friend nearby, the scene was bright,
Posing there felt just right.
Find the stairs where memories gleam—
Your next clue waits beside the beam.`,

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

export const getLifelineText = (checkpoint: number): string => {
  const lifelines = [
    // Checkpoint 1 - BAGGAGE CLAIMED
    "The password is BAGGAGE CLAIMED. Obviously, you fool. Now, you wasted a lifeline.",

    // Checkpoint 2 - TAP SECRET
    "The password is TAP SECRET. 1-19 Torrington Place, duh.",

    // Checkpoint 3 - READ BETWEEN
    "The password is READ BETWEEN. It's Waterstones, where you took your profile picture!",

    // Checkpoint 4 - SCI SPY
    "The password is SCI SPY. It's like I have to tell you everything. It was Science Library!!!",

    // Checkpoint 5 - BUDDING GENIUS
    "The password is BUDDING GENIUS, which is something you should know about Gordon Square Gardens.",

    // Checkpoint 6 - MUFFIN MISSION
    "The password is MUFFIN MISSION. Were you too socially anxious to say anything in Print Room Cafe?",

    // Checkpoint 7 - STAIRWAY SPY
    "The password is STAIRWAY SPY. Remember?! That sunny day at the IOE stairs?!!!!",

    // Checkpoint 8 - ARMCHAIR AGENT
    "The password is ARMCHAIR AGENT. Have you genuinely blocked out that eventful night at the Student Centre in Group Study Room 4.04?"
  ];

  return lifelines[checkpoint] || "No lifeline available.";
};
