// Zork I Map Data and Pathfinding

type Direction = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'u' | 'd' | 'enter' | 'exit' | 'climb' | 'jump' | 'launch';

interface Edge {
    to: string;
    dir: Direction;
    command?: string; // Optional custom command if not just direction
    condition?: string; // e.g., "Hidden until map viewed", "Door locked"
    isLocked?: boolean; // Default true for conditional paths? Or logic to check?
}

interface Graph {
    [key: string]: Edge[];
}

// Comprehensive Zork I Map Data
export const zorkMap: Graph = {
    // --- Surface ---
    'West of House': [
        { to: 'North of House', dir: 'n' },
        { to: 'South of House', dir: 's' },
        { to: 'Forest', dir: 'w' },
        { to: 'Living Room', dir: 'enter', command: 'open window\nenter' },
        { to: 'Stone Barrow', dir: 'sw', condition: 'Hidden entrance', isLocked: true }
    ],
    'North of House': [
        { to: 'West of House', dir: 'w' },
        { to: 'Behind House', dir: 'e' },
        { to: 'Forest Path', dir: 'n' }
    ],
    'South of House': [
        { to: 'West of House', dir: 'w' },
        { to: 'Behind House', dir: 'e' },
        { to: 'Forest', dir: 's' }
    ],
    'Behind House': [
        { to: 'North of House', dir: 'n' },
        { to: 'South of House', dir: 's' },
        { to: 'Kitchen', dir: 'enter', command: 'open window\nenter' },
        { to: 'Clearing', dir: 'e' }
    ],
    'Forest Path': [
        { to: 'North of House', dir: 's' },
        { to: 'Up a Tree', dir: 'u', command: 'climb tree' },
        { to: 'Clearing', dir: 'n' },
        { to: 'Forest', dir: 'e' },
        { to: 'Forest', dir: 'w' }
    ],
    'Forest': [
        { to: 'Clearing', dir: 'n' },
        { to: 'Forest Path', dir: 's' }, // Approximation for navigation
        { to: 'Forest', dir: 'e' },
        { to: 'Forest', dir: 'w' }
    ],
    'Clearing': [
        { to: 'Behind House', dir: 'w' },
        { to: 'Canyon View', dir: 'e' },
        { to: 'Forest Path', dir: 's' },
        { to: 'Forest', dir: 'n' }
    ],
    'Up a Tree': [
        { to: 'Forest Path', dir: 'd' }
    ],
    'Canyon View': [
        { to: 'Clearing', dir: 'w' },
        { to: 'Canyon Bottom', dir: 'd' }
    ],
    'Canyon Bottom': [
        { to: 'Canyon View', dir: 'u' },
        { to: 'End of Rainbow', dir: 'n' }
    ],
    'End of Rainbow': [
        { to: 'Canyon Bottom', dir: 'sw' }
    ],
    'Stone Barrow': [
        { to: 'West of House', dir: 'ne' },
        { to: 'Inside the Barrow', dir: 'enter' }
    ],
    'Inside the Barrow': [
        { to: 'Stone Barrow', dir: 'exit' }
    ],

    // --- House Interior ---
    'Kitchen': [
        { to: 'Behind House', dir: 'exit', command: 'e' },
        { to: 'Living Room', dir: 'w' },
        { to: 'Attic', dir: 'u' }
    ],
    'Living Room': [
        { to: 'Kitchen', dir: 'e' },
        { to: 'West of House', dir: 'w', command: 'open door\nw' },
        { to: 'Cellar', dir: 'd', command: 'move rug\nopen trap door\nd', condition: 'Trapdoor closed', isLocked: true },
        { to: 'Cyclops Room', dir: 'e', command: 'open door\ne', condition: 'Wooden door locked', isLocked: true }
    ],
    'Attic': [
        { to: 'Kitchen', dir: 'd' }
    ],

    // --- Underground: Cellar Area ---
    'Cellar': [
        { to: 'Living Room', dir: 'u' },
        { to: 'The Troll Room', dir: 'n' },
        { to: 'East of Chasm', dir: 's' }
    ],
    'The Troll Room': [
        { to: 'Cellar', dir: 's' },
        { to: 'Maze', dir: 'w' },
        { to: 'East-West Passage', dir: 'e', condition: 'Troll blocking path', isLocked: true }
    ],
    'East of Chasm': [
        { to: 'Cellar', dir: 'n' },
        { to: 'Gallery', dir: 'e' }
    ],
    'Gallery': [
        { to: 'East of Chasm', dir: 'w' },
        { to: 'Studio', dir: 'n' }
    ],
    'Studio': [
        { to: 'Gallery', dir: 's' },
        { to: 'Kitchen', dir: 'u', command: 'u' } // Chimney
    ],

    // --- Underground: Maze Area (Simplified) ---
    'Maze': [
        { to: 'The Troll Room', dir: 'e' },
        { to: 'Cyclops Room', dir: 'n' } // Maze connections are complex, simplifying
    ],
    'Cyclops Room': [
        { to: 'Maze', dir: 'w' },
        { to: 'Living Room', dir: 'e', command: 'open door\ne', condition: 'Wooden door locked', isLocked: true },
        { to: 'Treasure Room', dir: 'u' },
        { to: 'Strange Passage', dir: 'e', condition: 'Cyclops blocking', isLocked: true }
    ],
    'Treasure Room': [
        { to: 'Cyclops Room', dir: 'd' }
    ],
    'Strange Passage': [
        { to: 'Cyclops Room', dir: 'w' },
        { to: 'Living Room', dir: 'e' }
    ],

    // --- Underground: Round Room Area ---
    'East-West Passage': [
        { to: 'The Troll Room', dir: 'w' },
        { to: 'Round Room', dir: 'e' },
        { to: 'Chasm', dir: 'd' }
    ],
    'Round Room': [
        { to: 'East-West Passage', dir: 'w' },
        { to: 'Narrow Ledge', dir: 's' },
        { to: 'Engravings Cave', dir: 'e' },
        { to: 'Deep Canyon', dir: 'n' },
        { to: 'Dome Room', dir: 'u', condition: 'Need rope', isLocked: true }
    ],
    'Deep Canyon': [
        { to: 'Round Room', dir: 's' },
        { to: 'Dam', dir: 'e' },
        { to: 'Reservoir South', dir: 'n' } // Approximation
    ],
    'Dome Room': [
        { to: 'Round Room', dir: 'd' }, // Slide down
        { to: 'Torch Room', dir: 'd' } // Rope
    ],
    'Torch Room': [
        { to: 'Dome Room', dir: 'u' }, // Rope
        { to: 'Temple', dir: 's' }
    ],
    'Temple': [
        { to: 'Torch Room', dir: 'n' },
        { to: 'Egyptian Room', dir: 'e' },
        { to: 'Altar', dir: 's' }
    ],
    'Egyptian Room': [
        { to: 'Temple', dir: 'w' }
    ],
    'Altar': [
        { to: 'Temple', dir: 'n' },
        { to: 'Forest', dir: 'd' } // Magic exit to forest
    ],
    'Engravings Cave': [
        { to: 'Round Room', dir: 'w' },
        { to: 'Dome Room', dir: 'ne' }
    ],

    // --- Underground: Dam Area ---
    'Dam': [
        { to: 'Deep Canyon', dir: 'w' },
        { to: 'Dam Lobby', dir: 'n' },
        { to: 'Reservoir South', dir: 'e' } // Across dam
    ],
    'Dam Lobby': [
        { to: 'Dam', dir: 's' },
        { to: 'Maintenance Room', dir: 'n' },
        { to: 'Maintenance Room', dir: 'e' }
    ],
    'Maintenance Room': [
        { to: 'Dam Lobby', dir: 's' },
        { to: 'Dam Lobby', dir: 'w' }
    ],
    'Reservoir South': [
        { to: 'Dam', dir: 'w' },
        { to: 'Deep Canyon', dir: 'sw' },
        { to: 'Chasm', dir: 'se' }
    ],
    'Reservoir': [
        { to: 'Reservoir South', dir: 's' },
        { to: 'Reservoir North', dir: 'n' }
    ],
    'Reservoir North': [
        { to: 'Reservoir', dir: 's' },
        { to: 'Atlantis Room', dir: 'd' }
    ],
    'Atlantis Room': [
        { to: 'Reservoir North', dir: 'u' }
    ],

    // --- Underground: Coal Mine Area ---
    'Loud Room': [
        { to: 'Round Room', dir: 'w' }, // Echo room
        { to: 'Damp Cave', dir: 'e' }
    ],
    'Damp Cave': [
        { to: 'Loud Room', dir: 'w' },
        { to: 'White Cliffs Beach', dir: 'e' }
    ],
    'White Cliffs Beach': [
        { to: 'Damp Cave', dir: 'w' },
        { to: 'Frigid River', dir: 'launch' }
    ],
    'Frigid River': [
        { to: 'White Cliffs Beach', dir: 'w' },
        { to: 'Sandy Beach', dir: 'e' }
    ],
    'Sandy Beach': [
        { to: 'Frigid River', dir: 'w' },
        { to: 'Shallow Ford', dir: 'ne' }
    ],
    'Shallow Ford': [
        { to: 'Sandy Beach', dir: 'sw' }
    ],

    // --- Hades ---
    'Entrance to Hades': [
        { to: 'Land of the Dead', dir: 'enter', condition: 'Spirits blocking', isLocked: true }
    ],
    'Land of the Dead': [
        { to: 'Entrance to Hades', dir: 'exit' }
    ]
};

