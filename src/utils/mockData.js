import { v4 as uuidv4 } from "uuid"
import { subDays, format, addDays } from "date-fns"

const generateId = () => uuidv4()
const safeName = (arr, idx, key = 'name') => arr?.[idx]?.[key] || 'N/A'
// Enhanced Partners with more realistic data
const partners = [
  {
    id: generateId(),
    name: "John Smith",
    type: "Individual Partner",
    contactPerson: "John Smith",
    email: "john.smith@business.com",
    phone: "+91-98765-43210",
    investmentAmount: 500000,
    partnershipDate: "2023-06-15",
    address: "123 Business District, Mumbai, MH 400001"
  },
  
  {
    id: generateId(),
    name: "Jafar ms",
    type: "Financial Partner",
    contactPerson: "jafar ms",
    email: "jafar@gmail.com",
    phone: "+91-98765-43212",
    investmentAmount: 750000,
    partnershipDate: "2023-09-10",
    address: "789 Finance Street, Delhi, DL 110001"
  },
]

// Enhanced Projects with more details
const projects = [
  { 
    id: generateId(), 
    name: "Residential Complex A", 
    status: "Active", 
    budget: 5000000, 
    startDate: "2024-01-15",
    description: "50-unit residential complex construction",
    client: "Housing Development Board",
    location: "Sector 21, Gurgaon"
  },
  { 
    id: generateId(), 
    name: "Commercial Mall Project", 
    status: "Active", 
    budget: 8500000, 
    startDate: "2024-02-01",
    description: "3-story commercial shopping mall",
    client: "Retail Development Corp",
    location: "MG Road, Bangalore"
  },
  { 
    id: generateId(), 
    name: "Highway Bridge Construction", 
    status: "Planning", 
    budget: 12000000, 
    startDate: "2024-03-01",
    description: "2km highway overbridge construction",
    client: "State Highway Authority",
    location: "NH-8, Rajasthan"
  },
  { 
    id: generateId(), 
    name: "Industrial Warehouse", 
    status: "Completed", 
    budget: 3500000, 
    startDate: "2023-12-01",
    description: "Large-scale industrial storage facility",
    client: "Logistics Solutions Ltd",
    location: "Industrial Park, Pune"
  },
]

// Enhanced Vendors with construction-specific categories
const vendors = [
  {
    id: generateId(),
    name: "Steel Suppliers India Ltd",
    companyName: "Steel Suppliers India Ltd",
    email: "orders@steelsuppliers.com",
    phone: "+91-11-2345-6789",
    category: "Raw Materials",
    address: "Steel Market, Sector 5, Industrial Area, Delhi",
    taxId: "07AABCS1234F1Z5",
    speciality: "TMT Bars, Steel Beams, Reinforcement Steel"
  },
  {
    id: generateId(),
    name: "Cement & Aggregates Co",
    companyName: "Cement & Aggregates Co",
    email: "sales@cementco.com",
    phone: "+91-22-3456-7890",
    category: "Building Materials",
    address: "Cement Nagar, Thane, Mumbai, MH 400601",
    taxId: "27AABCC5678G2Z1",
    speciality: "Portland Cement, Sand, Gravel, Concrete Mix"
  },
  {
    id: generateId(),
    name: "Modern Equipment Rentals",
    companyName: "Modern Equipment Rentals",
    email: "rentals@modernequip.com",
    phone: "+91-80-4567-8901",
    category: "Equipment Rental",
    address: "Equipment Hub, Whitefield, Bangalore, KA 560066",
    taxId: "29AABCE9012H3Z7",
    speciality: "Cranes, Excavators, Concrete Mixers, Generators"
  },
  {
    id: generateId(),
    name: "Labor Contractors Union",
    companyName: "Labor Contractors Union",
    email: "contracts@laborunion.com",
    phone: "+91-33-5678-9012",
    category: "Labor Services",
    address: "Labor Colony, Salt Lake, Kolkata, WB 700091",
    taxId: "19AABCL3456I4Z2",
    speciality: "Skilled Workers, Masons, Electricians, Plumbers"
  },
  {
    id: generateId(),
    name: "Transport & Logistics Hub",
    companyName: "Transport & Logistics Hub",
    email: "bookings@transporthub.com",
    phone: "+91-44-6789-0123",
    category: "Transportation",
    address: "Transport Nagar, Guindy, Chennai, TN 600032",
    taxId: "33AABCT7890J5Z8",
    speciality: "Heavy Vehicle Transport, Material Delivery, Site Logistics"
  },
  {
    id: generateId(),
    name: "Quality Testing Services",
    companyName: "Quality Testing Services",
    email: "tests@qualitytest.com",
    phone: "+91-20-7890-1234",
    category: "Testing & Quality",
    address: "Testing Complex, Hinjewadi, Pune, MH 411057",
    taxId: "27AABCQ1234K6Z3",
    speciality: "Concrete Testing, Soil Testing, Material Quality Assurance"
  },
]

