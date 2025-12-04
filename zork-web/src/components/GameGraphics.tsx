interface GameGraphicsProps {
  location: string
}

// Location name to image file mapping
const locationImages: Record<string, string> = {
  'West of House': '/images/west_of_house.png',
  'North of House': '/images/north_of_house.png',
  'South of House': '/images/south_of_house.png',
  'Behind House': '/images/behind_house.png',
  'Clearing': '/images/clearing.png',
  'Canyon View': '/images/canyon_view.png',
  'Forest Path': '/images/forest_path.png',
  'Forest': '/images/forest_path.png', // Reuse for generic forest
  'Stone Barrow': '/images/stone_barrow.png',
  'Up a Tree': '/images/up_a_tree.png',

  // Interior
  'Kitchen': '/images/kitchen.png',
  'Living Room': '/images/living_room.png',
  'Attic': '/images/attic.png',
  'Studio': '/images/studio.png',
  'Gallery': '/images/gallery.png',

  // Underground
  'Cellar': '/images/cellar.png',
  'The Troll Room': '/images/troll_room.png',
  'Treasure Room': '/images/treasure_room.png',
  'Maze': '/images/maze.png',
  'Dead End': '/images/dead_end.png',
  'Grating Room': '/images/grating_room.png',
  'East of Chasm': '/images/east_of_chasm.png',
  'Dome Room': '/images/dome_room.png',
  'Torch Room': '/images/torch_room.png',
  'Temple': '/images/temple.png',
  'Altar': '/images/altar.png',
  'Egyptian Room': '/images/egyptian_room.png',
  'Cyclops Room': '/images/cyclops_room.png',
  'Strange Passage': '/images/strange_passage.png',
  'Round Room': '/images/round_room.png',
  'Loud Room': '/images/loud_room.png',
  'Entrance to Hades': '/images/entrance_to_hades.png',
  'Land of the Dead': '/images/land_of_the_dead.png',
  'Engravings Cave': '/images/engravings_cave.png',

  // Dam & River
  'Dam': '/images/dam.png',
  'Dam Lobby': '/images/dam_lobby.png',
  'Maintenance Room': '/images/maintenance_room.png',
  'Dam Base': '/images/dam_base.png',
  'Reservoir': '/images/reservoir.png',
  'Reservoir North': '/images/reservoir_north.png',
  'Reservoir South': '/images/reservoir.png', // Reuse reservoir
  'Atlantis Room': '/images/atlantis_room.png',
  'Frigid River': '/images/frigid_river.png',
  'White Cliffs Beach': '/images/white_cliffs_beach.png',
  'Sandy Beach': '/images/sandy_beach.png',
  'Aragain Falls': '/images/aragain_falls.png',
  'End of Rainbow': '/images/end_of_rainbow.png',
  'On the Rainbow': '/images/aragain_falls.png', // Reuse falls
  'Canyon Bottom': '/images/canyon_bottom.png',

  // Mirror
  'Mirror Room': '/images/mirror_room.png',
}

export default function GameGraphics({ location }: GameGraphicsProps) {
  const getImageUrl = (loc: string) => {
    // Check if we have a specific image for this location
    if (locationImages[loc]) {
      return locationImages[loc]
    }

    // Otherwise, create a dark pixel art style SVG placeholder
    const svg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#1a1a2e"/>
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f1419" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(#grid)"/>
      <rect x="50" y="50" width="700" height="500" fill="#16213e" stroke="#0f3460" stroke-width="4"/>
      <text x="400" y="280" font-family="monospace" font-size="32" fill="#33ff33" text-anchor="middle" font-weight="bold">${loc}</text>
      <text x="400" y="330" font-family="monospace" font-size="16" fill="#888" text-anchor="middle">Pixel art coming soon...</text>
      <text x="400" y="360" font-family="monospace" font-size="14" fill="#666" text-anchor="middle">Add image to public/images/</text>
    </svg>`
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  return (
    <div className="graphics-display">
      <img
        src={getImageUrl(location)}
        alt={`Scene: ${location}`}
        className="scene-image"
      />

      <div className="location-label">
        {location}
      </div>

      <style>{`
        .graphics-display {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #000;
        }
        .scene-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
        .location-label {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: linear-gradient(135deg, rgba(61, 40, 23, 0.95) 0%, rgba(43, 24, 16, 0.95) 100%);
          padding: 8px 16px;
          border: 3px double #5c3d2e;
          color: #f4e8d0;
          font-size: 1.6rem;
          font-family: 'VT323', monospace;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.9),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  )
}
