import { useState, useEffect } from 'react'

const STORAGE_KEY = 'rtt_mobility'

const SUGGESTIONS = [
  'Hip flexor stretch', 'Pigeon pose', 'Calf stretch', 'IT band stretch',
  'Hamstring stretch', 'Quad stretch', 'Ankle circles', 'Glute bridge',
  'Foam roll quads', 'Foam roll calves', 'Child\'s pose', 'Spinal twist',
]

const emptyForm = { date: '', exercise: '', sets: '', duration: '', notes: '' }

export default function Mobility() {
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
        <h2 className="text-xl font-black text-gray-700">Mobility</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-pink-600 transition"
        >
          {showForm ? 'Cancel' : '+ Add Session'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm mb-6 grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
            <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Exercise</label>
            <input list="mobility-suggestions" required value={form.exercise} onChange={e => setForm({ ...form, exercise: e.target.value })}
              placeholder="e.g. Pigeon pose"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
            <datalist id="mobility-suggestions">
              {SUGGESTIONS.map(s => <option key={s} value={s} />)}
            </datalist>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Sets / Reps</label>
            <input type="text" placeholder="3x30s" value={form.sets} onChange={e => setForm({ ...form, sets: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Total Duration</label>
            <input type="text" placeholder="20 min" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={2} placeholder="Any tightness or improvements?"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none" />
          </div>
          <div className="col-span-2">
            <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded-full font-bold hover:bg-pink-600 transition">
              Save Session
            </button>
          </div>
        </form>
      )}

      <div className="mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Quick picks</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.slice(0, 8).map(s => (
            <button key={s} onClick={() => { setForm({ ...emptyForm, exercise: s }); setShowForm(true) }}
              className="text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full hover:bg-pink-200 transition font-medium">
              {s}
            </button>
          ))}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16 text-gray-300">
          <div className="text-5xl mb-3">🧘</div>
          <p className="font-bold">No mobility sessions yet — stretch it out!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-pink-500 text-lg">{entry.exercise}</span>
                  {entry.sets && <span className="text-sm text-gray-400">{entry.sets}</span>}
                  {entry.duration && <span className="text-sm text-gray-400">⏱ {entry.duration}</span>}
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
