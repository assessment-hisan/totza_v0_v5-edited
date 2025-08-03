"use client"

import { useState } from "react"
import { useStore } from "../../stores/useStore"
import { Plus, Download, Eye } from "lucide-react"
import Modal from "../../components/Modal"
import Table from "../../components/Table"
import AddProjectForm from "./AddProjectForm"
import ProjectDetail from "./ProjectDetail"
import { generateEntityTransactionsPDF } from "../../utils/pdfHelpers"

const Projects = () => {
  const { projects, transactions } = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const getProjectTransactions = (projectId) => {
    const projectTransactions =  transactions.filter((t) => t.linkedProject === projectId)
    return projectTransactions
  }

  const columns = [
    {
      header: "Name",
      key: "name",
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>{row.status}</span>
      ),
    },
    {
      header: "Budget",
      key: "budget",
      render: (row) => (row.budget ? `$${row.budget.toLocaleString()}` : "N/A"),
    },
    {
      header: "Start Date",
      key: "startDate",
    },
    {
      header: "Transactions",
      key: "transactions",
      render: (row) => getProjectTransactions(row.id).length,
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedProject(row)
            }}
            className="p-1 hover:bg-slate-100 rounded"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              const projectTransactions = getProjectTransactions(row.id)
              generateEntityTransactionsPDF(row.name, "Project", projectTransactions)
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-50"
      case "Planning":
        return "text-blue-600 bg-blue-50"
      case "Completed":
        return "text-slate-600 bg-slate-50"
      case "On Hold":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add Project
        </button>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">All Projects ({projects.length})</h3>
        </div>

        <Table columns={columns} data={projects} onRowClick={(project) => setSelectedProject(project)} />
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Project" size="lg">
        <AddProjectForm onClose={() => setShowAddModal(false)} />
      </Modal>

      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={`Project: ${selectedProject?.name || ""}`}
        size="xl"
      >
        {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </Modal>
    </div>
  
  )
}

export default Projects
