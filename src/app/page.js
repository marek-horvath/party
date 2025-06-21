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

  // difficulty state lifted up
  const [difficulty, setDifficulty] = useState({
    normal: true,
    deep: true,
    spicy: true,
  })

  // all tasks from CSV
  const [tasks, setTasks] = useState([])

  // popup state
  const [showPopup, setShowPopup] = useState(false)
  const [popupTitle, setPopupTitle] = useState('')
  const [popupTask, setPopupTask] = useState('')
  const [popupRank, setPopupRank] = useState('')

  // load difficulty from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tdDifficulty')
    if (saved) {
      try {
        setDifficulty(JSON.parse(saved))
      } catch {}
    }
  }, [])

  // fetch and parse CSV
  useEffect(() => {
    fetch(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSMXaGByYnSQq16DSDmPH-7l_5D_rA-_weE4wbzIA1IklH6Cjn_FWbjhMf3q_3S7aMs-4i_qQTz_Kf2/pub?gid=0&single=true&output=csv'
    )
      .then(r => r.text())
      .then(text => {
        const lines = text.trim().split(/\r?\n/)
        const data = []
        lines.slice(1).forEach(line => {
          // simple CSV split on first two commas, rest is task
          const [TYPE, RANK, ...rest] = line.split(',')
          const TASK = rest.join(',').replace(/^"|"$/g, '')
          data.push({ TYPE, RANK, TASK })
        })
        setTasks(data)
      })
  }, [])

  // toggle difficulty and persist
  const onToggleDifficulty = key => {
    const updated = { ...difficulty, [key]: !difficulty[key] }
    setDifficulty(updated)
    localStorage.setItem('tdDifficulty', JSON.stringify(updated))
  }

  // truth/dare click handler
  const handleTD = type => {
    const upper = type.toUpperCase()
    const pool = tasks.filter(
      t => t.TYPE === upper && difficulty[t.RANK.toLowerCase()]
    )
    if (pool.length === 0) {
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
    <div className="min-h-screen bg-gray-900 text-white flex relative">
      <SettingsMenu
        show={showMenu}
        segments={segments}
        persons={persons}
        difficulty={difficulty}
        onToggleDifficulty={onToggleDifficulty}
        onAddSegment={() =>
          setSegments(s => [...s, { label: '', weight: 10 }])
        }
        onRemoveSegment={i =>
          setSegments(s => s.filter((_, idx) => idx !== i))
        }
        onUpdateSegment={(i, key, val) =>
          setSegments(s =>
            s.map((seg, idx) =>
              idx === i
                ? { ...seg, [key]: key === 'weight' ? +val : val }
                : seg
            )
          )
        }
        onAddPerson={() =>
          setPersons(p => [...p, { label: `Player ${p.length + 1}` }])
        }
        onRemovePerson={i =>
          setPersons(p => p.filter((_, idx) => idx !== i))
        }
      />

      <button
        onClick={() => setShowMenu(m => !m)}
        className="absolute top-4 left-4 px-3 py-1 bg-gray-700 rounded"
      >
        {showMenu ? 'Close' : 'Settings'}
      </button>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="space-y-2 mb-6 text-center">
          {wheelResult && <div className="text-2xl">Wheel: {wheelResult}</div>}
          {personResult && (
            <div className="text-2xl">Person: {personResult}</div>
          )}
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

      <TruthDarePanel
        onTruth={() => handleTD('truth')}
        onDare={() => handleTD('dare')}
      />

      <Popup
        show={showPopup}
        title={popupTitle}
        task={popupTask}
        rank={popupRank}
        onClose={() => setShowPopup(false)}
      />
    </div>
  )
}
