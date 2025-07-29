"use client"

import { useState } from "react"
import { useStore } from "../../stores/useStore"

const AddProjectForm = ({ onClose }) => {
  const { addProject } = useStore()
  const [formData, setFormData] = useState({
    name: "",
    status: "Planning",
    budget: "",
    startDate: "",
    description: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const projectData = {
      ...formData,
      budget: formData.budget ? Number.parseFloat(formData.budget) : null,
    }

    addProject(projectData)
    onClose()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Project Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
          <select name="status" value={formData.status} onChange={handleChange} className="input" required>
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Budget</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="input"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="input" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input"
            rows="3"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Add Project
        </button>
      </div>
    </form>
  )
}

export default AddProjectForm
