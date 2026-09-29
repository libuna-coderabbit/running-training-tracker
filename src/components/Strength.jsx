import { useState, useEffect } from 'react'

const STORAGE_KEY = 'rtt_strength'

const SUGGESTIONS = [
  'Squats', 'Lunges', 'Deadlifts', 'Hip thrusts', 'Step-ups',
  'Calf raises', 'Planks', 'Single-leg RDL', 'Glute bridge', 'Box jumps',
  'Core rotations', 'Pull-ups', 'Push-ups', 'Lateral band walks',
]

const emptyForm = { date: '', exercise: '', sets: '', reps: '', weight: '', notes: '' }

export default function Strength() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  function handleSubmit(e) {
    e.preventDefault()
    setEntries([{ ...form, id: Date.now() }, ...entries])
    setForm(emptyForm)
    setShowForm(false)
  }

  function deleteEntry(id) {
    setEntries(entries.filter((e) => e.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-black text-gray-700">Strength</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-purple-600 transition"
        >
          {showForm ? 'Cancel' : '+ Add Exercise'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm mb-6 grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
            <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Exercise</label>
            <input list="strength-suggestions" required value={form.exercise} onChange={e => setForm({ ...form, exercise: e.target.value })}
              placeholder="e.g. Squats"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
            <datalist id="strength-suggestions">
              {SUGGESTIONS.map(s => <option key={s} value={s} />)}
            </datalist>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Sets</label>
            <input type="number" min="1" value={form.sets} onChange={e => setForm({ ...form, sets: e.target.value })}
              placeholder="3"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Reps</label>
            <input type="text" value={form.reps} onChange={e => setForm({ ...form, reps: e.target.value })}
              placeholder="10 or 30s"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Weight (optional)</label>
            <input type="text" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })}
              placeholder="e.g. 95 lbs / bodyweight"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={2} placeholder="How did it feel?"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none" />
          </div>
          <div className="col-span-2">
            <button type="submit" className="w-full bg-purple-500 text-white py-2 rounded-full font-bold hover:bg-purple-600 transition">
              Save Exercise
            </button>
          </div>
        </form>
      )}

      <div className="mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Quick picks</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.slice(0, 8).map(s => (
            <button key={s} onClick={() => { setForm({ ...emptyForm, exercise: s }); setShowForm(true) }}
              className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full hover:bg-purple-200 transition font-medium">
              {s}
            </button>
          ))}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16 text-gray-300">
          <div className="text-5xl mb-3">💪</div>
          <p className="font-bold">No exercises logged yet — get strong!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-black text-purple-500 text-lg">{entry.exercise}</span>
                  {entry.sets && entry.reps && (
                    <span className="text-sm text-gray-400">{entry.sets} × {entry.reps}</span>
                  )}
                  {entry.weight && <span className="text-sm text-gray-400">🏋️ {entry.weight}</span>}
                </div>
                <div className="text-xs text-gray-400 mt-1">{entry.date}</div>
                {entry.notes && <div className="text-sm text-gray-500 mt-1 italic">"{entry.notes}"</div>}
              </div>
              <button onClick={() => deleteEntry(entry.id)} className="text-gray-200 hover:text-red-400 transition text-lg">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
