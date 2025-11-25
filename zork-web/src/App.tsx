
import { useState, useEffect, useRef } from 'react'
import './App.css'
import GameTerminal from './components/GameTerminal'
import GameGraphics from './components/GameGraphics'
import GameControls from './components/GameControls'
// @ts-ignore
import JSZM from './jszm.js'

function App() {
  const [output, setOutput] = useState<string[]>([])
  const [location, setLocation] = useState<string>('West of House')
  const [isReady, setIsReady] = useState(false)

  const jszmRef = useRef<any>(null)
  const runnerRef = useRef<any>(null)
  const inputResolverRef = useRef<((val: string) => void) | null>(null)

  useEffect(() => {
    const initGame = async () => {
      try {
        const response = await fetch('/zork1.z3')
        const buffer = await response.arrayBuffer()
        const data = new Uint8Array(buffer)

        const jszm = new JSZM(data)
        jszmRef.current = jszm

        // Setup IO
        jszm.print = function* (text: string) {
          // Handle text output
          // We need to buffer lines or handle partial updates
          // For simplicity, we'll just append to output
          if (text) {
            // Clean up text slightly if needed
            setOutput(prev => {
              const newLines = text.split('\n')
              // If the last line of prev is not empty and the new text doesn't start with newline,
              // we might need to merge. But for now, let's just add.
              return [...prev, ...newLines].filter(line => line !== null)
            })
            checkForLocation(text)
          }
          yield
        }

        jszm.read = function* (maxlen: number) {
          // Wait for input
          const input: string = yield new Promise<string>(resolve => {
            inputResolverRef.current = resolve
          })
          return (input || '').slice(0, maxlen)
        }

        jszm.updateStatusLine = function* (text: string, score: number, moves: number) {
          // We can update a status state here if we want
          yield
        }

        // Start the game loop
        runnerRef.current = jszm.run()
        advanceGame()
        setIsReady(true)

      } catch (err) {
        console.error("Failed to load game:", err)
        setOutput(["Error loading Zork I game file."])
      }
    }

    initGame()
  }, [])

  const advanceGame = async () => {
    if (!runnerRef.current) return

    try {
      const res = runnerRef.current.next()

      if (res.done) {
        console.log("Game finished")
        return
      }

      if (res.value instanceof Promise) {
        // Waiting for input - the promise will be resolved by handleCommand
        await res.value
        // After input is resolved, continue to next step
        advanceGame()
      } else {
        // Just a yield for print or other ops, continue immediately
        advanceGame()
      }
    } catch (e) {
      console.error("Game error:", e)
    }
  }

  const checkForLocation = (text: string) => {
    const locations = [
      "West of House", "North of House", "South of House", "Behind House",
      "Kitchen", "Living Room", "Attic", "Forest", "Canyon View",
      "Clearing", "Canyon Bottom", "End of Rainbow", "Chimney",
      "Studio", "Gallery", "Mailbox"
    ]

    for (const loc of locations) {
      if (text.includes(loc)) {
        setLocation(loc)
        break
      }
    }
  }

  const handleCommand = (cmd: string) => {
    if (inputResolverRef.current) {
      handleOutput(`> ${cmd}`)
      const resolve = inputResolverRef.current
      inputResolverRef.current = null
      // Z-machine expects input to end with newline
      resolve(cmd + '\n')
      // advanceGame will be called automatically after the promise resolves
    }
  }

  const handleOutput = (text: string) => {
    setOutput(prev => [...prev, text])
  }

  return (
    <div className="app-container">
      <header className="game-header">
        <h1>ZORK I: The Great Underground Empire</h1>
      </header>

      <main className="game-layout">
        <div className="graphics-panel">
          <GameGraphics location={location} />
        </div>

        <div className="terminal-panel">
          <GameTerminal output={output} onCommand={handleCommand} />
        </div>

        <div className="controls-panel">
          <GameControls onCommand={handleCommand} />
        </div>
      </main>
    </div>
  )
}

export default App
