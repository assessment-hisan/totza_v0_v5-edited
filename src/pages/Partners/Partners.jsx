"use client"

import { useEffect, useState } from "react"
import { useStore } from "../../stores/useStore"
import { Plus, Download, Eye } from "lucide-react"
import Modal from "../../components/Modal"
import Table from "../../components/Table"
import AddPartnerForm from "./AddPartnerForm"
import PartnerDetail from "./PartnerDetail"
import { generateEntityTransactionsPDF } from "../../utils/pdfHelpers"

const Partners = () => {
  const { partners, transactions } = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState(null)

  const getPartnerTransactions = (partnerId) => {
    return transactions.filter((t) => t.linkedPartner === partnerId)
  }

  const columns = [
    {
      header: "Name",
      key: "name",
    },
    {
      header: "Type",
      key: "type",
    },
    {
      header: "Contact Person",
      key: "contactPerson",
    },
    {
      header: "Email",
      key: "email",
    },
    {
      header: "Transactions",
      key: "transactions",
      render: (row) => getPartnerTransactions(row.id).length,
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedPartner(row)
            }}
            className="p-1 hover:bg-slate-100 rounded"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              const partnerTransactions = getPartnerTransactions(row.id)
              generateEntityTransactionsPDF(row.name, "Partner", partnerTransactions)
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
        <h1 className="text-2xl font-bold text-slate-800">Partners</h1>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add Partner
        </button>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">All Partners ({partners.length})</h3>
        </div>

        <Table columns={columns} data={partners} onRowClick={(partner) => setSelectedPartner(partner)} />
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Partner" size="lg">
        <AddPartnerForm onClose={() => setShowAddModal(false)} />
      </Modal>

      <Modal
        isOpen={!!selectedPartner}
        onClose={() => setSelectedPartner(null)}
        title={`Partner: ${selectedPartner?.name || ""}`}
        size="xl"
      >
        {selectedPartner && <PartnerDetail partner={selectedPartner} onClose={() => setSelectedPartner(null)} />}
      </Modal>
    </div>
  )
}

export default Partners
