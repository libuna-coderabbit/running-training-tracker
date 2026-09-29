import { useState, useEffect } from 'react'

const STORAGE_KEY = 'rtt_race_planner'

const RACE_DISTANCES = [
  { label: '5K', miles: 3.1 },
  { label: '10K', miles: 6.2 },
  { label: 'Half Marathon', miles: 13.1 },
  { label: 'Marathon', miles: 26.2 },
  { label: 'Custom', miles: null },
]

const PLAN_TYPES = [
  { id: 'beginner', label: 'Beginner (Hal Higdon style)', description: '3-4 days/week, easy mileage buildup' },
  { id: 'intermediate', label: 'Intermediate', description: '4-5 days/week, tempo + long runs' },
  { id: 'custom', label: 'Custom / Flexible', description: 'Adjust days per week to your schedule' },
]

function generatePlan(raceDate, distanceLabel, planType, daysPerWeek) {
  const today = new Date()
  const race = new Date(raceDate)
  const weeksOut = Math.floor((race - today) / (1000 * 60 * 60 * 24 * 7))

  if (weeksOut < 1) return []

  const isHalf = distanceLabel === 'Half Marathon'
  const isMarathon = distanceLabel === 'Marathon'
  const is10k = distanceLabel === '10K'

  const plan = []

  for (let w = 1; w <= weeksOut; w++) {
    const weeksLeft = weeksOut - w + 1
    const isTaper = weeksLeft <= 2
    const isPeak = w === weeksOut - 2

    let longRun, tempo, easy, rest
    const base = isMarathon ? 6 : isHalf ? 4 : is10k ? 3 : 2

    if (isTaper) {
      longRun = isMarathon ? 12 : isHalf ? 8 : 4
      easy = base - 1
      tempo = null
    } else if (isPeak) {
      longRun = isMarathon ? 20 : isHalf ? 12 : is10k ? 7 : 4
      easy = base + 1
      tempo = 4
    } else {
      const progression = Math.min(w / (weeksOut * 0.7), 1)
      longRun = Math.round((isMarathon ? 20 : isHalf ? 12 : is10k ? 7 : 4) * progression)
      easy = base
      tempo = w > 2 ? 3 : null
    }

    const workouts = []
    if (easy) workouts.push(`Easy run ${easy} mi`)
    if (tempo) workouts.push(`Tempo run ${tempo} mi`)
    workouts.push(`Long run ${longRun} mi`)
    if (planType !== 'beginner' && w > 3) workouts.push('Strides / drills')
    workouts.push('Rest + mobility')

    plan.push({
      week: w,
      weeksLeft,
      isTaper,
      isPeak,
      longRun,
      workouts,
    })
  }

  return plan
}

export default function RacePlanner() {
  const [races, setRaces] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [form, setForm] = useState({
    raceName: '', raceDate: '', distanceLabel: '5K', customMiles: '', planType: 'beginner', daysPerWeek: 4
  })
  const [showForm, setShowForm] = useState(false)
  const [expandedRace, setExpandedRace] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(races))
  }, [races])

  function handleSubmit(e) {
    e.preventDefault()
    const plan = generatePlan(form.raceDate, form.distanceLabel, form.planType, form.daysPerWeek)
    setRaces([{ ...form, id: Date.now(), plan }, ...races])
    setForm({ raceName: '', raceDate: '', distanceLabel: '5K', customMiles: '', planType: 'beginner', daysPerWeek: 4 })
    setShowForm(false)
  }

  function deleteRace(id) {
    setRaces(races.filter(r => r.id !== id))
    if (expandedRace === id) setExpandedRace(null)
  }

  function weeksUntil(dateStr) {
    const diff = new Date(dateStr) - new Date()
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 7)))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-black text-gray-700">Race Planner</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-green-600 transition"
        >
          {showForm ? 'Cancel' : '+ Add Race'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm mb-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Race Name</label>
            <input type="text" required value={form.raceName} onChange={e => setForm({ ...form, raceName: e.target.value })}
              placeholder="e.g. Chicago Marathon"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Race Date</label>
            <input type="date" required value={form.raceDate} onChange={e => setForm({ ...form, raceDate: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Distance</label>
            <select value={form.distanceLabel} onChange={e => setForm({ ...form, distanceLabel: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
              {RACE_DISTANCES.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
            </select>
          </div>
          {form.distanceLabel === 'Custom' && (
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Custom Distance (miles)</label>
              <input type="number" step="0.1" value={form.customMiles} onChange={e => setForm({ ...form, customMiles: e.target.value })}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
          )}
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Training Plan</label>
            <div className="space-y-2">
              {PLAN_TYPES.map(p => (
                <label key={p.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${form.planType === p.id ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                  <input type="radio" name="planType" value={p.id} checked={form.planType === p.id}
                    onChange={e => setForm({ ...form, planType: e.target.value })} className="mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-gray-700">{p.label}</div>
                    <div className="text-xs text-gray-400">{p.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Days per week: {form.daysPerWeek}</label>
            <input type="range" min="3" max="6" value={form.daysPerWeek}
              onChange={e => setForm({ ...form, daysPerWeek: Number(e.target.value) })}
              className="mt-1 w-full accent-green-500" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>3 days</span><span>6 days</span>
            </div>
          </div>
          <div className="col-span-2">
            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-full font-bold hover:bg-green-600 transition">
              Generate Plan
            </button>
          </div>
        </form>
      )}

      {races.length === 0 ? (
        <div className="text-center py-16 text-gray-300">
          <div className="text-5xl mb-3">🏁</div>
          <p className="font-bold">No races planned — add your goal race!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {races.map((race) => {
            const weeks = weeksUntil(race.raceDate)
            const isExpanded = expandedRace === race.id
            return (
              <div key={race.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <div className="font-black text-green-600 text-lg">{race.raceName}</div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-sm text-gray-500">📅 {race.raceDate}</span>
                      <span className="text-sm text-gray-500">📏 {race.distanceLabel}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${weeks <= 2 ? 'bg-red-100 text-red-500' : weeks <= 6 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                        {weeks === 0 ? 'Race week!' : `${weeks} weeks away`}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setExpandedRace(isExpanded ? null : race.id)}
                      className="text-sm text-green-500 font-bold hover:text-green-700 transition">
                      {isExpanded ? 'Hide plan' : 'View plan'}
                    </button>
                    <button onClick={() => deleteRace(race.id)} className="text-gray-200 hover:text-red-400 transition text-lg">✕</button>
                  </div>
                </div>

                {isExpanded && race.plan && (
                  <div className="border-t border-gray-100 px-4 pb-4">
                    <div className="mt-4 space-y-3">
                      {race.plan.map((week) => (
                        <div key={week.week} className={`rounded-xl p-3 ${week.isTaper ? 'bg-blue-50 border border-blue-100' : week.isPeak ? 'bg-orange-50 border border-orange-100' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-sm text-gray-700">Week {week.week}</span>
                            <div className="flex gap-2">
                              {week.isPeak && <span className="text-xs bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-bold">Peak</span>}
                              {week.isTaper && <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full font-bold">Taper</span>}
                              <span className="text-xs text-gray-400">{week.weeksLeft} weeks to go</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {week.workouts.map((w, i) => (
                              <span key={i} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-lg text-gray-600">{w}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
