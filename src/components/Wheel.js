'use client'

import React, { useState, useRef } from 'react'

export default function Wheel({ segments, onResult, buttonColor }) {
  const wheelRef = useRef(null)
  const [spinning, setSpinning] = useState(false)

  const total = segments.reduce((s, x) => s + x.weight, 0) || 1
  const angles = segments.map(s => (s.weight / total) * 360)
  const cum = angles.reduce(
    (arr, a) => [...arr, (arr.length ? arr[arr.length - 1] : 0) + a],
    []
  )
  const colors = segments.map((_, i) => `hsl(${(i * 360) / segments.length},70%,60%)`)
  const gradient = colors
    .map((c, i) => `${c} ${i===0?0: cum[i-1]}deg ${cum[i]}deg`)
    .join(', ')

  const spin = () => {
    if (spinning) return
    let acc = 0, idx = 0
    const rnd = Math.random() * total
    for (; idx < segments.length; idx++) {
      acc += segments[idx].weight
      if (rnd <= acc) break
    }
    const startA = idx===0?0:cum[idx-1]
    const center = startA + angles[idx]/2
    const final = 3*360 + (360 - center)

    setSpinning(true)
    const w = wheelRef.current
    w.style.transition = 'transform 4s ease-out'
    w.style.transform = `rotate(${final}deg)`
    w.addEventListener('transitionend', () => {
      setSpinning(false)
      w.style.transition = 'none'
      w.style.transform = `rotate(${-center}deg)`
      onResult(segments[idx].label)
    }, { once:true })
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-block">
        <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 text-red-500 text-4xl">▲</div>
        <div
          ref={wheelRef}
          className="w-64 h-64 rounded-full border-4 border-gray-600 overflow-hidden"
          style={{ background: `conic-gradient(${gradient})` }}
        />
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className={`mt-4 px-6 py-2 rounded text-white ${spinning?'bg-gray-600 cursor-not-allowed':buttonColor}`}
      >
        {spinning?'Spinning…':'Spin'}
      </button>
    </div>
  )
}
