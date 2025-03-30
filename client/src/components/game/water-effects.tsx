import React, { useState, useEffect, useCallback } from "react"

interface Bubble {
  id: number
  size: number
  left: number
  duration: number
  delay: number
}

interface WaterRipple {
  id: number
  x: number
  y: number
}

export function WaterEffects() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [ripples, setRipples] = useState<WaterRipple[]>([])

  useEffect(() => {
    const createBubble = () => {
      const newBubble = {
        id: Date.now(),
        size: Math.random() * 20 + 10,
        left: Math.random() * 100,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 2,
      }
      setBubbles((prev) => [...prev, newBubble])
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id))
      }, newBubble.duration * 1000)
    }

    const intervalId = setInterval(createBubble, 300)
    return () => clearInterval(intervalId)
  }, [])

  const createRipple = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ripple = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    setRipples((prev) => [...prev, ripple])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id))
    }, 4000)
  }, [])

  return (
    <div className="absolute inset-0" onClick={createRipple}>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={
            {
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              "--duration": `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="water-ripple absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "10px",
            height: "10px",
          }}
        />
      ))}
    </div>
  )
} 