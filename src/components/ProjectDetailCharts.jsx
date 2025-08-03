import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const chartOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#475569", // slate-600
        boxWidth: 14,
        padding: 20,
      },
    },
    title: {
      display: true,
      text: title,
      color: "#1e293b", // slate-800
      font: {
        size: 16,
        weight: "bold",
      },
      padding: {
        top: 10,
        bottom: 30,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "#475569" },
      grid: { display: false },
    },
    y: {
      ticks: { color: "#475569" },
      grid: {
        color: "#e2e8f0", // slate-200
        borderDash: [5, 5],
      },
    },
  },
  borderRadius: 8,
  barPercentage: 0.6,
  categoryPercentage: 0.6,
});

const PartnerInvestmentChart = ({ partnerInvestments }) => {
  const labels = partnerInvestments.map((p) => p.name);
  const hasData = partnerInvestments.length > 0;

  const data = {
    labels,
    datasets: [
      {
        label: "Investments",
        data: partnerInvestments.map((p) => p.investments),
        backgroundColor: "rgba(34, 197, 94, 0.5)", // green-500
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
      {
        label: "Receipts",
        data: partnerInvestments.map((p) => p.receipts),
        backgroundColor: "rgba(99, 102, 241, 0.5)", // indigo-500
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-64">
      {hasData ? <Bar data={data} options={chartOptions("Partner Investments")} /> : <NoData />}
    </div>
  );
};

const VendorExpenseChart = ({ vendorExpenses }) => {
  const labels = vendorExpenses.map((v) => v.name);
  const hasData = vendorExpenses.length > 0;

  const data = {
    labels,
    datasets: [
      {
        label: "Expenses",
        data: vendorExpenses.map((v) => v.expenses),
        backgroundColor: "rgba(239, 68, 68, 0.5)", // red-500
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-64">
      {hasData ? <Bar data={data} options={chartOptions("Vendor Expenses")} /> : <NoData />}
    </div>
  );
};

const WorkerPaymentChart = ({ workerPayments }) => {
  const labels = workerPayments.map((w) => w.name);
  const hasData = workerPayments.length > 0;

  const data = {
    labels,
    datasets: [
      {
        label: "Payments",
        data: workerPayments.map((w) => w.payments),
        backgroundColor: "rgba(59, 130, 246, 0.5)", // blue-500
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-64">
      {hasData ? <Bar data={data} options={chartOptions("Worker Payments")} /> : <NoData />}
    </div>
  );
};

const NoData = () => (
  <div className="flex items-center justify-center h-full text-slate-400 text-sm">
    No data to display
  </div>
);

export { PartnerInvestmentChart, VendorExpenseChart, WorkerPaymentChart };
