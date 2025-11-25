interface GameGraphicsProps {
  location: string
}

// Location name to image file mapping
const locationImages: Record<string, string> = {
  'Forest Path': '/images/forest_path.png',
  'Forest': '/images/forest_path.png', // Reuse for generic forest
  // Add more as images are created:
  // 'West of House': '/images/west_of_house.png',
  // 'Living Room': '/images/living_room.png',
  // 'Cellar': '/images/cellar.png',
  // 'The Troll Room': '/images/troll_room.png',
  // 'Treasure Room': '/images/treasure_room.png',
  // 'Maze': '/images/maze.png',
  // 'Dam': '/images/dam.png',
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
          background: #0a0a0a;
        }
        .scene-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
        .location-label {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.8);
          padding: 8px 15px;
          border: 2px solid #33ff33;
          color: #33ff33;
          font-size: 1.5rem;
          font-family: 'VT323', monospace;
          text-shadow: 0 0 10px #33ff33;
          box-shadow: 0 0 20px rgba(51, 255, 51, 0.3);
        }
      `}</style>
    </div>
  )
}
