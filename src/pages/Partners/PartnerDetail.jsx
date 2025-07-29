"use client"
import { useStore } from "../../stores/useStore"
import { Download } from "lucide-react"
import { format } from "date-fns"
import { generateEntityTransactionsPDF } from "../../utils/pdfHelpers"

const PartnerDetail = ({ partner, onClose }) => {
  const { transactions } = useStore()

  const partnerTransactions = transactions.filter((t) => t.linkedPartner === partner.id)

  const totalAmount = partnerTransactions.reduce((sum, t) => sum + t.amount, 0)

  const handleExportPDF = () => {
    generateEntityTransactionsPDF(partner.name, "Partner", partnerTransactions)
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

  return (
    <div className="space-y-6">
      {/* Partner Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h4 className="font-medium text-slate-800 mb-3">Partner Information</h4>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-slate-600">Type:</span>
              <span className="ml-2 font-medium">{partner.type}</span>
            </div>
            <div>
              <span className="text-sm text-slate-600">Contact Person:</span>
              <span className="ml-2 font-medium">{partner.contactPerson || "N/A"}</span>
            </div>
            <div>
              <span className="text-sm text-slate-600">Email:</span>
              <span className="ml-2 font-medium">{partner.email || "N/A"}</span>
            </div>
            <div>
              <span className="text-sm text-slate-600">Phone:</span>
              <span className="ml-2 font-medium">{partner.phone || "N/A"}</span>
            </div>
            {partner.address && (
              <div>
                <span className="text-sm text-slate-600">Address:</span>
                <p className="mt-1 text-sm">{partner.address}</p>
              </div>
            )}
            {partner.notes && (
              <div>
                <span className="text-sm text-slate-600">Notes:</span>
                <p className="mt-1 text-sm">{partner.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card p-4">
          <h4 className="font-medium text-slate-800 mb-3">Transaction Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Total Transactions:</span>
              <span className="font-medium">{partnerTransactions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Total Amount:</span>
              <span className="font-medium">${totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-slate-800">Related Transactions ({partnerTransactions.length})</h4>
          <button onClick={handleExportPDF} className="btn-primary flex items-center gap-2">
            <Download size={16} />
            Export PDF
          </button>
        </div>

        {partnerTransactions.length > 0 ? (
          <div className="overflow-x-auto">
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
                {partnerTransactions.map((transaction) => (
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
        ) : (
          <p className="text-slate-500 text-center py-8">No transactions found for this partner.</p>
        )}
      </div>
    </div>
  )
}

export default PartnerDetail