// Enhanced Workers with construction roles
const workers = [
  { 
    id: generateId(), 
    name: "Ramesh Kumar", 
    role: "Site Engineer", 
    email: "ramesh@company.com", 
    dailyRate: 1500,
    department: "Engineering",
    joinDate: "2023-01-15",
    speciality: "Structural Engineering, Site Supervision"
  },
  { 
    id: generateId(), 
    name: "Priya Sharma", 
    role: "Project Manager", 
    email: "priya@company.com", 
    dailyRate: 2000,
    department: "Management",
    joinDate: "2022-11-10",
    speciality: "Project Planning, Resource Management"
  },
  { 
    id: generateId(), 
    name: "Mohammed Ali", 
    role: "Senior Mason", 
    email: "mohammed@company.com", 
    dailyRate: 800,
    department: "Construction",
    joinDate: "2023-03-20",
    speciality: "Brick Work, Plastering, Finishing"
  },
  { 
    id: generateId(), 
    name: "Sunita Devi", 
    role: "Safety Inspector", 
    email: "sunita@company.com", 
    dailyRate: 1200,
    department: "Safety & Quality",
    joinDate: "2023-05-12",
    speciality: "Safety Compliance, Quality Control"
  },
  { 
    id: generateId(), 
    name: "Vijay Singh", 
    role: "Equipment Operator", 
    email: "vijay@company.com", 
    dailyRate: 1000,
    department: "Operations",
    joinDate: "2023-02-28",
    speciality: "Crane Operation, Heavy Machinery"
  },
]

// Account categories for construction business
const accountCategories = [
  { id: generateId(), name: "Raw Materials", type: "Expense", description: "Steel, cement, sand, aggregates" },
  { id: generateId(), name: "Equipment Rental", type: "Expense", description: "Construction equipment and machinery rental" },
  { id: generateId(), name: "Labor Costs", type: "Expense", description: "Worker wages and contractor payments" },
  { id: generateId(), name: "Project Revenue", type: "Income", description: "Client payments and project income" },
  { id: generateId(), name: "Transportation", type: "Expense", description: "Material transport and logistics" },
  { id: generateId(), name: "Utilities & Overhead", type: "Expense", description: "Site utilities, office expenses" },
  { id: generateId(), name: "Professional Services", type: "Expense", description: "Engineering, legal, consulting services" },
  { id: generateId(), name: "Equipment Purchase", type: "Asset", description: "Owned construction equipment and tools" },
]

// Users in the system
const users = [
  { 
    id: generateId(), 
    name: "Admin User", 
    email: "admin@construction.com", 
    role: "Administrator",
    department: "Management"
  },
  { 
    id: generateId(), 
    name: "Finance Manager", 
    email: "finance@construction.com", 
    role: "Finance",
    department: "Finance"
  },
  { 
    id: generateId(), 
    name: "Site Supervisor", 
    email: "supervisor@construction.com", 
    role: "Operations",
    department: "Site Operations"
  },
]

// Enhanced transactions with proper entity flow
// const transactions = [
//   // Partner pays for materials to vendor for specific project
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
//     type: "Debit",
//     amount: 250000,
//     account: { name: "Partner Contribution Account" },
//     entities: `${partners[0].name} → ${projects[0].name} → ${vendors[0].companyName}`,
//     description: `${partners[0].name} paid for TMT steel bars and reinforcement materials for ${projects[0].name} construction to steel supplier`,
//     category: accountCategories[0].name,
//     partnerId: partners[0].id,
//     projectId: projects[0].id,
//     vendorId: vendors[0].id,
//     addedBy: { name: users[2].name },
//     purpose: "Raw materials purchase - Steel",
//     reference: "MAT-2024-001",
//     status: "Completed"
//   },
  
//   // Client advance payment to company for project
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 2), "yyyy-MM-dd"),
//     type: "Credit",
//     amount: 1500000,
//     account: { name: "Company Bank Account" },
//     entities: `${projects[1].client} → Company Bank Account → ${projects[1].name}`,
//     description: `Advance payment received from ${projects[1].client} for ${projects[1].name} - 20% of total project value`,
//     category: accountCategories[3].name,
//     projectId: projects[1].id,
//     addedBy: { name: users[1].name },
//     purpose: "Project advance payment",
//     reference: "ADV-2024-012",
//     status: "Completed"
//   },

