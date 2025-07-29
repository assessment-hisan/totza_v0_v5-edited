"use client"

import { useState } from "react"
import { useStore } from "../../stores/useStore"
import { Plus, Download, Eye } from "lucide-react"
import Modal from "../../components/Modal"

import Table from "../../components/Table"
import AddVendorForm from "./AddVendorForm"
import VendorDetail from "./VendorDetail"
import { generateEntityTransactionsPDF } from "../../utils/pdfHelpers"

const Vendors = () => {
  const { vendors, transactions } = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)

  const getVendorTransactions = (vendorId) => {
    return transactions.filter((t) => t.vendorId === vendorId)
  }

  const columns = [
    {
      header: "Name",
      key: "name",
    },
    {
      header: "Email",
      key: "email",
    },
    {
      header: "Phone",
      key: "phone",
    },
    {
      header: "Category",
      key: "category",
    },
    {
      header: "Transactions",
      key: "transactions",
      render: (row) => getVendorTransactions(row.id).length,
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedVendor(row)
            }}
            className="p-1 hover:bg-slate-100 rounded"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              const vendorTransactions = getVendorTransactions(row.id)
              generateEntityTransactionsPDF(row.name, "Vendor", vendorTransactions)
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
        <h1 className="text-2xl font-bold text-slate-800">Vendors</h1>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add Vendor
        </button>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">All Vendors ({vendors.length})</h3>
        </div>

        <Table columns={columns} data={vendors} onRowClick={(vendor) => setSelectedVendor(vendor)} />
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Vendor" size="lg">
        <AddVendorForm onClose={() => setShowAddModal(false)} />
      </Modal>

      <Modal
        isOpen={!!selectedVendor}
        onClose={() => setSelectedVendor(null)}
        title={`Vendor: ${selectedVendor?.name || ""}`}
        size="xl"
      >
        {selectedVendor && <VendorDetail vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />}
      </Modal>
    </div>
  )
}

export default Vendors
