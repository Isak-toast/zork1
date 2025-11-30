import { useState } from 'react'

interface GameControlsProps {
  onCommand: (cmd: string) => void
  inventory: string[]
}

export default function GameControls({ onCommand, inventory }: GameControlsProps) {
  const [showExamineDropdown, setShowExamineDropdown] = useState(false)

  const directions = [
    { label: 'NW', cmd: 'nw' }, { label: 'N', cmd: 'n' }, { label: 'NE', cmd: 'ne' },
    { label: 'W', cmd: 'w' }, { label: 'Wait', cmd: 'wait' }, { label: 'E', cmd: 'e' },
    { label: 'SW', cmd: 'sw' }, { label: 'S', cmd: 's' }, { label: 'SE', cmd: 'se' },
    { label: 'UP', cmd: 'up' }, { label: 'DOWN', cmd: 'down' }
  ]

  const actions = [
    { label: 'LOOK', cmd: 'look' },
    { label: 'INVENTORY', cmd: 'inventory' },
    { label: 'TAKE ALL', cmd: 'take all' },
    { label: 'DROP ALL', cmd: 'drop all' },
    { label: 'SAVE', cmd: 'save' },
    { label: 'RESTORE', cmd: 'restore' }
  ]

  const handleExamine = (item: string) => {
    onCommand(`examine ${item}`)
    setShowExamineDropdown(false)
  }

  return (
    <div className="controls-container">
      <div className="d-pad">
        {directions.map(d => (
          <button
            key={d.cmd}
            onClick={() => onCommand(d.cmd)}
            className="control-btn direction-btn"
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="action-pad">
        {actions.map(a => (
          <button
            key={a.cmd}
            onClick={() => onCommand(a.cmd)}
            className="control-btn action-btn"
          >
            {a.label}
          </button>
        ))}

        {/* Examine button with dropdown */}
        <div
          className="examine-container"
          onMouseEnter={() => inventory.length > 0 && setShowExamineDropdown(true)}
          onMouseLeave={() => setShowExamineDropdown(false)}
        >
          <button
            className={`control-btn action-btn ${inventory.length === 0 ? 'disabled' : ''}`}
            disabled={inventory.length === 0}
          >
            EXAMINE
          </button>
          {showExamineDropdown && inventory.length > 0 && (
            <div className="examine-dropdown">
              {inventory.map((item, idx) => (
                <div
                  key={idx}
                  className="dropdown-item"
                  onClick={() => handleExamine(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .controls-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
        }
        .d-pad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }
        .action-pad {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 4px;
        }
        .control-btn {
          background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
          border: 3px ridge #4a4a4a;
          color: #f4e8d0;
          padding: 8px 6px;
          font-family: 'VT323', monospace;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.15s ease;
          text-transform: uppercase;
          border-radius: 3px;
          box-shadow: 
            0 3px 8px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3);
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
          letter-spacing: 0.5px;
        }
        .control-btn:hover:not(.disabled) {
          background: linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 100%);
          border-color: #5a5a5a;
          color: #fff;
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.4);
          transform: translateY(-2px);
        }
        .control-btn:active:not(.disabled) {
          transform: translateY(1px);
          box-shadow: 
            0 1px 4px rgba(0, 0, 0, 0.6),
            inset 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        .control-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .direction-btn {
          font-weight: bold;
        }
        .action-btn {
          font-size: 0.9rem;
        }
        .examine-container {
          position: relative;
          grid-column: span 2;
        }
        .examine-dropdown {
          position: absolute;
          bottom: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
          border: 3px ridge #4a4a4a;
          border-radius: 3px;
          margin-bottom: 4px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
        }
        .dropdown-item {
          padding: 8px 12px;
          color: #f4e8d0;
          font-family: 'VT323', monospace;
          font-size: 1rem;
          text-transform: capitalize;
          cursor: pointer;
          border-bottom: 1px solid #3a3a3a;
          transition: all 0.1s;
        }
        .dropdown-item:last-child {
          border-bottom: none;
        }
        .dropdown-item:hover {
          background: #3a3a3a;
          color: #fff;
        }
      `}</style>
    </div>
  )
}
