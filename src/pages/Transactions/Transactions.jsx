import React from "react"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useStore } from "../../stores/useStore"
import { Plus, Download, Filter, Search, Calendar, X, FileText, Trash2 } from "lucide-react"
import Modal from "../../components/Modal"
import AddTransactionForm from "./AddTransactionForm"
import TransactionFilters from "./TransactionFilters"
import ReportModal from "./ReportModal"
import { format, isToday, startOfDay, endOfDay } from "date-fns"
import { generateTransactionsPDF } from "../../utils/pdfHelpers"
import TransactionTable from "../../components/TransactionTable"

const Transactions = () => {
const vendors = useStore(state => state.vendors)

  const { transactions, deleteTransaction } = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: "",
    partner: "",
    project: "",
    vendor: "",
    worker: "",
    search: "",
    dateFrom: "",
    dateTo: "",
  })

  // Simulate loading
  useEffect(() => {
      
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  
  }, [])

  // Memoized filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Type filter
      if (filters.type && transaction.type !== filters.type) return false
      
      // Partner filter
      if (filters.partner && transaction.partnerId !== filters.partner) return false
      
      // Project filter
      if (filters.project && transaction.projectId !== filters.project) return false
      
      // Vendor filter
      if (filters.vendor && transaction.vendorId !== filters.vendor) return false
      
      // Worker filter
      if (filters.worker && transaction.workerId !== filters.worker) return false
      
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableText = `${transaction.description} ${transaction.category}`.toLowerCase()
        if (!searchableText.includes(searchTerm)) return false
      }
      
      // Date filters
      if (filters.dateFrom) {
        const transactionDate = new Date(transaction.date)
        const fromDate = startOfDay(new Date(filters.dateFrom))
        if (transactionDate < fromDate) return false
      }
      
      if (filters.dateTo) {
        const transactionDate = new Date(transaction.date)
        const toDate = endOfDay(new Date(filters.dateTo))
        if (transactionDate > toDate) return false
      }
   
      return true
    })
  }, [transactions, filters])

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const grouped = {}
    
    filteredTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(transaction => {
        const dateKey = format(new Date(transaction.date), 'yyyy-MM-dd')
        const formattedDate = format(new Date(transaction.date), 'MMM dd, yyyy')
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = {
            formattedDate,
            transactions: []
          }
        }
        grouped[dateKey].transactions.push(transaction)
      })

    return grouped
  }, [filteredTransactions])

  // Calculate totals
  const totals = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => {
      const amount = Number(transaction.amount) || 0
      
      switch (transaction.type) {
        case 'Debit':
          acc.income += amount
          break
        case 'Credit':
          acc.expense += amount
          break
        case 'Due':
          acc.due += amount
          break
        case 'Loan':
          acc.loan += amount
          break
        default:
          break
      }
      
      return acc
    }, { income: 0, expense: 0, due: 0, loan: 0 })
  }, [filteredTransactions])

  // Get type styling
  const getTypeColor = useCallback((type) => {
    switch (type) {
      case "Income":
        return "text-green-700 bg-green-100 border-green-200"
      case "Expense":
        return "text-red-700 bg-red-100 border-red-200"
      case "Due":
        return "text-yellow-700 bg-yellow-100 border-yellow-200"
      case "Loan":
        return "text-blue-700 bg-blue-100 border-blue-200"
      default:
        return "text-gray-700 bg-gray-100 border-gray-200"
    }
  }, [])

  // Handlers
  const handleDeleteClick = useCallback((transaction, e) => {
    e?.stopPropagation()
    setSelectedTransaction(transaction)
    setShowDeleteModal(true)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (selectedTransaction) {
      deleteTransaction(selectedTransaction.id)
      setShowDeleteModal(false)
      setSelectedTransaction(null)
    }
  }, [selectedTransaction, deleteTransaction])

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false)
    setSelectedTransaction(null)
  }, [])

  const handleExportPDF = useCallback(() => {
    generateTransactionsPDF(filteredTransactions, `Transactions-${format(new Date(), 'yyyy-MM-dd')}`)
  }, [filteredTransactions])

  const clearFilters = useCallback(() => {
    setFilters({
      type: "",
      partner: "",
      project: "",
      vendor: "",
      worker: "",
      search: "",
      dateFrom: "",
      dateTo: "",
    })
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 text-lg">Loading transactions...</span>
      </div>
    )
  }

  const hasActiveFilters = Object.values(filters).some(filter => filter !== "")
  const sortedDateKeys = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Manage and track your financial transactions</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                {Object.values(filters).filter(f => f !== "").length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setShowReportModal(true)} 
            className="btn-secondary flex items-center gap-2"
          >
            <FileText size={16} />
            Report
          </button>
          
          <button 
            onClick={handleExportPDF}
            className="btn-secondary flex items-center gap-2"
            disabled={filteredTransactions.length === 0}
          >
            <Download size={16} />
            Export PDF
          </button>
          
          <button 
            onClick={() => setShowAddModal(true)} 
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Transactions</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X size={14} />
                Clear All
              </button>
            )}
          </div>
          <TransactionFilters filters={filters} setFilters={setFilters} />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Income</p>
              <p className="text-2xl font-bold text-green-900">${totals.income.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <div className="w-6 h-6 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Total Expenses</p>
              <p className="text-2xl font-bold text-red-900">${totals.expense.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <div className="w-6 h-6 bg-red-600 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Outstanding Dues</p>
              <p className="text-2xl font-bold text-yellow-900">${totals.due.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <div className="w-6 h-6 bg-yellow-600 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Net Balance</p>
              <p className={`text-2xl font-bold ${(totals.income - totals.expense) >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                ${(totals.income - totals.expense).toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                All Transactions ({filteredTransactions.length})
              </h3>
              {hasActiveFilters && (
                <p className="text-sm text-gray-600 mt-1">
                  Filtered from {transactions.length} total transactions
                </p>
              )}
            </div>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No transactions found</p>
            <p className="text-gray-400 text-sm mt-1">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Add a transaction to get started'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          // <div className="overflow-x-auto">
          //   <table className="min-w-full divide-y divide-gray-200">
          //     <thead className="bg-gray-50">
          //       <tr>
          //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
          //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
          //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          //       </tr>
          //     </thead>
          //     <tbody className="bg-white divide-y divide-gray-200">
          //       {sortedDateKeys.map((dateKey) => {
          //         const { formattedDate, transactions: dailyTransactions } = groupedTransactions[dateKey]
          //         const isDateToday = isToday(new Date(dateKey))
          //         const dayOfWeek = format(new Date(dateKey), 'EEEE')

          //         return (
          //           <React.Fragment key={`date-group-${dateKey}`}>
          //             {/* Date Header */}
          //             <tr className={isDateToday ? 'bg-blue-50' : 'bg-gray-50'}>
          //               <td colSpan={6} className="px-6 py-3">
          //                 <div className="flex items-center justify-between">
          //                   <span className={`text-sm font-semibold ${isDateToday ? 'text-blue-800' : 'text-gray-700'}`}>
          //                     {isDateToday ? 'Today - ' : ''}{dayOfWeek}, {formattedDate}
          //                   </span>
          //                   <span className="text-xs text-gray-600">
          //                     {dailyTransactions.length} transaction{dailyTransactions.length !== 1 ? 's' : ''}
          //                   </span>
          //                 </div>
          //               </td>
          //             </tr>
                      
          //             {/* Transactions */}
          //             {dailyTransactions.map((transaction) => (
          //               <tr
          //                 key={transaction.id}
          //                 className="hover:bg-gray-50 transition-colors duration-150"
          //               >
          //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          //                   {format(new Date(transaction.date), 'MMM dd, yyyy')}
          //                 </td>
          //                 <td className="px-6 py-4 whitespace-nowrap">
          //                   <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getTypeColor(transaction.type)}`}>
          //                     {transaction.type}
          //                   </span>
          //                 </td>
          //                 <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
          //                   <div className="truncate" title={transaction.description}>
          //                     {transaction.description}
          //                   </div>
          //                 </td>
          //                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          //                   ${Number(transaction.amount).toLocaleString()}
          //                 </td>
          //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          //                   {transaction.category || 'N/A'}
          //                 </td>
          //                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          //                   <div className="flex items-center gap-2">
          //                     <button
          //                       onClick={(e) => {
          //                         e.stopPropagation()
          //                         generateTransactionsPDF([transaction], `Transaction-${transaction.id}`)
          //                       }}
          //                       className="text-blue-600 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50"
          //                       title="Download PDF"
          //                     >
          //                       <Download size={16} />
          //                     </button>
          //                     <button
          //                       onClick={(e) => handleDeleteClick(transaction, e)}
          //                       className="text-red-600 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
          //                       title="Delete transaction"
          //                     >
          //                       <Trash2 size={16} />
          //                     </button>
          //                   </div>
          //                 </td>
          //               </tr>
          //             ))}
          //           </React.Fragment>
          //         )
          //       })}
          //     </tbody>
          //   </table>
          // </div>
          <TransactionTable initialTransactions={filteredTransactions} isLoading={isLoading} />
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Transaction" size="lg">
        <AddTransactionForm onClose={() => setShowAddModal(false)} />
      </Modal>

      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Transaction Report" size="xl">
        <ReportModal transactions={filteredTransactions} onClose={() => setShowReportModal(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={handleCloseDeleteModal} title="Confirm Deletion" size="sm">
        <div className="p-4">
          {selectedTransaction && (
            <>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this transaction? This action cannot be undone.
              </p>
              <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Amount:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${Number(selectedTransaction.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Type:</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs border ${getTypeColor(selectedTransaction.type)}`}>
                      {selectedTransaction.type}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Description:</span> {selectedTransaction.description}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={handleCloseDeleteModal}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete Transaction
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Transactions