import { format } from "date-fns"

export const safeFmt = (d) =>
  d && !isNaN(Date.parse(d)) ? format(new Date(d), "MMM dd, yyyy") : "—"

export const currencyFmt = (val) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val || 0)

export const getStatusColor = (status) => {
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

export const getProgressColor = (status) => {
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
