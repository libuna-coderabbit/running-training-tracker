import { useState, useEffect } from 'react'

const STORAGE_KEY = 'rtt_training_log'

const emptyForm = { date: '', distance: '', unit: 'mi', duration: '', pace: '', notes: '' }

export default function TrainingLog() {
  const [runs, setRuns] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(runs))
  }, [runs])

  function handleSubmit(e) {
    e.preventDefault()
    setRuns([{ ...form, id: Date.now() }, ...runs])
    setForm(emptyForm)
    setShowForm(false)
  }

  function deleteRun(id) {
    setRuns(runs.filter((r) => r.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-black text-gray-700">Training Log</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-orange-600 transition"
        >
          {showForm ? 'Cancel' : '+ Log Run'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm mb-6 grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
            <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <div className="col-span-2 sm:col-span-1 flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Distance</label>
              <input type="number" step="0.01" required value={form.distance} onChange={e => setForm({ ...form, distance: e.target.value })}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Unit</label>
              <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                <option value="mi">mi</option>
                <option value="km">km</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Duration (hh:mm:ss)</label>
            <input type="text" placeholder="0:45:00" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Pace (min/unit)</label>
            <input type="text" placeholder="9:30" value={form.pace} onChange={e => setForm({ ...form, pace: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={2} placeholder="How did it feel?"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
          </div>
          <div className="col-span-2">
            <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-full font-bold hover:bg-orange-600 transition">
              Save Run
            </button>
          </div>
        </form>
      )}

      {runs.length === 0 ? (
        <div className="text-center py-16 text-gray-300">
          <div className="text-5xl mb-3">🏃</div>
          <p className="font-bold">No runs logged yet — get moving!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => (
            <div key={run.id} className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-orange-500 text-lg">{run.distance} {run.unit}</span>
                  {run.duration && <span className="text-sm text-gray-400">⏱ {run.duration}</span>}
                  {run.pace && <span className="text-sm text-gray-400">⚡ {run.pace} /{run.unit}</span>}
                </div>
                <div className="text-xs text-gray-400 mt-1">{run.date}</div>
                {run.notes && <div className="text-sm text-gray-500 mt-1 italic">"{run.notes}"</div>}
              </div>
              <button onClick={() => deleteRun(run.id)} className="text-gray-200 hover:text-red-400 transition text-lg">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
