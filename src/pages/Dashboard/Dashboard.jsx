import KPICards from "./KPICards"
import Charts from "./Charts"
import RecentTransactions from "./RecentTransactions"

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      </div>

      <KPICards />
      <Charts />
      <RecentTransactions />
    </div>
  )
}

export default Dashboard
