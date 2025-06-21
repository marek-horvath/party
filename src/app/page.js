'use client'

import React, { useState, useEffect } from 'react'
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

  const [difficulty, setDifficulty] = useState({ normal: true, deep: true, spicy: true })
  const [tasks, setTasks] = useState([])

  const [showPopup, setShowPopup] = useState(false)
  const [popupTitle, setPopupTitle] = useState('')
  const [popupTask, setPopupTask] = useState('')
  const [popupRank, setPopupRank] = useState('')

  // load difficulty
  useEffect(() => {
    const saved = localStorage.getItem('tdDifficulty')
    if (saved) {
      try { setDifficulty(JSON.parse(saved)) } catch {}
    }
  }, [])

  // fetch CSV
  useEffect(() => {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSMXaGByYnSQq16DSDmPH-7l_5D_rA-_weE4wbzIA1IklH6Cjn_FWbjhMf3q_3S7aMs-4i_qQTz_Kf2/pub?gid=0&single=true&output=csv')
      .then(r => r.text())
      .then(text => {
        const lines = text.trim().split(/\r?\n/)
        const data = []
        lines.slice(1).forEach(line => {
          const [TYPE, RANK, ...rest] = line.split(',')
          const TASK = rest.join(',').replace(/^"|"$/g, '')
          data.push({ TYPE, RANK, TASK })
        })
        setTasks(data)
      })
  }, [])

  const toggleDifficulty = key => {
    const upd = { ...difficulty, [key]: !difficulty[key] }
    setDifficulty(upd)
    localStorage.setItem('tdDifficulty', JSON.stringify(upd))
  }

  const handleTD = type => {
    const upper = type.toUpperCase()
    const pool = tasks.filter(t => t.TYPE === upper && difficulty[t.RANK.toLowerCase()])
    if (!pool.length) {
      setPopupTitle(type)
      setPopupRank('NONE')
      setPopupTask('No tasks available for these settings.')
    } else {
      const pick = pool[Math.floor(Math.random() * pool.length)]
      setPopupTitle(type)
      setPopupRank(pick.RANK)
      setPopupTask(pick.TASK)
    }
    setShowPopup(true)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Settings */}
      <SettingsMenu
        show={showMenu}
        segments={segments}
        persons={persons}
        difficulty={difficulty}
        onToggleDifficulty={toggleDifficulty}
        onAddSegment={() => setSegments(s => [...s, { label: '', weight: 10 }])}
        onRemoveSegment={i => setSegments(s => s.filter((_, idx) => idx !== i))}
        onUpdateSegment={(i, k, v) => setSegments(s => s.map((seg, idx) => idx === i ? { ...seg, [k]: k === 'weight' ? +v : v } : seg))}
        onAddPerson={() => setPersons(p => [...p, { label: `Player ${p.length + 1}` }])}
        onRemovePerson={i => setPersons(p => p.filter((_, idx) => idx !== i))}
      />

      {/* Toggle button */}
      <button
        onClick={() => setShowMenu(m => !m)}
        className="absolute z-50 top-4 left-4 px-3 py-1 bg-gray-700 rounded"
      >
        {showMenu ? 'Close' : 'Settings'}
      </button>

      {/* Main content (hidden on mobile when menu open) */}
      <div className={`${showMenu ? 'hidden md:flex' : 'flex'} flex-col items-center justify-center p-6`}>  
        <div className="space-y-2 mb-6 text-center">
          {wheelResult && <div className="text-2xl">Wheel: {wheelResult}</div>}
          {personResult && <div className="text-2xl">Person: {personResult}</div>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Wheel segments={segments} onResult={setWheelResult} buttonColor="bg-green-600" />
          <PersonWheel persons={persons} onResult={setPersonResult} buttonColor="bg-purple-600" />
        </div>
      </div>

      {/* Truth/Dare panel (hidden on mobile when menu open) */}
      <div className={`${showMenu ? 'hidden md:flex' : 'flex'} justify-center`}>  
        <TruthDarePanel onTruth={() => handleTD('truth')} onDare={() => handleTD('dare')} />
      </div>

      {/* Popup */}
      <Popup show={showPopup} title={popupTitle} task={popupTask} rank={popupRank} onClose={() => setShowPopup(false)} />
    </div>
  )
}
