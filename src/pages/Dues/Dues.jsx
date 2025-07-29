// src/pages/Dues/Dues.jsx
"use client"
import { useState, useMemo } from "react"
import { useStore } from "../../stores/useStore"
import { Download } from "lucide-react"
import Modal from "../../components/Modal"
import AddPaymentForm from "./AddPaymentForm"
import { format } from "date-fns"
import { generateTransactionsPDF } from "../../utils/pdfHelpers"
import Table from "../../components/Table"
const Dues = () => {
  const { transactions } = useStore()
  const {
    getDuePaidAmount,
    getDueRemainingAmount,
    getDueStatus,
  } = useStore()

  const [selectedDue, setSelectedDue] = useState(null)

  /* ---------- data ---------- */
  const dueTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "Due")
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [transactions]
  )

  /* ---------- helpers ---------- */
  const safeFmt = (d) =>
    d && !isNaN(Date.parse(d)) ? format(new Date(d), "MMM dd, yyyy") : "—"

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-red-600 bg-red-50"
      case "Partially Paid":
        return "text-yellow-600 bg-yellow-50"
      case "Fully Paid":
        return "text-green-600 bg-green-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  /* ---------- columns ---------- */
  const columns = [
    { header: "Date", key: "date", render: (r) => safeFmt(r.date) },
    { header: "Due Date", key: "dueDate", render: (r) => safeFmt(r.dueDate) },
    { header: "Description", key: "description" },
    {
      header: "Original",
      key: "originalDueAmount",
      render: (r) => `$${(r.originalDueAmount || 0).toLocaleString()}`,
    },
    {
      header: "Paid",
      key: "paidAmount",
      render: (r) => `$${(getDuePaidAmount(r) || 0).toLocaleString()}`,
    },
    {
      header: "Remaining",
      key: "remainingAmount",
      render: (r) => `$${(getDueRemainingAmount(r) || 0).toLocaleString()}`,
    },
    {
      header: "Status",
      key: "status",
      render: (r) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            getDueStatus(r)
          )}`}
        >
          {getDueStatus(r)}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex gap-2">
          {getDueStatus(row) !== "Fully Paid" && (
            <button
              onClick={() => setSelectedDue(row)}
              className="btn-primary text-xs px-2 py-1"
            >
              Add Payment
            </button>
          )}
          <button
            onClick={() => generateTransactionsPDF([row], `Due-${row.id}`)}
            className="p-1 hover:bg-slate-100 rounded"
          >
            <Download size={16} />
          </button>
        </div>
      ),
    },
  ]

  /* ---------- totals ---------- */
  const totalDue = useMemo(
    () => dueTransactions.reduce((s, d) => s + (d.originalDueAmount || 0), 0),
    [dueTransactions]
  )
  const totalPaid = useMemo(
    () => dueTransactions.reduce((s, d) => s + (getDuePaidAmount(d) || 0), 0),
    [dueTransactions]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Dues</h1>
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-4">
          <h4 className="text-sm font-medium text-slate-600">Total Dues</h4>
          <p className="text-2xl font-bold">{dueTransactions.length}</p>
        </div>
        <div className="card p-4">
          <h4 className="text-sm font-medium text-slate-600">Total Amount Due</h4>
          <p className="text-2xl font-bold text-red-600">
            ${totalDue.toLocaleString()}
          </p>
        </div>
        <div className="card p-4">
          <h4 className="text-sm font-medium text-slate-600">Total Paid</h4>
          <p className="text-2xl font-bold text-green-600">
            ${totalPaid.toLocaleString()}
          </p>
        </div>
      </div>

      {/* table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            All Dues ({dueTransactions.length})
          </h3>
          <button
            onClick={() => generateTransactionsPDF(dueTransactions, "Dues Report")}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>

        <Table columns={columns} data={dueTransactions} />
      </div>

      {/* payment modal */}
      <Modal
        isOpen={!!selectedDue}
        onClose={() => setSelectedDue(null)}
        title={`Add Payment - ${selectedDue?.description || ""}`}
        size="md"
      >
        {selectedDue && (
          <AddPaymentForm due={selectedDue} onClose={() => setSelectedDue(null)} />
        )}
      </Modal>
    </div>
  )
}

export default Dues

// import React from 'react'

// const Dues = () => {
//   return (
//     <div>Dues</div>
//   )
// }

// export default Dues