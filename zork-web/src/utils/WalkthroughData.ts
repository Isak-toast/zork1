export interface WalkthroughTask {
    id: string
    text: string
    hint?: string
}

export interface WalkthroughPhase {
    id: string
    title: string
    description: string
    tasks: WalkthroughTask[]
}

export const masterWalkthrough: WalkthroughPhase[] = [
    {
        id: 'phase1',
        title: '🏠 Phase 1: Setup',
        description: 'Secure tools and first treasures.',
        tasks: [
            { id: 'p1_egg', text: 'Get the Jewel-Encrusted Egg (Up a Tree)', hint: 'N, N from start, then UP' },
            { id: 'p1_enter', text: 'Enter the White House', hint: 'Behind house, OPEN WINDOW, ENTER' },
            { id: 'p1_lamp', text: 'Take the Brass Lantern', hint: 'Living Room' },
            { id: 'p1_sword', text: 'Take the Elvish Sword', hint: 'Living Room' },
            { id: 'p1_trapdoor', text: 'Open the Trap Door', hint: 'MOVE RUG, OPEN TRAP DOOR' },
            { id: 'p1_painting', text: 'Get the Painting', hint: 'Gallery (East of Chasm)' },
            { id: 'p1_deposit1', text: 'Deposit first treasures in Trophy Case' },
        ]
    },
    {
        id: 'phase2',
        title: '⚙️ Phase 2: Puzzles',
        description: 'Solve the Dam and Coal Mine.',
        tasks: [
            { id: 'p2_troll', text: 'Defeat the Troll', hint: 'Troll Room' },
            { id: 'p2_dam', text: 'Solve the Dam Puzzle', hint: 'Wrench, Buttons' },
            { id: 'p2_trunk', text: 'Get the Trunk of Jewels', hint: 'Reservoir (after draining)' },
            { id: 'p2_boat', text: 'Inflate and Launch the Boat', hint: 'Dam Base, Air Pump' },
            { id: 'p2_emerald', text: 'Get the Large Emerald', hint: 'Inside Red Buoy' },
            { id: 'p2_scarab', text: 'Get the Jeweled Scarab', hint: 'Sandy Cave (dig)' },
            { id: 'p2_bracelet', text: 'Get the Sapphire Bracelet', hint: 'Gas Room (no flame!)' },
            { id: 'p2_coal', text: 'Get the Coal', hint: 'Coal Mine Dead End' },
            { id: 'p2_diamond', text: 'Turn Coal into Diamond', hint: 'Machine Room' },
            { id: 'p2_jade', text: 'Get the Jade Figurine', hint: 'Bat Room (use Garlic)' },
            { id: 'p2_bar', text: 'Get the Platinum Bar', hint: 'Loud Room (ECHO)' },
            { id: 'p2_trident', text: 'Get the Crystal Trident', hint: 'Atlantis Room' },
            { id: 'p2_deposit2', text: 'Deposit all treasures in Trophy Case' },
        ]
    },
    {
        id: 'phase3',
        title: '🏆 Phase 3: Endgame',
        description: 'Defeat the Thief and enter the Barrow.',
        tasks: [
            { id: 'p3_maze', text: 'Navigate the Maze', hint: 'Drop items to mark' },
            { id: 'p3_coins', text: 'Get the Bag of Coins', hint: 'Maze 5' },
            { id: 'p3_cyclops', text: 'Defeat the Cyclops', hint: 'Say ULYSSES' },
            { id: 'p3_thief', text: 'Kill the Thief', hint: 'Treasure Room' },
            { id: 'p3_chalice', text: 'Get the Silver Chalice', hint: 'Treasure Room' },
            { id: 'p3_hades', text: 'Perform the Hades Ritual', hint: 'Bell, Candles, Book' },
            { id: 'p3_skull', text: 'Get the Crystal Skull', hint: 'Land of Living Dead' },
            { id: 'p3_torch', text: 'Get the Ivory Torch', hint: 'Torch Room' },
            { id: 'p3_coffin', text: 'Get the Gold Coffin', hint: 'Egyptian Room' },
            { id: 'p3_sceptre', text: 'Get the Sceptre', hint: 'Inside Coffin' },
            { id: 'p3_rainbow', text: 'Make the Rainbow Solid', hint: 'Wave Sceptre at Falls' },
            { id: 'p3_pot', text: 'Get the Pot of Gold', hint: 'End of Rainbow' },
            { id: 'p3_canary', text: 'Get the Clockwork Canary', hint: 'Open Egg (Thief opens it)' },
            { id: 'p3_bauble', text: 'Get the Brass Bauble', hint: 'Wind Canary in Forest' },
            { id: 'p3_deposit3', text: 'Deposit ALL treasures (Score: 350)' },
            { id: 'p3_barrow', text: 'Enter the Stone Barrow', hint: 'SW from West of House' },
            { id: 'p3_finish', text: '🎉 THE END!' },
        ]
    }
]

export const getTotalTasks = (): number => {
    return masterWalkthrough.reduce((sum, phase) => sum + phase.tasks.length, 0)
}
