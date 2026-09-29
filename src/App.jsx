import { useState } from 'react'
import TrainingLog from './components/TrainingLog'
import Mobility from './components/Mobility'
import Strength from './components/Strength'
import RacePlanner from './components/RacePlanner'

const tabs = [
  { id: 'log', label: '🏃 Training Log' },
  { id: 'mobility', label: '🧘 Mobility' },
  { id: 'strength', label: '💪 Strength' },
  { id: 'race', label: '🏁 Race Planner' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('log')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <h1 className="text-3xl font-black text-orange-500 tracking-tight">
            🏅 Running Tracker
          </h1>
          <p className="text-sm text-gray-400 mt-1">Your personal training companion</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-md scale-105'
                  : 'bg-white text-gray-500 hover:bg-orange-100 hover:text-orange-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 pb-12">
          {activeTab === 'log' && <TrainingLog />}
          {activeTab === 'mobility' && <Mobility />}
          {activeTab === 'strength' && <Strength />}
          {activeTab === 'race' && <RacePlanner />}
        </div>
      </div>
    </div>
  )
}