//   // Company pays cement vendor for project materials
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 3), "yyyy-MM-dd"),
//     type: "Debit",
//     amount: 180000,
//     account: { name: "Company Bank Account" },
//     entities: `Company → ${projects[0].name} → ${vendors[1].companyName}`,
//     description: `Payment for cement and concrete mix supplies for foundation work in ${projects[0].name}`,
//     category: accountCategories[0].name,
//     projectId: projects[0].id,
//     vendorId: vendors[1].id,
//     addedBy: { name: users[0].name },
//     purpose: "Building materials - Cement",
//     reference: "CEM-2024-005",
//     status: "Completed"
//   },

//   // Equipment rental payment
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 4), "yyyy-MM-dd"),
//     type: "Debit",
//     amount: 75000,
//     account: { name: "Petty Cash" },
//     entities: `Company → ${projects[1].name} → ${vendors[2].companyName}`,
//     description: `Monthly rental for crane and excavator equipment at ${projects[1].name} construction site`,
//     category: accountCategories[1].name,
//     projectId: projects[1].id,
//     vendorId: vendors[2].id,
//     addedBy: { name: users[2].name },
//     purpose: "Equipment rental - Heavy machinery",
//     reference: "EQP-2024-008",
//     status: "Completed"
//   },

//   // Partner investment in company
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 5), "yyyy-MM-dd"),
//     type: "Credit",
//     amount: 500000,
//     account: { name: "Partner Capital Account" },
//     entities: `${partners[1].name} → Company Capital → Business Operations`,
//     description: `Additional capital investment by ${partners[1].name} for business expansion and new project funding`,
//     category: "Capital Investment",
//     partnerId: partners[1].id,
//     addedBy: { name: users[1].name },
//     purpose: "Capital contribution",
//     reference: "CAP-2024-003",
//     status: "Completed"
//   },

//   // Labor contractor payment
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 6), "yyyy-MM-dd"),
//     type: "Debit",
//     amount: 120000,
//     account: { name: "Company Bank Account" },
//     entities: `Company → ${projects[0].name} → ${vendors[3].companyName}`,
//     description: `Weekly wages for skilled masons, electricians and plumbers working on ${projects[0].name}`,
//     category: accountCategories[2].name,
//     projectId: projects[0].id,
//     vendorId: vendors[3].id,
//     addedBy: { name: users[2].name },
//     purpose: "Labor costs - Skilled workers",
//     reference: "LAB-2024-015",
//     status: "Completed"
//   },

//   // Transportation costs
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 7), "yyyy-MM-dd"),
//     type: "Debit",
//     amount: 45000,
//     account: { name: "Operations Account" },
//     entities: `Company → ${projects[1].name} → ${vendors[4].companyName}`,
//     description: `Heavy vehicle transportation charges for delivering construction materials to ${projects[1].name} site`,
//     category: accountCategories[4].name,
//     projectId: projects[1].id,
//     vendorId: vendors[4].id,
//     addedBy: { name: users[0].name },
//     purpose: "Material transportation",
//     reference: "TRP-2024-022",
//     status: "Completed"
//   },

 
//   // Worker advance payment
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 9), "yyyy-MM-dd"),
//     type: "Debit",
//     amount: 25000,
//     account: { name: "Staff Advance Account" },
//     entities: `Company → ${workers[0].name} (Advance) → ${projects[0].name}`,
//     description: `Salary advance given to ${workers[0].name} (${workers[0].role}) working on ${projects[0].name}`,
//     category: accountCategories[2].name,
//     workerId: workers[0].id,
//     projectId: projects[0].id,
//     addedBy: { name: users[1].name },
//     purpose: "Employee advance",
//     reference: "ADV-EMP-2024-003",
//     status: "Completed"
//   },

//   // Project milestone payment received
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 10), "yyyy-MM-dd"),
//     type: "Credit",
//     amount: 800000,
//     account: { name: "Company Bank Account" },
//     entities: `${projects[3].client} → Company Revenue → ${projects[3].name}`,
//     description: `Final milestone payment for completed ${projects[3].name} - structural work completion`,
//     category: accountCategories[3].name,
//     projectId: projects[3].id,
//     addedBy: { name: users[1].name },
//     purpose: "Project milestone completion",
//     reference: "MIL-2024-018",
//     status: "Completed"
//   },

