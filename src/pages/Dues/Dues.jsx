import { useState, useMemo } from "react"
import { useStore } from "../../stores/useStore"
import { Download, Search } from "lucide-react"
import Modal from "../../components/Modal"
import AddPaymentForm from "./AddPaymentForm"
import { format } from "date-fns"
import { generateTransactionsPDF } from "../../utils/pdfHelpers"
import Table from "../../components/Table"

const Dues = () => {
  const { transactions } = useStore()
  const { getDuePaidAmount, getDueRemainingAmount, getDueStatus } = useStore()

  const [selectedDue, setSelectedDue] = useState(null)
  const [paymentHistoryModal, setPaymentHistoryModal] = useState(null)
  const [detailModal, setDetailModal] = useState(null)
  const [activeTab, setActiveTab] = useState("history")
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    dateFrom: "",
    dateTo: ""
  })


  /* ---------- helpers ---------- */
  const safeFmt = (d) =>
    d && !isNaN(Date.parse(d)) ? format(new Date(d), "MMM dd, yyyy") : "—"

  const currencyFmt = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val || 0)

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-red-100 text-red-700"
      case "Partially Paid":
        return "bg-yellow-100 text-yellow-700"
      case "Fully Paid":
        return "bg-green-100 text-green-700"
      default:
        return "bg-slate-100 text-slate-600"
    }
  }

  const getProgressColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-red-500"
      case "Partially Paid":
        return "bg-yellow-500"
      case "Fully Paid":
        return "bg-green-500"
      default:
        return "bg-slate-400"
    }
  }

  /* ---------- data ---------- */
  const dues = useMemo(
    () => transactions.filter((t) => t.type === "Due"),
    [transactions]
  )
