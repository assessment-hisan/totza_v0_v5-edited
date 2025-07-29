import { useStore } from "../../stores/useStore"
import ChartCard from "../../components/ChartCard"
import { Doughnut, Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const Charts = () => {
  const { transactions, partners } = useStore()

  // Inflow vs Outflow Donut
  const totalInflow = transactions.filter((t) => t.type === "Credit").reduce((sum, t) => sum + t.amount, 0)

  const totalOutflow = transactions
    .filter((t) => ["Debit", "Due"].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0)

  const inflowOutflowData = {
    labels: ["Inflow", "Outflow"],
    datasets: [
      {
        data: [totalInflow, totalOutflow],
        backgroundColor: ["#10b981", "#ef4444"],
        borderWidth: 0,
      },
    ],
  }

  // Transaction Type Bar
  const transactionTypes = ["Credit", "Debit", "Due", "Loan"]
  const typeData = transactionTypes.map((type) =>
    transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0),
  )

  const transactionTypeData = {
    labels: transactionTypes,
    datasets: [
      {
        label: "Amount",
        data: typeData,
        backgroundColor: ["#10b981", "#ef4444", "#f59e0b", "#3b82f6"],
        borderWidth: 0,
      },
    ],
  }

  // Partner Activity Bar
  const partnerActivity = partners
    .map((partner) => {
      const partnerTransactions = transactions.filter((t) => t.partnerId === partner.id)
      const total = partnerTransactions.reduce((sum, t) => sum + t.amount, 0)
      return {
        name: partner.name.length > 16 ? partner.name.substring(0, 16) + "..." : partner.name,
        amount: total,
      }
    })
    .filter((p) => p.amount > 0)

  const partnerActivityData = {
    labels: partnerActivity.map((p) => p.name),
    datasets: [
      {
        label: "Transaction Amount",
        data: partnerActivity.map((p) => p.amount),
        backgroundColor: "#0ea5e9",
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f1f5f9",
        bodyColor: "#f1f5f9",
        borderColor: "#475569",
        borderWidth: 1,
      },
    },
  }

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => "$" + value.toLocaleString(),
        },
      },
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ChartCard title="Inflow vs Outflow">
        <Doughnut data={inflowOutflowData} options={chartOptions} />
      </ChartCard>

      <ChartCard title="Transaction Types">
        <Bar data={transactionTypeData} options={barOptions} />
      </ChartCard>

      <ChartCard title="Partner Activity">
        <Bar data={partnerActivityData} options={barOptions} />
      </ChartCard>
    </div>
  )
}

export default Charts
