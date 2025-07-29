"use client"

import { useState } from "react"
import { useStore } from "../../stores/useStore"
import { Plus, Download, Eye } from "lucide-react"
import Modal from "../../components/Modal"
import Table from "../../components/Table"
import TransactionTable from "../../components/TransactionTable"
import AddWorkerForm from "./AddWorkerForm"
import WorkerDetail from "./WorkerDetail"
import { generateEntityTransactionsPDF } from "../../utils/pdfHelpers"

const Workers = () => {
  const { workers, transactions } = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState(null)

  const getWorkerTransactions = (workerId) => {
    return transactions.filter((t) => t.workerId === workerId)
  }

  const columns = [
    {
      header: "Name",
      key: "name",
    },
    {
      header: "Role",
      key: "role",
    },
    {
      header: "Email",
      key: "email",
    },
    {
      header: "Hourly Rate",
      key: "hourlyRate",
      render: (row) => (row.hourlyRate ? `$${row.hourlyRate}/hr` : "N/A"),
    },
    {
      header: "Transactions",
      key: "transactions",
      render: (row) => getWorkerTransactions(row.id).length,
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedWorker(row)
            }}
            className="p-1 hover:bg-slate-100 rounded"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              const workerTransactions = getWorkerTransactions(row.id)
              generateEntityTransactionsPDF(row.name, "Worker", workerTransactions)
            }}
            className="p-1 hover:bg-slate-100 rounded"
            title="Export PDF"
          >
            <Download size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Workers</h1>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add Worker
        </button>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">All Workers ({workers.length})</h3>
        </div>

        <Table columns={columns} data={workers} onRowClick={(worker) => setSelectedWorker(worker)} />
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Worker" size="lg">
        <AddWorkerForm onClose={() => setShowAddModal(false)} />
      </Modal>

      <Modal
        isOpen={!!selectedWorker}
        onClose={() => setSelectedWorker(null)}
        title={`Worker: ${selectedWorker?.name || ""}`}
        size="xl"
      >
        {selectedWorker && <WorkerDetail worker={selectedWorker} onClose={() => setSelectedWorker(null)} />}
      </Modal>
    </div>
  )
}

export default Workers
