"use client"

import { useState } from "react"
import { useStore } from "../../stores/useStore"

const AddPaymentForm = ({ due, onClose }) => {
  const { addPaymentToDue, getDueRemainingAmount } = useStore()
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    method: "Bank Transfer",
    notes: "",
  })

  const remainingAmount = getDueRemainingAmount(due)

  const handleSubmit = (e) => {
    e.preventDefault()

    const paymentData = {
      ...formData,
      amount: Number.parseFloat(formData.amount),
    }

    addPaymentToDue(due.id, paymentData)
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
    <div className="space-y-4">
      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium text-slate-800 mb-2">Due Information</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Original Amount:</span>
            <span className="font-medium">${due.originalDueAmount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Remaining Amount:</span>
            <span className="font-medium text-red-600">${remainingAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input"
              step="0.01"
              max={remainingAmount}
              required
            />
            <p className="text-xs text-slate-500 mt-1">Maximum: ${remainingAmount.toLocaleString()}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Date *</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="input" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method *</label>
            <select name="method" value={formData.method} onChange={handleChange} className="input" required>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
              <option value="Wire Transfer">Wire Transfer</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input"
              rows="3"
              placeholder="Optional payment notes..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add Payment
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddPaymentForm
