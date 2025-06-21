'use client'

import React, { useState } from 'react'
import SettingsMenu from '../components/SettingsMenu'
import Wheel from '../components/Wheel'
import PersonWheel from '../components/PersonWheel'
import TruthDarePanel from '../components/TruthDarePanel'
import Popup from '../components/Popup'

export default function Home() {
  const [showMenu, setShowMenu] = useState(false)

  const [segments, setSegments] = useState([
    { label: 'Drink', weight: 25 },
    { label: 'Clothes', weight: 25 },
    { label: 'Truth', weight: 25 },
    { label: 'Dare', weight: 25 },
  ])

  const [persons, setPersons] = useState([
    { label: 'Alice' },
    { label: 'Bob' },
    { label: 'Charlie' },
    { label: 'Diana' },
  ])

  const [wheelResult, setWheelResult] = useState(null)
  const [personResult, setPersonResult] = useState(null)

  const [showTruth, setShowTruth] = useState(false)
  const [showDare, setShowDare] = useState(false)
  const [popupTask, setPopupTask] = useState('')

  const truthTasks = [
    'What is your most embarrassing moment?',
    'Have you ever lied to your best friend?',
    'What secret are you keeping right now?'
  ]
  const dareTasks = [
    'Sing a verse of your favorite song loudly.',
    'Do 10 push-ups in a row.',
    'Dance without music for 30 seconds.'
  ]

  const updateSegment = (i, key, value) =>
    setSegments(segs =>
      segs.map((s, idx) =>
        idx === i ? { ...s, [key]: key === 'weight' ? +value : value } : s
      )
    )
  const addSegment = () =>
    setSegments(segs => [...segs, { label: '', weight: 10 }])
  const removeSegment = i =>
    setSegments(segs => segs.filter((_, idx) => idx !== i))

  const addPerson = () =>
    setPersons(ps => [...ps, { label: `Player ${ps.length + 1}` }])
  const removePerson = i =>
    setPersons(ps => ps.filter((_, idx) => idx !== i))

  const openTruth = () => {
    setPopupTask(truthTasks[Math.floor(Math.random() * truthTasks.length)])
    setShowTruth(true)
  }
  const openDare = () => {
    setPopupTask(dareTasks[Math.floor(Math.random() * dareTasks.length)])
    setShowDare(true)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex relative">
      <SettingsMenu
        show={showMenu}
        segments={segments}
        persons={persons}
        onAddSegment={addSegment}
        onRemoveSegment={removeSegment}
        onUpdateSegment={updateSegment}
        onAddPerson={addPerson}
        onRemovePerson={removePerson}
      />

      <button
        onClick={() => setShowMenu(v => !v)}
        className="absolute top-4 left-4 px-3 py-1 bg-gray-700 rounded"
      >
        {showMenu ? 'Close' : 'Settings'}
      </button>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="space-y-2 mb-6 text-center">
          {wheelResult && <div className="text-2xl">Wheel: {wheelResult}</div>}
          {personResult && <div className="text-2xl">Person: {personResult}</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Wheel
            segments={segments}
            onResult={setWheelResult}
            buttonColor="bg-green-600"
          />
          <PersonWheel
            persons={persons}
            onResult={setPersonResult}
            buttonColor="bg-purple-600"
          />
        </div>
      </div>

      {/* tu sa vynorí náš nový panel s veľkými kartami */}
      <TruthDarePanel onTruth={openTruth} onDare={openDare} />

      <Popup
        show={showTruth || showDare}
        title={showTruth ? 'Truth' : 'Dare'}
        task={popupTask}
        onClose={() => {
          setShowTruth(false)
          setShowDare(false)
        }}
      />
    </div>
  )
}
