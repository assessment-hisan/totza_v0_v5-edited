// "use client"

// import { useState } from "react"
// import { useStore } from "../../stores/useStore"

// const AddVendorForm = ({ onClose }) => {
//   const { addVendor } = useStore()
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     category: "",
//     address: "",
//     notes: "",
//   })

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     addVendor(formData)
//     onClose()
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Name *</label>
//           <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
//           <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
//           <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
//           <input
//             type="text"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             className="input"
//             placeholder="e.g., Technology, Supplies, Services"
//           />
//         </div>

//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
//           <input type="text" name="address" value={formData.address} onChange={handleChange} className="input" />
//         </div>

//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
//           <textarea name="notes" value={formData.notes} onChange={handleChange} className="input" rows="3" />
//         </div>
//       </div>

//       <div className="flex justify-end gap-3 pt-4">
//         <button type="button" onClick={onClose} className="btn-secondary">
//           Cancel
//         </button>
//         <button type="submit" className="btn-primary">
//           Add Vendor
//         </button>
//       </div>
//     </form>
//   )
// }

// export default AddVendorForm


"use client"

import { useState } from "react"
import { useStore } from "../../stores/useStore"

const AddVendorForm = ({ onClose }) => {
  const { addVendor } = useStore()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    address: "",
    taxId: "",
    speciality: "",
    notes: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    addVendor({
      ...formData,
      companyName: formData.name, // Assuming companyName is the same as name
      id: crypto.randomUUID(), // Generate a unique ID
    })
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required />
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Technology, Supplies, Services"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID</label>
          <input type="text" name="taxId" value={formData.taxId} onChange={handleChange} className="input" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Speciality</label>
          <input type="text" name="speciality" value={formData.speciality} onChange={handleChange} className="input" />
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
          Add Vendor
        </button>
      </div>
    </form>
  )
}

export default AddVendorForm