'use client'

import React from 'react'

export default function Popup({ show, title, task, rank, onClose }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div
        className="bg-white text-black p-6 rounded-lg max-w-sm w-full relative cursor-pointer pointer-events-auto shadow-lg"
        onClick={onClose}
      >
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="italic text-gray-700 mb-4">[{rank}]</p>
        <p>{task}</p>
      </div>
    </div>
  )
}
