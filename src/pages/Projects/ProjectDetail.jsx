import { useState } from "react"
import { getStatusColor, getTypeColor, calculateSummaries, buildPartnerData, buildVendorData, buildWorkerData } from "./helper.js"
import { PartnerInvestmentChart, VendorExpenseChart, WorkerPaymentChart } from "../../components/ProjectDetailCharts"
import { Download } from "lucide-react"
import { format } from "date-fns"
import { useStore } from "../../stores/useStore"

const ProjectDetail = ({ project, onClose, }) => {
  const { transactions, partners, vendors, workers } = useStore();
 
 const [tab, setTab] = useState("transactions");
  const projectTransactions = transactions.filter((t) => t.linkedProject === project.id);
  const { income: totalIncome, expenses: totalExpenses, net } = calculateSummaries(projectTransactions);

  // Pass project.id to the helper functions so they can filter by project
  const partnerInvestments = buildPartnerData(partners, transactions, project.id);
  const vendorExpenses = buildVendorData(vendors, transactions, project.id);
  const workerPayments = buildWorkerData(workers, transactions, project.id);

  const handleExportPDF = () => {
    generateProjectDetailPDF(project, projectTransactions);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b">
        <button 
          onClick={() => setTab("transactions")} 
          className={`py-2 px-4 ${tab === "transactions" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
        >
          Transactions
        </button>
        <button 
          onClick={() => setTab("summary")} 
          className={`py-2 px-4 ${tab === "summary" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
        >
          Summary
        </button>
      </div>

      {tab === "summary" && (
        <>
          {/* Project Info & Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Info */}
            <div className="card p-4">
              <h4 className="font-medium text-slate-800 mb-3">Project Information</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-slate-600">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Budget:</span>
                  <span className="ml-2 font-medium">
                    {project.budget ? `$${project.budget.toLocaleString()}` : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Start Date:</span>
                  <span className="ml-2 font-medium">{project.startDate || "N/A"}</span>
                </div>
                {project.description && (
                  <div>
                    <span className="text-sm text-slate-600">Description:</span>
                    <p className="mt-1 text-sm">{project.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="card p-4">
              <h4 className="font-medium text-slate-800 mb-3">Financial Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total Income:</span>
                  <span className="font-medium text-green-600">${totalIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total Expenses:</span>
                  <span className="font-medium text-red-600">${totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium text-slate-800">Net:</span>
                  <span className={`font-bold ${net >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ${net.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Partner Investments */}
          <div className="card p-4">
            <PartnerInvestmentChart partnerInvestments={partnerInvestments} />
            {partnerInvestments.length > 0 ? (
              <div className="overflow-x-auto mt-4">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Partner</th>
                      <th>Investments</th>
                      <th>Receipts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partnerInvestments.map((partner) => (
                      <tr key={partner.name}>
                        <td>{partner.name}</td>
                        <td>${partner.investments.toLocaleString()}</td>
                        <td>${partner.receipts.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4 mt-4">No partner investments found for this project.</p>
            )}
          </div>

          {/* Vendor Expenses */}
          <div className="card p-4">
            
            <VendorExpenseChart vendorExpenses={vendorExpenses} />
            {vendorExpenses.length > 0 ? (
              <div className="overflow-x-auto mt-4">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Vendor</th>
                      <th>Expenses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorExpenses.map((vendor) => (
                      <tr key={vendor.name}>
                        <td>{vendor.name}</td>
                        <td>${vendor.expenses.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4 mt-4">No vendor expenses found for this project.</p>
            )}
          </div>
           {/* Worker Payments */}
          <div className="card p-4">
            
            <WorkerPaymentChart workerPayments={workerPayments} />
            {workerPayments.length > 0 ? (
              <div className="overflow-x-auto mt-4">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Worker</th>
                      <th>Payments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workerPayments.map((worker) => (
                      <tr key={worker.name}>
                        <td>{worker.name}</td>
                        <td>${worker.payments.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4 mt-4">No worker payments found for this project.</p>
            )}
          </div>
          </div>

         
        </>
      )}

      {tab === "transactions" && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-slate-800">Related Transactions ({projectTransactions.length})</h4>
            <button onClick={handleExportPDF} className="btn-primary flex items-center gap-2">
              <Download size={16} /> Export PDF
            </button>
          </div>

          {projectTransactions.length > 0 ? (
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
                  {projectTransactions.map((transaction) => (
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
            <p className="text-slate-500 text-center py-8">No transactions found for this project.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;


// import { useStore } from "../../stores/useStore"
// import { Download } from "lucide-react"
// import { format } from "date-fns"
// import { generateProjectDetailPDF } from "../../utils/pdfHelpers"
// import { VendorExpenseChart, WorkerPaymentChart, PartnerInvestmentChart } from "../../components/ProjectDetailCharts"
// const ProjectDetail = ({ project, onClose }) => {
//   const { transactions, partners, vendors, workers } = useStore();

//   const projectTransactions = transactions.filter((t) => t.linkedProject === project.id)

//   const totalIncome = projectTransactions.filter((t) => t.type === "Credit").reduce((sum, t) => sum + t.amount, 0)

//   const totalExpenses = projectTransactions
//     .filter((t) => ["Debit", "Due"].includes(t.type))
//     .reduce((sum, t) => sum + t.amount, 0)

//   const handleExportPDF = () => {
//     generateProjectDetailPDF(project, projectTransactions)
//   }

//   const getTypeColor = (type) => {
//     switch (type) {
//       case "Income":
//         return "text-green-600 bg-green-50"
//       case "Expense":
//         return "text-red-600 bg-red-50"
//       case "Due":
//         return "text-yellow-600 bg-yellow-50"
//       case "Loan":
//         return "text-blue-600 bg-blue-50"
//       default:
//         return "text-slate-600 bg-slate-50"
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Active":
//         return "text-green-600 bg-green-50"
//       case "Planning":
//         return "text-blue-600 bg-blue-50"
//       case "Completed":
//         return "text-slate-600 bg-slate-50"
//       case "On Hold":
//         return "text-yellow-600 bg-yellow-50"
//       default:
//         return "text-slate-600 bg-slate-50"
//     }
//   }
// const partnerInvestments = partners.map((partner) => {
//   const investments = transactions
//     .filter((t) => t.partnerId === partner.id && t.type === "Credit")
//     .reduce((sum, t) => sum + t.amount, 0);
//   const receipts = transactions
//     .filter((t) => t.partnerId === partner.id && t.type === "Debit")
//     .reduce((sum, t) => sum + t.amount, 0);
//   return {
//     name: partner.name,
//     investments,
//     receipts,
//   };
// });
// const vendorExpenses = vendors.map((vendor) => {
//   const expenses = transactions
//     .filter((t) => t.vendorId === vendor.id && t.type === "Debit")
//     .reduce((sum, t) => sum + t.amount, 0);
//   return {
//     name: vendor.name,
//     expenses,
//   };
// });

// const workerPayments = workers.map((worker) => {
//   const payments = transactions
//     .filter((t) => t.workerId === worker.id && t.type === "Debit")
//     .reduce((sum, t) => sum + t.amount, 0);
//   return {
//     name: worker.name,
//     payments,
//   };
// });
//   return (
//     <div className="space-y-6">
//       {/* Project Info */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="card p-4">
//           <h4 className="font-medium text-slate-800 mb-3">Project Information</h4>
//           <div className="space-y-2">
//             <div>
//               <span className="text-sm text-slate-600">Status:</span>
//               <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
//                 {project.status}
//               </span>
//             </div>
//             <div>
//               <span className="text-sm text-slate-600">Budget:</span>
//               <span className="ml-2 font-medium">{project.budget ? `$${project.budget.toLocaleString()}` : "N/A"}</span>
//             </div>
//             <div>
//               <span className="text-sm text-slate-600">Start Date:</span>
//               <span className="ml-2 font-medium">{project.startDate || "N/A"}</span>
//             </div>
//             {project.description && (
//               <div>
//                 <span className="text-sm text-slate-600">Description:</span>
//                 <p className="mt-1 text-sm">{project.description}</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="card p-4">
//           <h4 className="font-medium text-slate-800 mb-3">Financial Summary</h4>
//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <span className="text-sm text-slate-600">Total Income:</span>
//               <span className="font-medium text-green-600">${totalIncome.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-sm text-slate-600">Total Expenses:</span>
//               <span className="font-medium text-red-600">${totalExpenses.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between border-t pt-2">
//               <span className="text-sm font-medium text-slate-800">Net:</span>
//               <span className={`font-bold ${totalIncome - totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}>
//                 ${(totalIncome - totalExpenses).toLocaleString()}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

// <div className="card p-4">
//         <h4 className="font-medium text-slate-800 mb-3">Partner Investments</h4>
//         <PartnerInvestmentChart partnerInvestments={partnerInvestments} />
//         <div className="overflow-x-auto">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Partner</th>
//                 <th>Investments</th>
//                 <th>Receipts</th>
//               </tr>
//             </thead>
//             <tbody>
//               {partnerInvestments.map((partner) => (
//                 <tr key={partner.name}>
//                   <td>{partner.name}</td>
//                   <td>${partner.investments.toLocaleString()}</td>
//                   <td>${partner.receipts.toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Vendor Expenses */}
//       <div className="card p-4">
//         <h4 className="font-medium text-slate-800 mb-3">Vendor Expenses</h4>
//         <VendorExpenseChart vendorExpenses={vendorExpenses} />
//         <div className="overflow-x-auto">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Vendor</th>
//                 <th>Expenses</th>
//               </tr>
//             </thead>
//             <tbody>
//               {vendorExpenses.map((vendor) => (
//                 <tr key={vendor.name}>
//                   <td>{vendor.name}</td>
//                   <td>${vendor.expenses.toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Worker Payments */}
//       <div className="card p-4">
//         <h4 className="font-medium text-slate-800 mb-3">Worker Payments</h4>
//         <WorkerPaymentChart workerPayments={workerPayments} />
//         <div className="overflow-x-auto">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Worker</th>
//                 <th>Payments</th>
//               </tr>
//             </thead>
//             <tbody>
//               {workerPayments.map((worker) => (
//                 <tr key={worker.name}>
//                   <td>{worker.name}</td>
//                   <td>${worker.payments.toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Transactions */}
//       <div className="card p-4">
//         <div className="flex items-center justify-between mb-4">
//           <h4 className="font-medium text-slate-800">Related Transactions ({projectTransactions.length})</h4>
//           <button onClick={handleExportPDF} className="btn-primary flex items-center gap-2">
//             <Download size={16} />
//             Export PDF
//           </button>
//         </div>

//         {projectTransactions.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Type</th>
//                   <th>Description</th>
//                   <th>Amount</th>
//                   <th>Category</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {projectTransactions.map((transaction) => (
//                   <tr key={transaction.id}>
//                     <td>{format(new Date(transaction.date), "MMM dd, yyyy")}</td>
//                     <td>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
//                         {transaction.type}
//                       </span>
//                     </td>
//                     <td>{transaction.description}</td>
//                     <td>${transaction.amount.toLocaleString()}</td>
//                     <td>{transaction.category || "N/A"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-slate-500 text-center py-8">No transactions found for this project.</p>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ProjectDetail
