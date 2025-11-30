
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
  const [inventory, setInventory] = useState<string[]>([])

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
          if (text) {
            setOutput(prev => {
              const lines = [...prev]
              // If text contains newlines, split and add as separate lines
              if (text.includes('\n')) {
                const parts = text.split('\n')
                // Append first part to last line (if exists)
                if (lines.length > 0) {
                  lines[lines.length - 1] += parts[0]
                  // Add remaining parts as new lines
                  lines.push(...parts.slice(1))
                } else {
                  lines.push(...parts)
                }
              } else {
                // No newline - append to last line or create new line
                if (lines.length > 0) {
                  lines[lines.length - 1] += text
                } else {
                  lines.push(text)
                }
              }
              return lines
            })
            checkForLocation(text)
          }
          yield
        }

        jszm.read = function* (maxlen: number) {
          // Wait for input by yielding a promise
          const input: string = yield new Promise<string>(resolve => {
            inputResolverRef.current = resolve
          })
          // Return the input string (trimmed to maxlen)
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
        const resolvedValue = await res.value
        // Pass the resolved value back to the generator
        const nextRes = runnerRef.current.next(resolvedValue)
        // Continue with the next step
        if (!nextRes.done) {
          advanceGame()
        }
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
      handleOutput('')  // Add empty line after input
      const resolve = inputResolverRef.current
      inputResolverRef.current = null
      // Z-machine expects input to end with newline
      resolve(cmd + '\n')
      // advanceGame will be called automatically after the promise resolves
    }
  }

  const handleOutput = (text: string) => {
    setOutput(prev => [...prev, text])
    // Parse for inventory updates
    parseInventory(text)
  }

  const parseInventory = (text: string) => {
    // Check for "Taken." message
    if (text.includes('Taken.')) {
      // Look back in recent output to find what was taken
      const recentOutput = output.slice(-5).join(' ')
      const takeMatch = recentOutput.match(/take (\w+)/i)
      if (takeMatch) {
        const item = takeMatch[1]
        setInventory(prev => {
          if (!prev.includes(item)) {
            return [...prev, item]
          }
          return prev
        })
      }
    }
    // Parse inventory list output
    if (text.includes('You are carrying:') || text.includes('carrying')) {
      // Next lines will be inventory items
      const lines = output.slice(-20)
      const items: string[] = []
      let inInventory = false
      for (const line of lines) {
        if (line.includes('carrying')) {
          inInventory = true
          continue
        }
        if (inInventory && line.trim()) {
          // Extract item name (usually starts with 'A ' or 'An ')
          const itemMatch = line.match(/(?:A|An)\s+(\w+)/i)
          if (itemMatch) {
            items.push(itemMatch[1].toLowerCase())
          }
        }
      }
      if (items.length > 0) {
        setInventory(items)
      }
    }
  }

  return (
    <div className="app-container">
      <main className="game-layout">
        <div className="graphics-panel">
          <GameGraphics location={location} />
        </div>

        <div className="terminal-panel">
          <GameTerminal output={output} onCommand={handleCommand} />
        </div>

        <div className="controls-panel">
          <GameControls onCommand={handleCommand} inventory={inventory} />
        </div>
      </main>
    </div>
  )
}

export default App
