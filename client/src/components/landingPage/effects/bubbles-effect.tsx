"use client"

import type React from "react"

interface Bubble {
  id: number
  size: number
  left: number
  animationDuration?: number
}

interface BackgroundBubble extends Bubble {
  duration: number
  delay: number
  drift: number
}

interface Particle extends Bubble {
  top: number
  duration: number
  delay: number
  floatX: number
  floatY: number
}

interface BubblesEffectProps {
  bubbles: Bubble[]
  backgroundBubbles: BackgroundBubble[]
  particles: Particle[]
}

export function BubblesEffect({ bubbles, backgroundBubbles, particles }: BubblesEffectProps) {
  return (
    <>
      {/* Fondo de burbujas */}
      {backgroundBubbles.map((bubble) => (
        <div
          key={`bg-bubble-${bubble.id}`}
          className="background-bubble"
          style={
            {
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              bottom: "-100px",
              "--duration": `${bubble.duration}s`,
              "--delay": `${bubble.delay}s`,
              "--drift": `${bubble.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Partículas flotantes */}
      {particles.map((particle) => (
        <div
          key={`particle-${particle.id}`}
          className="floating-particle"
          style={
            {
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              "--float-duration": `${particle.duration}s`,
              "--float-delay": `${particle.delay}s`,
              "--float-x": `${particle.floatX}px`,
              "--float-y": `${particle.floatY}px`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Burbujas principales */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={
            {
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              "--duration": `${bubble.animationDuration}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}
