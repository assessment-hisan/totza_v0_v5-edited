"use client"

import { useState } from "react"
import { useStore } from "../../stores/useStore"

const AddPartnerForm = ({ onClose }) => {
  const { addPartner } = useStore()
  const [formData, setFormData] = useState({
    name: "",
    type: "Strategic",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    addPartner(formData)
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
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Partner Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
          <select name="type" value={formData.type} onChange={handleChange} className="input" required>
            <option value="Strategic">Strategic</option>
            <option value="Financial">Financial</option>
            <option value="Technology">Technology</option>
            <option value="Distribution">Distribution</option>
            <option value="Research">Research</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="input" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="input" rows="3" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Add Partner
        </button>
      </div>
    </form>
  )
}

export default AddPartnerForm
