export const getTypeColor = (type) => {
  switch (type) {
    case "Credit":
      return "text-green-600 bg-green-50";
    case "Debit":
      return "text-red-600 bg-red-50";
    case "Due":
      return "text-yellow-600 bg-yellow-50";
    case "Loan":
      return "text-blue-600 bg-blue-50";
    default:
      return "text-slate-600 bg-slate-50";
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "text-green-600 bg-green-50";
    case "Planning":
      return "text-blue-600 bg-blue-50";
    case "Completed":
      return "text-slate-600 bg-slate-50";
    case "On Hold":
      return "text-yellow-600 bg-yellow-50";
    default:
      return "text-slate-600 bg-slate-50";
  }
};

export const calculateSummaries = (transactions) => {
  const income = transactions
    .filter(t => t.type === "Credit")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => ["Debit", "Due"].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);
  
  return { income, expenses, net: income - expenses };
};

export const buildPartnerData = (partners, transactions, projectId) => {
  // Filter transactions for this specific project
  const projectTransactions = transactions.filter(t => t.linkedProject === projectId);
  
  return partners.map((partner) => {
    // Partner investments: Credit transactions linked to this partner and project
    const investments = projectTransactions
      .filter(t => t.linkedPartner === partner.id && t.type === "Debit")
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Partner receipts: Debit transactions linked to this partner and project
    const receipts = projectTransactions
      .filter(t => t.linkedPartner === partner.id && t.type === "Credit")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: partner.name,
      investments,
      receipts,
    };
  }).filter(partner => partner.investments > 0 || partner.receipts > 0); // Only include partners with data
};

export const buildVendorData = (vendors, transactions, projectId) => {
  // Filter transactions for this specific project
  const projectTransactions = transactions.filter(t => t.linkedProject === projectId);
  
  return vendors.map((vendor) => {
    // Vendor expenses: Debit transactions linked to this vendor and project
    const expenses = projectTransactions
      .filter(t => t.linkedVendor === vendor.id && t.type === "Debit")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: vendor.name,
      expenses,
    };
  }).filter(vendor => vendor.expenses > 0); // Only include vendors with expenses
};

export const buildWorkerData = (workers, transactions, projectId) => {
  // Filter transactions for this specific project
  const projectTransactions = transactions.filter(t => t.linkedProject === projectId);
  
  return workers.map((worker) => {
    // Worker payments: Debit transactions linked to this worker and project
    const payments = projectTransactions
      .filter(t => t.linkedWorker === worker.id && t.type === "Debit")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: worker.name,
      payments,
    };
  }).filter(worker => worker.payments > 0); // Only include workers with payments
};