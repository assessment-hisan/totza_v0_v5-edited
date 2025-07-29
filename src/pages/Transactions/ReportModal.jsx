"use client"
import { format } from "date-fns"
import { Download } from "lucide-react"
import { generateTransactionsPDF } from "../../utils/pdfHelpers"
import {  useEffect } from "react"

const ReportModal = ({ transactions, onClose }) => {
  const handleExportPDF = () => {
    generateTransactionsPDF(transactions, "Transactions Report")
    
  }

  const totalIncome = transactions.filter((t) => t.type === "Income" || t.type === "Credit").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => ["Debit", "Due"].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0)

  // const totalLoans = transactions.filter((t) => t.type === "Loan").reduce((sum, t) => sum + t.amount, 0)
useEffect(()=>{console.log(transactions, totalIncome)},[])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Transaction Report Summary</h3>
        <button onClick={handleExportPDF} className="btn-primary flex items-center gap-2">
          <Download size={16} />
          Export PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <h4 className="text-sm font-medium text-slate-600">Total Income</h4>
          <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <h4 className="text-sm font-medium text-slate-600">Total Expenses</h4>
          <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
        </div>
       
      </div>

      {/* Transaction Table */}
      <div className="card p-4">
        <h4 className="font-medium text-slate-800 mb-4">Transactions ({transactions.length})</h4>
        <div className="overflow-x-auto max-h-96">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{format(new Date(transaction.date), "MMM dd, yyyy")}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td>{transaction.description}</td>
                  <td>${transaction.amount.toLocaleString()}</td>
                  <td>{transaction.category || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const getTypeColor = (type) => {
  switch (type) {
    case "Income":
      return "text-green-600 bg-green-50"
    case "Expense":
      return "text-red-600 bg-red-50"
    case "Due":
      return "text-yellow-600 bg-yellow-50"
    case "Loan":
      return "text-blue-600 bg-blue-50"
    default:
      return "text-slate-600 bg-slate-50"
  }
}

export default ReportModal
