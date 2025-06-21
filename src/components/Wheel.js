'use client'

import React, { useState, useRef } from 'react'

export default function Wheel({ segments, onResult, className, buttonColor }) {
  const wheelRef = useRef(null)
  const [spinning, setSpinning] = useState(false)

  // predpočítame uhly a gradient
  const total = segments.reduce((sum, s) => sum + s.weight, 0) || 1
  const angles = segments.map(s => (s.weight / total) * 360)
  const cum = angles.reduce(
    (arr, a) => [...arr, (arr.length ? arr[arr.length - 1] : 0) + a],
    []
  )
  const colors = segments.map((_, i) => `hsl(${Math.round((i * 360) / segments.length)},70%,60%)`)
  const gradient = colors
    .map((c, i) => {
      const start = i === 0 ? 0 : cum[i - 1]
      const end = cum[i]
      return `${c} ${start}deg ${end}deg`
    })
    .join(', ')

  const handleSpin = () => {
    if (spinning) return
    // náhodný výber
    const rnd = Math.random() * total
    let acc = 0, idx = 0
    for (; idx < segments.length; idx++) {
      acc += segments[idx].weight
      if (rnd <= acc) break
    }
    const startA = idx === 0 ? 0 : cum[idx - 1]
    const center = startA + angles[idx] / 2
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
        onResult(segments[idx].label)
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
