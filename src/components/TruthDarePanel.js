'use client'

import React from 'react'

export default function TruthDarePanel({ onTruth, onDare }) {
  return (
    <div className="absolute top-1/2 right-8 transform -translate-y-1/2 flex flex-col items-center space-y-8">
      <button
        onClick={onTruth}
        className="w-56 h-40 bg-yellow-500 text-black text-2xl font-bold rounded-lg shadow-lg flex items-center justify-center"
      >
        TRUTH
      </button>
      <button
        onClick={onDare}
        className="w-56 h-40 bg-red-500 text-white text-2xl font-bold rounded-lg shadow-lg flex items-center justify-center"
      >
        DARE
      </button>
    </div>
  )
}
