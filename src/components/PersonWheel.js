'use client'

import React, { useState, useRef } from 'react'

export default function PersonWheel({ persons, onResult, className, buttonColor }) {
  const wheelRef = useRef(null)
  const [spinning, setSpinning] = useState(false)

  const count = persons.length || 1
  const angle = 360 / count
  const colors = persons.map((_, i) => `hsl(${Math.round((i * 360) / count)},50%,60%)`)
  const gradient = colors
    .map((c, i) => `${c} ${i * angle}deg ${(i + 1) * angle}deg`)
    .join(', ')

  const handleSpin = () => {
    if (spinning) return
    const idx = Math.floor(Math.random() * count)
    const center = idx * angle + angle / 2
    const final = 3 * 360 + (360 - center)

    setSpinning(true)
    const wheel = wheelRef.current
    wheel.style.transition = 'transform 4s ease-out'
    wheel.style.transform = `rotate(${final}deg)`
    wheel.addEventListener(
      'transitionend',
      () => {
        setSpinning(false)
        wheel.style.transition = 'none'
        wheel.style.transform = `rotate(${-center}deg)`
        onResult(persons[idx].label)
      },
      { once: true }
    )
  }

  return (
    <div className={`flex flex-col items-center ${className || ''}`}>
      <div className="relative inline-block">
        <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 text-red-500 text-4xl">▲</div>
        <div
          ref={wheelRef}
          className="w-64 h-64 rounded-full border-4 border-gray-600 overflow-hidden"
          style={{ background: `conic-gradient(${gradient})` }}
        />
      </div>
      <button
        onClick={handleSpin}
        disabled={spinning}
        className={`mt-4 px-6 py-2 rounded text-white ${
          spinning ? 'bg-gray-600 cursor-not-allowed' : buttonColor
        }`}
      >
        {spinning ? 'Spinning…' : 'Spin'}
      </button>
    </div>
  )
}
