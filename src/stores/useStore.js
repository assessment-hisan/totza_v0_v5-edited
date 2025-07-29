// src/stores/useStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mockData } from "../utils/mockData"

export const useStore = create(
  persist((set, get) => ({
    /* ---------- NAV ---------- */
    currentPage: "dashboard",
    setCurrentPage: (page) => set({ currentPage: page }),

    /* ---------- INITIAL DATA ---------- */
    ...mockData,

    /* ---------- TRANSACTIONS ---------- */
    addTransaction: (txn) =>
      set((state) => ({
       transactions: [{ ...txn, id: txn.id || crypto.randomUUID(), date: txn.date || new Date().toISOString() }, ...state.transactions],
      })),

    updateTransaction: (id, updates) =>
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      })),

    deleteTransaction: (id) =>
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      })),

    addPaymentToDue: (dueId, payment) =>
      set((state) => {
        const due = state.transactions.find((t) => t.id === dueId)
        if (!due) return state
        const updatedPayments = [
          ...(due.payments || []),
          { id: crypto.randomUUID(), ...payment },
        ]
        return {
          transactions: state.transactions.map((t) =>
            t.id === dueId ? { ...t, payments: updatedPayments } : t
          ),
        }
      }),

    /* ---------- PROJECTS ---------- */
    addProject: (project) =>
      set((state) => ({
        projects: [...state.projects, { ...project, id: project.id || crypto.randomUUID() }],
      })),

    updateProject: (id, updates) =>
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      })),

    deleteProject: (id) =>
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      })),

    /* ---------- VENDORS ---------- */
    addVendor: (vendor) =>
      set((state) => ({
        vendors: [...state.vendors, { ...vendor, id: vendor.id || crypto.randomUUID() }],
      })),

    updateVendor: (id, updates) =>
      set((state) => ({
        vendors: state.vendors.map((v) =>
          v.id === id ? { ...v, ...updates } : v
        ),
      })),

    deleteVendor: (id) =>
      set((state) => ({
        vendors: state.vendors.filter((v) => v.id !== id),
      })),

    /* ---------- WORKERS ---------- */
    addWorker: (worker) =>
      set((state) => ({
        workers: [...state.workers, { ...worker, id: worker.id || crypto.randomUUID() }],
      })),

    updateWorker: (id, updates) =>
      set((state) => ({
        workers: state.workers.map((w) =>
          w.id === id ? { ...w, ...updates } : w
        ),
      })),

    deleteWorker: (id) =>
      set((state) => ({
        workers: state.workers.filter((w) => w.id !== id),
      })),

    /* ---------- PARTNERS ---------- */
    addPartner: (partner) =>
      set((state) => ({
        partners: [...state.partners, { ...partner, id: partner.id || crypto.randomUUID() }],
      })),

    updatePartner: (id, updates) =>
      set((state) => ({
        partners: state.partners.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      })),

    deletePartner: (id) =>
      set((state) => ({
        partners: state.partners.filter((p) => p.id !== id),
      })),

    /* ---------- DUE HELPERS ---------- */
    getDueRemainingAmount: (due) => {
      const paid = due.payments?.reduce((s, p) => s + p.amount, 0) || 0
      return (due.originalDueAmount || 0) - paid
    },
    getDuePaidAmount: (due) =>
      due.payments?.reduce((s, p) => s + p.amount, 0) || 0,
    getDueStatus: (due) => {
      const paid = get().getDuePaidAmount(due)
      const remaining = get().getDueRemainingAmount(due)
      if (paid === 0) return "Pending"
      if (remaining === 0) return "Fully Paid"
      return "Partially Paid"
    },
  }),
  { name: "admin-dashboard" })
)