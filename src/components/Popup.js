'use client'

import React from 'react'

export default function Popup({ show, title, task, onClose }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div
        className="bg-white text-black p-6 rounded-lg max-w-sm w-full relative cursor-pointer pointer-events-auto shadow-lg"
        onClick={onClose}
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p>{task}</p>
      </div>
    </div>
  )
}
