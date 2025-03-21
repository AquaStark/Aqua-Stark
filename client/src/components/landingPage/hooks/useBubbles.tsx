"use client"
import { useState, useEffect } from "react"

export function useBubbles() {
  const [bubbles, setBubbles] = useState<
    Array<{ id: number; size: number; left: number; animationDuration: number }>
  >([])

  const [backgroundBubbles, setBackgroundBubbles] = useState<
    Array<{ id: number; size: number; left: number; duration: number; delay: number; drift: number }>
  >([])

  const [particles, setParticles] = useState<
    Array<{ id: number; size: number; top: number; left: number; duration: number; delay: number; floatX: number; floatY: number }>
  >([])

  useEffect(() => {
    const newBubbles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 30 + 10,
      left: Math.random() * 100,
      animationDuration: Math.random() * 15 + 5,
    }))
    setBubbles(newBubbles)

    const newBackgroundBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 40,
      left: Math.random() * 100,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 100,
    }))
    setBackgroundBubbles(newBackgroundBubbles)

    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      floatX: (Math.random() - 0.5) * 200,
      floatY: (Math.random() - 0.5) * 200,
    }))
    setParticles(newParticles)
  }, [])

  return { bubbles, backgroundBubbles, particles }
}