interface PathResult {
    path: string[];
    commands: string[];
}

export function findPath(start: string, end: string): PathResult | null {
    if (start === end) return { path: [], commands: [] };
    if (!zorkMap[start] || !zorkMap[end]) return null;

    const queue: { node: string; path: string[]; commands: string[] }[] = [
        { node: start, path: [start], commands: [] }
    ];
    const visited = new Set<string>();
    visited.add(start);

    while (queue.length > 0) {
        const { node, path, commands } = queue.shift()!;

        if (node === end) {
            return { path, commands };
        }

        const neighbors = zorkMap[node] || [];
        for (const edge of neighbors) {
            if (!visited.has(edge.to)) {
                visited.add(edge.to);
                const cmd = edge.command || edge.dir;

                // Handle multi-line commands (split by newline)
                const newCommands = [...commands];
                if (cmd.includes('\n')) {
                    newCommands.push(...cmd.split('\n'));
                } else {
                    newCommands.push(cmd);
                }

                queue.push({
                    node: edge.to,
                    path: [...path, edge.to],
                    commands: newCommands
                });
            }
        }
    }

    return null;
}

export interface NeighborInfo {
    name: string;
    condition?: string;
    isLocked?: boolean;
}

export interface Neighbors {
    n?: NeighborInfo;
    s?: NeighborInfo;
    e?: NeighborInfo;
    w?: NeighborInfo;
    ne?: NeighborInfo;
    nw?: NeighborInfo;
    se?: NeighborInfo;
    sw?: NeighborInfo;
    u?: NeighborInfo;
    d?: NeighborInfo;
}

export function getNeighbors(location: string): Neighbors {
    const neighbors: Neighbors = {};
    const edges = zorkMap[location] || [];

    edges.forEach(edge => {
        if (['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw', 'u', 'd'].includes(edge.dir)) {
            neighbors[edge.dir as keyof Neighbors] = {
                name: edge.to,
                condition: edge.condition,
                isLocked: edge.isLocked
            };
        }
    });

    return neighbors;
}

export const locationList = Object.keys(zorkMap).sort();
