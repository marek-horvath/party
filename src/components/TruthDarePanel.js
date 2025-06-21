'use client'

import React from 'react'

export default function TruthDarePanel({ onTruth, onDare }) {
  return (
    <div className="flex flex-col items-center space-y-6 mt-6 md:mt-0 md:absolute md:top-1/2 md:right-8 md:transform md:-translate-y-1/2">
      <button
        onClick={onTruth}
        className="w-40 h-32 sm:w-56 sm:h-40 bg-yellow-500 text-black text-xl sm:text-2xl font-bold rounded-lg shadow-lg flex items-center justify-center"
      >
        TRUTH
      </button>
      <button
        onClick={onDare}
        className="w-40 h-32 sm:w-56 sm:h-40 bg-red-500 text-white text-xl sm:text-2xl font-bold rounded-lg shadow-lg flex items-center justify-center"
      >
        DARE
      </button>
    </div>
  )
}
