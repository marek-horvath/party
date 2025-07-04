// src/components/SettingsMenu.js
'use client'

import React, { useEffect } from 'react'

export default function SettingsMenu({
  show,
  segments,
  persons,
  difficulty,
  onToggleDifficulty,
  onAddSegment,
  onRemoveSegment,
  onUpdateSegment,
  onAddPerson,
  onRemovePerson,
}) {
  // vždy keď sa difficulty zmení, uložíme do localStorage
  useEffect(() => {
    localStorage.setItem('tdDifficulty', JSON.stringify(difficulty))
  }, [difficulty])

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 transform ${
        show ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300
         w-full md:w-96 z-30 overflow-auto pt-16 pb-6 px-6`}
    >
      {/* --- Wheel segments --- */}
      <h2 className="text-2xl mb-4">Wheel segments</h2>
      {segments.map((seg, i) => (
        <div key={i} className="flex items-center mb-2 space-x-2">
          <input
            type="text"
            value={seg.label}
            onChange={e => onUpdateSegment(i, 'label', e.target.value)}
            placeholder="Label"
            className="flex-1 px-2 py-1 rounded bg-gray-700 text-white"
          />
          <input
            type="number"
            value={seg.weight}
            onChange={e => onUpdateSegment(i, 'weight', e.target.value)}
            min="0"
            className="w-24 px-2 py-1 rounded bg-gray-700 text-center text-white"
          />
          <button
            onClick={() => onRemoveSegment(i)}
            className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 text-white"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={onAddSegment}
        className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-white"
      >
        + Add segment
      </button>

      <div className="my-6 border-t border-gray-600"></div>

      {/* --- Person wheel --- */}
      <h2 className="text-2xl mb-4">Person wheel</h2>
      {persons.map((p, i) => (
        <div key={i} className="flex items-center mb-2 space-x-2">
          <input
            type="text"
            value={p.label}
            readOnly
            className="flex-1 px-2 py-1 rounded bg-gray-700 text-white cursor-not-allowed"
          />
          <button
            onClick={() => onRemovePerson(i)}
            className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 text-white"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={onAddPerson}
        className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-white"
      >
        + Add person
      </button>

      <div className="my-6 border-t border-gray-600"></div>

      {/* --- Truth/Dare Difficulty --- */}
      <h2 className="text-2xl mb-4">Truth/Dare Difficulty</h2>
      <div className="flex flex-col space-y-3">
        {['normal', 'deep', 'spicy'].map(key => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={difficulty[key]}
              onChange={() => onToggleDifficulty(key)}
              className={`form-checkbox h-5 w-5 ${
                key === 'normal'
                  ? 'text-green-500'
                  : key === 'deep'
                  ? 'text-blue-500'
                  : 'text-red-500'
              } bg-gray-700 rounded`}
            />
            <span className="text-white uppercase">{key}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