const duesPaymentsLength = useMemo(() => {
  return dues.reduce((sum, d) => sum + (d.payments?.length || 0), 0)
}, [dues])

  const payments = useMemo(() => {
    return dues
      .flatMap((due) =>
        (due.payments || []).map((p) => ({
          ...p,
          dueId: due.id,
          description: due.description,
          status: getDueStatus(due),
        }))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [dues, getDueStatus])

  const totalDue = useMemo(
    () => dues.reduce((s, d) => s + (d.originalDueAmount || 0), 0),
    [dues]
  )
  const totalPaid = useMemo(
    () => dues.reduce((s, d) => s + (getDuePaidAmount(d) || 0), 0),
    [dues]
  )

  /* ---------- filtering ---------- */
  const filteredDues = useMemo(() => {
    return dues.filter(due => {
      // Search filter
      if (filters.search && 
          !due.description.toLowerCase().includes(filters.search.toLowerCase()) &&
          !due.category?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      
      // Status filter
      if (filters.status && getDueStatus(due) !== filters.status) {
        return false
      }
      
      // Date range filter
      if (filters.dateFrom && new Date(due.date) < new Date(filters.dateFrom)) {
        return false
      }
      if (filters.dateTo && new Date(due.date) > new Date(filters.dateTo)) {
        return false
      }
      
      return true
    })
  }, [dues, filters, getDueStatus])

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      // Search filter
      if (filters.search && 
          !payment.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      
      // Status filter
      if (filters.status && payment.status !== filters.status) {
        return false
      }
      
      // Date range filter
      if (filters.dateFrom && new Date(payment.date) < new Date(filters.dateFrom)) {
        return false
      }
      if (filters.dateTo && new Date(payment.date) > new Date(filters.dateTo)) {
        return false
      }
      
      return true
    })
  }, [payments, filters])

  /* ---------- table columns ---------- */
  const columns = [
    { header: "Date", key: "date", render: (r) => safeFmt(r.date) },
    { header: "Due Date", key: "dueDate", render: (r) => safeFmt(r.dueDate) },
    { header: "Description", key: "description" },
    {
      header: "Original",
      key: "originalDueAmount",
      render: (r) => currencyFmt(r.originalDueAmount),
    },
    {
      header: "Paid",
      key: "paidAmount",
      render: (r) => currencyFmt(getDuePaidAmount(r)),
    },
    {
      header: "Remaining",
      key: "remainingAmount",
      render: (r) => currencyFmt(getDueRemainingAmount(r)),
    },
    {
      header: "Progress",
      key: "progress",
      render: (r) => {
        const paid = getDuePaidAmount(r)
        const total = r.originalDueAmount || 0
        const status = getDueStatus(r)
        const progress = total > 0 ? (paid / total) * 100 : 0
        return (
          <div className="w-32">
            <div className="h-2 bg-slate-200 rounded-full">
              <div
                className={`h-2 rounded-full ${getProgressColor(status)}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">{progress.toFixed(0)}%</p>
          </div>
        )
      },
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
  ]

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      dateFrom: "",
      dateTo: ""
    })
  }

  const FilterComponent = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
      <div className="md:col-span-2 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>
      
      <select
        className="w-full px-3 py-2 border rounded-lg"
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Partially Paid">Partially Paid</option>
        <option value="Fully Paid">Fully Paid</option>
      </select>
      
      <input
        type="date"
        className="w-full px-3 py-2 border rounded-lg"
        value={filters.dateFrom}
        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
        placeholder="From"
      />
      
      <input
        type="date"
        className="w-full px-3 py-2 border rounded-lg"
        value={filters.dateTo}
        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
        placeholder="To"
      />
      
      {(filters.search || filters.status || filters.dateFrom || filters.dateTo) && (
        <div className="md:col-span-5">
          <button 
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-4 flex gap-20">
          <div>
            <h4 className="text-sm font-medium text-slate-600">Total Dues</h4>
          <p className="text-2xl font-bold">{dues.length}</p>
          </div>
           <div>
            <h4 className="text-sm font-medium text-slate-600">Total payments</h4>
          <p className="text-2xl font-bold">{duesPaymentsLength}</p>
          </div>
        </div>
        <div className="card p-4">
          <h4 className="text-sm font-medium text-slate-600">Total Amount Due</h4>
          <p className="text-2xl font-bold text-red-600">
            {currencyFmt(totalDue)}
          </p>
        </div>
        <div className="card p-4">
          <h4 className="text-sm font-medium text-slate-600">Total Paid</h4>
          <p className="text-2xl font-bold text-green-600">
            {currencyFmt(totalPaid)}
          </p>
        </div>
      </div>

      {/* tabs */}
      <div className="card p-6">
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 font-medium ${
              activeTab === "history"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-slate-500"
            }`}
          >
            Transaction History
          </button>
          <button
            onClick={() => setActiveTab("dues")}
            className={`px-4 py-2 font-medium ${
              activeTab === "dues"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-slate-500"
            }`}
          >
            All Dues
          </button>
        </div>

        {/* Filter Component */}
        <FilterComponent />

        {/* Transaction History Tab */}
        {activeTab === "history" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Payments</h2>
              <button
                onClick={() => generateTransactionsPDF(filteredPayments, "PaymentHistory")}
                className="btn-secondary flex items-center gap-2"
                disabled={filteredPayments.length === 0}
              >
                <Download size={16} />
                Export PDF
              </button>
            </div>

            {filteredPayments.length === 0 ? (
              <p className="text-slate-500 italic">No payments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {filteredPayments.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{currencyFmt(p.amount)}</p>
                      <p className="text-sm text-slate-500">{p.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{safeFmt(p.date)}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          p.status
                        )}`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Dues Tab */}
        {activeTab === "dues" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">All Dues</h2>
              <button
                onClick={() => generateTransactionsPDF(filteredDues, "DuesReport")}
                className="btn-secondary flex items-center gap-2"
                disabled={filteredDues.length === 0}
              >
                <Download size={16} />
                Export PDF
              </button>
            </div>
            <Table
              columns={columns}
              data={filteredDues}
              onRowClick={(row) => setDetailModal(row)}
            />
          </div>
        )}
      </div>

      {/* Due Detail Modal */}
      <Modal
        isOpen={!!detailModal}
        onClose={() => setDetailModal(null)}
        title={`Due Details - ${detailModal?.description || ""}`}
        size="lg"
      >
        {detailModal && (
          <div className="space-y-6">
            {/* info section */}
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Date:</strong> {safeFmt(detailModal.date)}
              </p>
              <p>
                <strong>Due Date:</strong> {safeFmt(detailModal.dueDate)}
              </p>
              <p>
                <strong>Original:</strong>{" "}
                {currencyFmt(detailModal.originalDueAmount)}
              </p>
              <p>
                <strong>Paid:</strong> {currencyFmt(getDuePaidAmount(detailModal))}
              </p>
              <p>
                <strong>Remaining:</strong>{" "}
                {currencyFmt(getDueRemainingAmount(detailModal))}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    getDueStatus(detailModal)
                  )}`}
                >
                  {getDueStatus(detailModal)}
                </span>
              </p>
            </div>

            {/* payment list */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Payments</h3>
              {detailModal.payments?.length > 0 ? (
                <div className="space-y-2">
                  {detailModal.payments
                    .slice()
                    .reverse()
                    .map((p, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <span>{safeFmt(p.date)}</span>
                        <span>{currencyFmt(p.amount)}</span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No payments found.</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() =>
                  generateTransactionsPDF([detailModal], `Due-${detailModal.id}`)
                }
                className="btn-secondary flex items-center gap-2"
              >
                <Download size={16} />
                Export PDF
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* add payment modal */}
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