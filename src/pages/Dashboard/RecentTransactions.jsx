import { useStore } from "../../stores/useStore"
import { format } from "date-fns"

const RecentTransactions = () => {
  const { transactions } = useStore()

  const recentTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  const getTypeColor = (type) => {
    switch (type) {
      case "Credit":
        return "text-green-600 bg-green-50"
      case "Debit":
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
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h3>

      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                  {transaction.type}
                </span>
                <span className="text-sm text-slate-600">{format(new Date(transaction.date), "MMM dd, yyyy")}</span>
              </div>
              <p className="font-medium text-slate-800 mt-1">{transaction.description}</p>
              <p className="text-sm text-slate-600">{transaction.category}</p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${transaction.type === "Income" ? "text-green-600" : "text-slate-800"}`}>
                ${transaction.amount.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTransactions
