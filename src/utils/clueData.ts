export const getClueText = (checkpoint: number): string => {
  const clues = [
    // Checkpoint 1 - HANDBAG
    `I'm zipped, I'm clipped, I'm slung with pride,
Your daily sidekick, stuff inside.
To start your quest, don't look too far—
Your answer's where your essentials are.`,

    // Checkpoint 2 - CLASSROOM
    `Near the hum of trains and city's flow,
A chilly breeze from vents that blow.
Screens appear at a gentle command,
Down the stairs, deep in recess.
Find your clue where work feels right— A hidden secret out of sight.`,

    // Checkpoint 3 - BOOKMARK
    `Image clue - blurred Waterstones image`,

    // Checkpoint 4 - LABCOAT
    `Agent, your next clue isn't hidden in a book or behind a monitor—it's somewhere only the truly tech-savvy can find.

In Malet's maze where quiet thrives,
We've sat together, shared plenty of vibes.
Screens glow softly, rows on rows,
Floors above and floors below.
To unlock your next secret's gate,
Log in now—don't hesitate.
On any PC, open this site,
The bigger screen reveals your light.`,

    // Checkpoint 5 - ATTENDANCE
    `On Mondays at noon, a lecture you'd miss,
While I'd tap your card—attendance bliss.
We watched Eega, the fly's revenge in sight,
But left before the end of night.
Find the hall where cards unlock,
Your next clue waits—just take stock.`,

    // Checkpoint 6 - ESPRESSO
    `Where pages once turned and printers roared,
Now quiet sips replace what's poured.
You're on a coffee ban, but memories stay—
Go up to the counter or a waiter,
Say, 'I left something here—a small envelope.'
Don't worry—they don't know about the mission,
Just ask confidently, and you'll get what you came for!`,

    // Checkpoint 7 - PHOTOSHOOT
    `On sunny steps where light would play,
You snapped my red dress in perfect sway.
A friend nearby, the scene was bright,
Posing there felt just right.
Find the stairs where memories gleam—
Your next clue waits beside the beam.`,

    // Checkpoint 8 - ALLNIGHT
    `At the peak of study, high above the ground,
A room exists where comfort's found.
Comfy armchairs just outside its door,
Where three friends stayed when night was in store.
Parents abroad, a late-night stay,
Too dark to wander home that day.
A 24/7 place where all blend—
Your final clue waits at the very end.`
  ];

  return clues[checkpoint] || "No clue available.";
};

export const getLifelineText = (checkpoint: number): string => {
  const lifelines = [
    // Checkpoint 1 - HANDBAG
    "The password is HANDBAG. Obviously, you fool. Now, you wasted a lifeline.",

    // Checkpoint 2 - CLASSROOM
    "The password is CLASSROOM. 1-19 Torrington Place, duh.",

    // Checkpoint 3 - BOOKMARK
    "The password is BOOKMARK. It's Waterstones, where you took your profile picture!",

    // Checkpoint 4 - LABCOAT
    "The password is LABCOAT. It's like I have to tell you everything. It was Science Library!!!",

    // Checkpoint 5 - ATTENDANCE
    "The password is ATTENDANCE, which is something you had a very low % of at your lectures in Medawar Building.",

    // Checkpoint 6 - ESPRESSO
    "The password is ESPRESSO. Were you too socially anxious to say anything in Print Room Cafe?",

    // Checkpoint 7 - PHOTOSHOOT
    "The password is PHOTOSHOOT. Remember?! That sunny day at the IOE stairs?!!!!",

    // Checkpoint 8 - ALLNIGHT
    "The password is ALLNIGHT. Have you genuinely blocked out that eventful night at the Student Centre in Group Study Room 4.04?"
  ];

  return lifelines[checkpoint] || "No lifeline available.";
};
