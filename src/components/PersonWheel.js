'use client'

import React, { useState, useRef } from 'react'

export default function PersonWheel({ persons, onResult, buttonColor }) {
  const ref = useRef(null)
  const [spinning, setSpinning] = useState(false)

  const count = persons.length || 1
  const angle = 360/count
  const colors = persons.map((_,i) => `hsl(${(i*360)/count},50%,60%)`)
  const gradient = colors.map((c,i)=>`${c} ${i*angle}deg ${(i+1)*angle}deg`).join(', ')

  const spin = () => {
    if (spinning) return
    const idx = Math.floor(Math.random()*count)
    const center = idx*angle + angle/2
    const final = 3*360 + (360 - center)

    setSpinning(true)
    const w = ref.current
    w.style.transition = 'transform 4s ease-out'
    w.style.transform = `rotate(${final}deg)`
    w.addEventListener('transitionend', ()=>{
      setSpinning(false)
      w.style.transition = 'none'
      w.style.transform = `rotate(${-center}deg)`
      onResult(persons[idx].label)
    },{once:true})
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-block">
        <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 text-red-500 text-4xl">▲</div>
        <div
          ref={ref}
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
