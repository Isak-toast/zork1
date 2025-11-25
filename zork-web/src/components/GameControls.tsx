interface GameControlsProps {
  onCommand: (cmd: string) => void
}

export default function GameControls({ onCommand }: GameControlsProps) {
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
      </div>

      <style>{`
        .controls-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
        }
        .d-pad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
        }
        .action-pad {
          display: grid;
          grid-template-columns: 1fr;
          gap: 5px;
        }
        .control-btn {
          background: #111;
          border: 1px solid #444;
          color: #33ff33;
          padding: 10px 5px;
          font-family: 'VT323', monospace;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.1s;
          text-transform: uppercase;
        }
        .control-btn:hover {
          background: #33ff33;
          color: #000;
        }
        .control-btn:active {
          transform: translateY(2px);
        }
        .direction-btn {
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}
