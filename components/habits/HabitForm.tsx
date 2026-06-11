'use client'

import { useState } from 'react'

interface HabitFormProps {
  onSubmit: (formData: any) => void
  onCancel: () => void
}

const EMOJI_ICONS = ['⭐', '🎯', '💪', '🔥', '🚀', '📚', '🧘', '💡', '🎨', '⚡']

export default function HabitForm({ onSubmit, onCancel }: HabitFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    color: '#3B82F6',
    icon: '⭐',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSubmit(formData)
      setFormData({
        name: '',
        description: '',
        frequency: 'daily',
        color: '#3B82F6',
        icon: '⭐',
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-lg bg-slate-800 border border-slate-700 p-6"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Habit Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Morning Meditation, Exercise"
            className="w-full rounded-lg bg-slate-700 px-4 py-2 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Why is this habit important?"
            rows={2}
            className="w-full rounded-lg bg-slate-700 px-4 py-2 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Frequency
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-700 px-4 py-2 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Icon
            </label>
            <select
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-700 px-4 py-2 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {EMOJI_ICONS.map((emoji) => (
                <option key={emoji} value={emoji}>
                  {emoji}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Color
          </label>
          <div className="flex gap-2">
            {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map(
              (color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color
                      ? 'border-white'
                      : 'border-slate-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              )
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-slate-700 px-4 py-2 font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Add Habit
          </button>
        </div>
      </div>
    </form>
  )
}
