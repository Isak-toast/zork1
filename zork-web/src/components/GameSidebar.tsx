import React, { useState, useEffect } from 'react'
import { locationList, getNeighbors, Neighbors } from '../utils/ZorkMap'
import { masterWalkthrough, getTotalTasks } from '../utils/WalkthroughData'

interface GameSidebarProps {
  onRunMacro: (macroId: string) => void
  currentLocation: string
  onNavigate: (target: string) => void
}

const GameSidebar: React.FC<GameSidebarProps> = ({ onRunMacro, currentLocation, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'routes' | 'tips' | 'macros' | 'nav'>('nav')
  const [targetLocation, setTargetLocation] = useState<string>(locationList[0])
  const [neighbors, setNeighbors] = useState<Neighbors>({})
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())

  useEffect(() => {
    setNeighbors(getNeighbors(currentLocation))
  }, [currentLocation])

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const renderMiniMapCell = (dir: keyof Neighbors, label: string) => {
    const neighbor = neighbors[dir];
    const isLocked = neighbor?.isLocked;
    const title = isLocked ? `${neighbor.name} (${neighbor.condition})` : neighbor?.name || '';

    return (
      <div
        className={`map-cell ${neighbor ? 'has-neighbor' : ''} ${isLocked ? 'locked' : ''}`}
        title={title}
      >
        {neighbor ? (
          <div className="cell-content">
            <span className="dir-label">{label}</span>
            {isLocked && <span className="lock-icon">🔒</span>}
            <span className="loc-name">{neighbor.name}</span>
          </div>
        ) : (
          <span className="empty-cell"></span>
        )}
      </div>
    )
  }

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2>ADVENTURER'S GUIDE</h2>
        <div className="current-location">
          📍 {currentLocation}
        </div>
      </div>

      <div className="sidebar-tabs">
        <button
          className={activeTab === 'nav' ? 'active' : ''}
          onClick={() => setActiveTab('nav')}
        >
          NAV
        </button>
        <button
          className={activeTab === 'macros' ? 'active' : ''}
          onClick={() => setActiveTab('macros')}
        >
          MACROS
        </button>
        <button
          className={activeTab === 'routes' ? 'active' : ''}
          onClick={() => setActiveTab('routes')}
        >
          ROUTES
        </button>
        <button
          className={activeTab === 'tips' ? 'active' : ''}
          onClick={() => setActiveTab('tips')}
        >
          TIPS
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'nav' && (
          <div className="nav-section">
            <div className="mini-map-container">
              <h3>Compass Map</h3>
              <div className="mini-map-grid">
                {renderMiniMapCell('nw', 'NW')}
                {renderMiniMapCell('n', 'N')}
                {renderMiniMapCell('ne', 'NE')}

                {renderMiniMapCell('w', 'W')}
                <div className="map-cell current-cell">
                  <div className="cell-content">
                    <span className="current-loc-text">{currentLocation}</span>
                  </div>
                </div>
                {renderMiniMapCell('e', 'E')}

                {renderMiniMapCell('sw', 'SW')}
                {renderMiniMapCell('s', 'S')}
                {renderMiniMapCell('se', 'SE')}
              </div>
              <div className="vertical-neighbors">
                {neighbors.u && (
                  <div className={`v-neighbor ${neighbors.u.isLocked ? 'locked' : ''}`} title={neighbors.u.condition}>
                    ⬆️ Up: {neighbors.u.name} {neighbors.u.isLocked && '🔒'}
                  </div>
                )}
                {neighbors.d && (
                  <div className={`v-neighbor ${neighbors.d.isLocked ? 'locked' : ''}`} title={neighbors.d.condition}>
                    ⬇️ Down: {neighbors.d.name} {neighbors.d.isLocked && '🔒'}
                  </div>
                )}
              </div>
            </div>

            <hr className="divider" />

            <h3>Smart Travel</h3>
            <p className="nav-desc">Select a destination to auto-travel.</p>

            <div className="nav-controls">
              <select
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
                className="location-select"
              >
                {locationList.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <button
                className="nav-go-btn"
                onClick={() => onNavigate(targetLocation)}
                disabled={currentLocation === targetLocation}
              >
                GO
              </button>
            </div>
          </div>
        )}

        {activeTab === 'macros' && (
          <div className="macros-section">
            <h3>Quick Actions</h3>
            <div className="macro-grid">
              <button onClick={() => onRunMacro('start_forest')}>
                🌲 Start → Forest
              </button>
              <button onClick={() => onRunMacro('enter_house')}>
                🏠 Enter House
              </button>
              <button onClick={() => onRunMacro('get_lantern')}>
                🔦 Get Essentials
              </button>
              <button onClick={() => onRunMacro('open_trapdoor')}>
                🚪 Open Trapdoor
              </button>
              <button onClick={() => onRunMacro('get_egg')}>
                🥚 Get Egg
              </button>
              <button onClick={() => onRunMacro('dam_route')}>
                💧 Go to Dam
              </button>
            </div>

            <div className="macro-info">
              <p>⚠️ Macros execute multiple commands automatically. Wait for them to finish.</p>
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="routes-section">
            <div className="walkthrough-progress">
              <span>Progress: {completedTasks.size} / {getTotalTasks()}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(completedTasks.size / getTotalTasks()) * 100}%` }}
                />
              </div>
            </div>

            {masterWalkthrough.map(phase => (
              <div key={phase.id} className="phase-section">
                <h4 className="phase-title">{phase.title}</h4>
                <p className="phase-desc">{phase.description}</p>
                <ul className="task-list">
                  {phase.tasks.map(task => (
                    <li
                      key={task.id}
                      className={`task-item ${completedTasks.has(task.id) ? 'completed' : ''}`}
                      title={task.hint || ''}
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={completedTasks.has(task.id)}
                          onChange={() => toggleTask(task.id)}
                        />
                        <span className="task-text">{task.text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="tips-section">
            <ul className="tips-list">
              <li>
                <strong>Save Often:</strong> Use the <code>SAVE</code> command frequently. Zork is unforgiving.
              </li>
              <li>
                <strong>Map It Out:</strong> Draw a map as you explore. The maze is impossible without one.
              </li>
              <li>
                <strong>Inventory Management:</strong> You can only carry so much. Drop items in a central location (like the Living Room).
              </li>
              <li>
                <strong>Listen:</strong> Read descriptions carefully. Hints are often hidden in the text.
              </li>
              <li>
                <strong>Light:</strong> Don't enter dark areas without your lamp turned on, or you will be eaten by a grue.
              </li>
            </ul>
          </div>
        )}
      </div>

      <style>{`
        .sidebar-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
          border: 4px double #4a4a4a;
          color: #f4e8d0;
          font-family: 'VT323', monospace;
          box-shadow: -5px 0 15px rgba(0,0,0,0.5);
        }

        .sidebar-header {
          background: #2a2a2a;
          padding: 10px;
          text-align: center;
          border-bottom: 2px solid #4a4a4a;
        }

        .sidebar-header h2 {
          margin: 0;
          font-size: 1.8rem;
          color: #d4af37;
          text-shadow: 2px 2px 0 #000;
        }

        .current-location {
          margin-top: 5px;
          font-size: 1.2rem;
          color: #88cc88;
        }

        .sidebar-tabs {
          display: flex;
          border-bottom: 2px solid #4a4a4a;
        }

        .sidebar-tabs button {
          flex: 1;
          background: #1a1a1a;
          border: none;
          border-right: 1px solid #4a4a4a;
          padding: 10px;
          color: #888;
          font-family: inherit;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sidebar-tabs button:last-child {
          border-right: none;
        }

        .sidebar-tabs button:hover {
          background: #252525;
          color: #fff;
        }

        .sidebar-tabs button.active {
          background: #2a2a2a;
          color: #d4af37;
          font-weight: bold;
          box-shadow: inset 0 -2px 0 #d4af37;
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
        }

        /* Mini Map Styles */
        .mini-map-container {
          margin-bottom: 20px;
          text-align: center;
        }

        .mini-map-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          margin: 10px auto;
          max-width: 240px;
          background: #111;
          padding: 4px;
          border: 2px solid #444;
          border-radius: 4px;
        }

        .map-cell {
          aspect-ratio: 1;
          background: #222;
          border: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .map-cell.has-neighbor {
          background: #2a3a2a;
          border-color: #4a5a4a;
          cursor: help;
        }

        .map-cell.locked {
          background: #3a1a1a;
          border-color: #8a3a3a;
        }

        .map-cell.current-cell {
          background: #3a2a2a;
          border-color: #d4af37;
          box-shadow: inset 0 0 10px rgba(212, 175, 55, 0.2);
        }

        .cell-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: 2px;
        }

        .dir-label {
          font-size: 0.8rem;
          color: #666;
          position: absolute;
          top: 2px;
          left: 2px;
        }

        .loc-name {
          font-size: 0.7rem;
          color: #88cc88;
          text-align: center;
          line-height: 1;
          word-break: break-word;
          margin-top: 8px;
        }

        .locked .loc-name {
          color: #cc8888;
        }

        .lock-icon {
          font-size: 0.8rem;
          position: absolute;
          top: 2px;
          right: 2px;
        }

        .current-loc-text {
          font-size: 0.8rem;
          color: #d4af37;
          text-align: center;
          font-weight: bold;
          line-height: 1.1;
        }

        .vertical-neighbors {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 8px;
          font-size: 0.9rem;
          color: #aaa;
        }

        .v-neighbor {
          background: #222;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #333;
          cursor: help;
        }

        .v-neighbor.locked {
          background: #3a1a1a;
          border-color: #8a3a3a;
          color: #cc8888;
        }

        .divider {
          border: 0;
          border-top: 1px solid #444;
          margin: 20px 0;
        }

        /* Navigation Styles */
        .nav-section {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .nav-desc {
          color: #aaa;
          margin: 0;
        }

        .nav-controls {
          display: flex;
          gap: 10px;
        }

        .location-select {
          flex: 1;
          background: #000;
          color: #f4e8d0;
          border: 1px solid #4a4a4a;
          padding: 8px;
          font-family: inherit;
          font-size: 1.1rem;
        }

        .nav-go-btn {
          background: #2a5a2a;
          color: #fff;
          border: 1px solid #4a8a4a;
          padding: 0 20px;
          font-family: inherit;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-go-btn:hover:not(:disabled) {
          background: #3a6a3a;
          transform: scale(1.05);
        }

        .nav-go-btn:disabled {
          background: #333;
          border-color: #444;
          color: #666;
          cursor: not-allowed;
        }

        .nav-info {
          margin-top: 10px;
          padding: 10px;
          background: rgba(255, 100, 100, 0.1);
          border: 1px dashed #d45555;
          font-size: 0.9rem;
          color: #d48888;
        }

        /* Macros Styles */
        .macro-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .macro-grid button {
          background: #2a2a2a;
          border: 1px solid #4a4a4a;
          padding: 12px;
          color: #f4e8d0;
          font-family: inherit;
          font-size: 1.2rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .macro-grid button:hover {
          background: #3a3a3a;
          border-color: #d4af37;
          transform: translateX(2px);
        }

        .macro-info {
          margin-top: 20px;
          padding: 10px;
          background: rgba(255, 200, 0, 0.1);
          border: 1px dashed #d4af37;
          font-size: 0.9rem;
          color: #d4af37;
        }

        /* Walkthrough Checklist Styles */
        .walkthrough-progress {
          margin-bottom: 15px;
          text-align: center;
        }

        .walkthrough-progress span {
          color: #d4af37;
          font-size: 1.2rem;
        }

        .progress-bar {
          margin-top: 8px;
          height: 10px;
          background: #222;
          border: 1px solid #444;
          border-radius: 5px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #2a6a2a, #4a8a4a);
          transition: width 0.3s ease;
        }

        .phase-section {
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.03);
          padding: 10px;
          border-radius: 4px;
        }

        .phase-title {
          margin: 0 0 5px 0;
          color: #d4af37;
          font-size: 1.3rem;
          border-bottom: 1px solid #444;
          padding-bottom: 5px;
        }

        .phase-desc {
          margin: 0 0 10px 0;
          color: #888;
          font-size: 0.95rem;
        }

        .task-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .task-item {
          margin-bottom: 6px;
          padding: 5px 8px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
          transition: all 0.2s;
        }

        .task-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .task-item label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .task-item input[type="checkbox"] {
          accent-color: #4a8a4a;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .task-text {
          color: #ccc;
          font-size: 1rem;
        }

        .task-item.completed .task-text {
          text-decoration: line-through;
          color: #666;
        }

        .task-item.completed {
          opacity: 0.7;
        }

        /* Tips Styles */
        .tips-list {
          padding-left: 20px;
        }

        .tips-list li {
          margin-bottom: 15px;
          line-height: 1.4;
        }

        .tips-list strong {
          color: #d4af37;
          display: block;
          margin-bottom: 4px;
        }

        code {
          background: #000;
          padding: 2px 4px;
          border-radius: 2px;
          color: #88cc88;
        }
      `}</style>
    </div>
  )
}

export default GameSidebar
