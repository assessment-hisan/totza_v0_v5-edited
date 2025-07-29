import jsPDF from "jspdf"
import "jspdf-autotable"
import { format } from "date-fns"

export const generateTransactionsPDF = (transactions, title = "Transactions Report") => {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.text(title, 20, 20)
  doc.setFontSize(12)
  doc.text(`Generated on: ${format(new Date(), "PPP")}`, 20, 30)

  // Logo placeholder
  doc.setFontSize(10)
  doc.text("[LOGO PLACEHOLDER]", 150, 20)

  // Table data
  const tableData = transactions.map((transaction) => [
    format(new Date(transaction.date), "MM/dd/yyyy"),
    transaction.type,
    transaction.description.length > 30 ? transaction.description.substring(0, 30) + "..." : transaction.description,
    `$${transaction.amount.toLocaleString()}`,
    transaction.category || "N/A",
  ])

  // Generate table
  doc.autoTable({
    head: [["Date", "Type", "Description", "Amount", "Category"]],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [15, 23, 42], // slate-900
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
  })

  // Save
  const filename = `${title.replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`
  doc.save(filename)
}

export const generateProjectDetailPDF = (project, transactions) => {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.text(`Project: ${project.name}`, 20, 20)
  doc.setFontSize(12)
  doc.text(`Generated on: ${format(new Date(), "PPP")}`, 20, 30)

  // Logo placeholder
  doc.setFontSize(10)
  doc.text("[LOGO PLACEHOLDER]", 150, 20)

  // Project details
  doc.setFontSize(12)
  doc.text(`Status: ${project.status}`, 20, 45)
  doc.text(`Budget: $${project.budget?.toLocaleString() || "N/A"}`, 20, 55)
  doc.text(`Start Date: ${project.startDate || "N/A"}`, 20, 65)

  // Transactions table
  if (transactions.length > 0) {
    const tableData = transactions.map((transaction) => [
      format(new Date(transaction.date), "MM/dd/yyyy"),
      transaction.type,
      transaction.description.length > 25 ? transaction.description.substring(0, 25) + "..." : transaction.description,
      `$${transaction.amount.toLocaleString()}`,
    ])

    doc.autoTable({
      head: [["Date", "Type", "Description", "Amount"]],
      body: tableData,
      startY: 75,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: 255,
      },
    })
  }

  const filename = `Project-${project.name.replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`
  doc.save(filename)
}

export const generateEntityTransactionsPDF = (entityName, entityType, transactions) => {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.text(`${entityType}: ${entityName}`, 20, 20)
  doc.setFontSize(12)
  doc.text(`Transactions Report - Generated on: ${format(new Date(), "PPP")}`, 20, 30)

  // Logo placeholder
  doc.setFontSize(10)
  doc.text("[LOGO PLACEHOLDER]", 150, 20)

  // Table data
  const tableData = transactions.map((transaction) => [
    format(new Date(transaction.date), "MM/dd/yyyy"),
    transaction.type,
    transaction.description.length > 30 ? transaction.description.substring(0, 30) + "..." : transaction.description,
    `$${transaction.amount.toLocaleString()}`,
  ])

  // Generate table
  doc.autoTable({
    head: [["Date", "Type", "Description", "Amount"]],
    body: tableData,
    startY: 45,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  })

  const filename = `${entityType}-${entityName.replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`
  doc.save(filename)
}