//   // Partner loan for project
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 12), "yyyy-MM-dd"),
//     type: "Loan",
//     amount: 300000,
//     account: { name: "Partner Loan Account" },
//     entities: `${partners[2].name} → Company Loan Account → ${projects[2].name}`,
//     description: `Short-term loan from ${partners[2].name} for working capital requirements of ${projects[2].name}`,
//     category: "Partner Loan",
//     partnerId: partners[2].id,
//     projectId: projects[2].id,
//     addedBy: { name: users[1].name },
//     purpose: "Working capital loan",
//     reference: "LOAN-2024-004",
//     status: "Active",
//     interestRate: 8.5,
//     termMonths: 12,
//   },

//   // Equipment purchase
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 15), "yyyy-MM-dd"),
//     type: "Debit",
//     amount: 450000,
//     account: { name: "Company Bank Account" },
//     entities: `Company → Equipment Asset → ${vendors[2].companyName}`,
//     description: `Purchase of new concrete mixer and small construction equipment for multiple projects`,
//     category: accountCategories[7].name,
//     vendorId: vendors[2].id,
//     addedBy: { name: users[0].name },
//     purpose: "Equipment purchase",
//     reference: "EQP-BUY-2024-001",
//     status: "Completed"
//   },

//   // Subcontractor payment for specialized work
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 18), "yyyy-MM-dd"),
//     type: "Debit",
//     amount: 95000,
//     account: { name: "Company Bank Account" },
//     entities: `Company → ${projects[1].name} → Electrical Subcontractor`,
//     description: `Payment to electrical subcontractor for complete wiring and electrical installations in ${projects[1].name}`,
//     category: accountCategories[6].name,
//     projectId: projects[1].id,
//     addedBy: { name: users[2].name },
//     purpose: "Subcontractor services - Electrical",
//     reference: "SUB-2024-011",
//     status: "Completed"
//   },

//   // Utility payments for site
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 20), "yyyy-MM-dd"),
//     type: "Debit",
//     amount: 18000,
//     account: { name: "Utilities Account" },
//     entities: `Company → ${projects[0].name} → Site Utilities (Electricity/Water)`,
//     description: `Monthly electricity and water charges for construction site facilities at ${projects[0].name}`,
//     category: accountCategories[5].name,
//     projectId: projects[0].id,
//     addedBy: { name: users[0].name },
//     purpose: "Site utilities",
//     reference: "UTL-2024-007",
//     status: "Completed"
//   },

//   // Material return credit from vendor
//   {
//     id: generateId(),
//     date: format(subDays(new Date(), 22), "yyyy-MM-dd"),
//     type: "Credit",
//     amount: 12000,
//     account: { name: "Company Bank Account" },
//     entities: `${vendors[0].companyName} → Material Return Credit → ${projects[0].name}`,
//     description: `Credit received for returned excess steel materials from ${projects[0].name} to ${vendors[0].companyName}`,
//     category: accountCategories[0].name,
//     projectId: projects[0].id,
//     vendorId: vendors[0].id,
//     addedBy: { name: users[2].name },
//     purpose: "Material return credit",
//     reference: "RET-2024-003",
//     status: "Completed"
//   },
// ]

const transactions = []
export const mockData = {
  transactions,
  projects,
  vendors,
  workers,
  partners,
  accountCategories,
  users,
}

// Helper functions
export const getTransactionsByProject = (projectId) => {
  return transactions.filter(transaction => transaction.projectId === projectId)
}

export const getTransactionsByPartner = (partnerId) => {
  return transactions.filter(transaction => transaction.partnerId === partnerId)
}

export const getTransactionsByVendor = (vendorId) => {
  return transactions.filter(transaction => transaction.vendorId === vendorId)
}

export const getProjectTransactionSummary = (projectId) => {
  const projectTransactions = getTransactionsByProject(projectId)
  return projectTransactions.reduce((summary, transaction) => {
    const amount = Number(transaction.amount) || 0
    
    switch (transaction.type) {
      case 'Credit':
        summary.totalIncome += amount
        break
      case 'Debit':
        summary.totalExpense += amount
        break
      case 'Due':
        summary.totalDue += amount
        break
      case 'Loan':
        summary.totalLoan += amount
        break
    }
    
    return summary
  }, {
    totalIncome: 0,
    totalExpense: 0,
    totalDue: 0,
    totalLoan: 0,
    netBalance: 0
  })
}

export const getEntityFlowTransactions = () => {
  return transactions.map(txn => ({
    ...txn,
    entityFlow: txn.entities,
    flowParts: txn.entities.split(' → ').map(part => part.trim())
  }))
}