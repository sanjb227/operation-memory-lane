
export const getClueText = (checkpoint: number): string => {
  const clues = [
    // Checkpoint 1 - BACKPACK
    `I'm zipped, I'm clipped, I'm slung with pride,
Your daily sidekick, stuff inside.
To start your quest, don't look too far—
Your answer's where your essentials are.`,

    // Checkpoint 2 - CLASSROOM
    `Agent, your next destination awaits.
Head to Torrington Place, where knowledge creates.
Look for the room where lessons are taught,
The code you seek is what learning has brought.`,

    // Checkpoint 3 - WATERSTONES
    `Between the pages of stories untold,
Where books are traded, bought and sold.
A chain of knowledge, words to explore,
Find your next clue in this literary store.`,

    // Checkpoint 4 - LIBRARY
    `Where silence reigns and knowledge flows,
Where students study and wisdom grows.
Science and learning, floor by floor,
Your next code waits behind knowledge's door.`,

    // Checkpoint 5 - MEDAWAR
    `Named for a Nobel Prize winner true,
This building houses research too.
Where experiments and theories blend,
Your mission's path will here extend.`,

    // Checkpoint 6 - CAFE
    `When energy runs low and spirits need lift,
This place provides caffeinated gift.
Where printing meets refreshment's call,
Your next clue waits within these walls.`,

    // Checkpoint 7 - CROATIA
    `A planning room with foreign name,
Where future courses stake their claim.
In IOE where teachers train,
This coded word will break the chain.`,

    // Checkpoint 8 - STAIRS
    `Agent, it's Aven again.

Honestly, I'm shocked you've made it this far. I had a bet going in HQ that you'd get distracted by irrelevant details by now, but here you are—one step from the finish line.

This is your last checkpoint before the grand finale. Stay sharp, Agent. The diploma is almost within reach. It's best not to think about whether the clues even relate to your diploma at this stage. But hey, trust me—it'll all be worth it in the end.

Now, let's see if you can pull off the impossible one more time.

Up and down, step by step you go,
In IOE where knowledge can flow.
Your path ascends to reach your goal,
These steps will make your mission whole.`,

    // Checkpoint 9 - ALLNIGHT
    `The final stretch, your journey's end,
Where students gather, study, and blend.
When deadlines loom and time runs late,
This centre opens, seals your fate.`
  ];

  return clues[checkpoint] || "No clue available.";
};
