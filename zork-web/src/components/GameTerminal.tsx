import { useEffect, useRef, useState } from 'react'

interface GameTerminalProps {
    output: string[]
    onCommand: (cmd: string) => void
}

export default function GameTerminal({ output, onCommand }: GameTerminalProps) {
    const [input, setInput] = useState('')
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [output])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim()) {
            onCommand(input)
            setInput('')
        }
    }

    return (
        <div className="terminal-content">
            <div className="output-log">
                {output.map((line, i) => (
                    <div key={i} className="log-line">{line}</div>
                ))}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="input-line">
                <span className="prompt">{'>'}</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoFocus
                    placeholder="Type a command..."
                    className="cmd-input"
                />
            </form>

            <style>{`
        .terminal-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .output-log {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 10px;
          white-space: pre-wrap;
        }
        .log-line {
          margin-bottom: 4px;
          line-height: 1.4;
        }
        .input-line {
          display: flex;
          align-items: center;
          background: #111;
          padding: 5px;
          border: 1px solid #333;
        }
        .prompt {
          margin-right: 8px;
          color: #33ff33;
          font-weight: bold;
        }
        .cmd-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #33ff33;
          font-family: 'VT323', monospace;
          font-size: 1.2rem;
          outline: none;
        }
      `}</style>
        </div>
    )
}
