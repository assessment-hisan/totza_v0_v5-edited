import { useStore } from "../../stores/useStore"
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react"

const KPICards = () => {
  const { transactions } = useStore()

  const totalInflow = transactions.filter((t) => t.type === "Credit").reduce((sum, t) => sum + t.amount, 0)

  const totalOutflow = transactions
    .filter((t) => ["Debit", "Due"].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0)

  const netCashFlow = totalInflow - totalOutflow

  const totalLoans = transactions.filter((t) => t.type === "Loan").reduce((sum, t) => sum + t.amount, 0)

  const kpis = [
    {
      title: "Total Inflow",
      value: `$${totalInflow.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Outflow",
      value: `$${totalOutflow.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Net Cash Flow",
      value: `$${netCashFlow.toLocaleString()}`,
      icon: DollarSign,
      color: netCashFlow >= 0 ? "text-green-600" : "text-red-600",
      bgColor: netCashFlow >= 0 ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "Total Loans",
      value: `$${totalLoans.toLocaleString()}`,
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <Icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default KPICards
