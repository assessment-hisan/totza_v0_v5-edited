"use client"

import { useState } from "react"
import { useStore } from "../stores/useStore"
import { LayoutDashboard, Receipt, FolderOpen, Users, Menu, X } from "lucide-react"

const MobileNav = () => {
  const { currentPage, setCurrentPage } = useStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const bottomNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "vendors", label: "Vendors", icon: Users },
    { id: "menu", label: "Menu", icon: Menu, action: () => setIsMenuOpen(true) },
  ]

  const allMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "vendors", label: "Vendors", icon: Users },
    { id: "workers", label: "Workers", icon: Users },
    { id: "partners", label: "Partners", icon: Users },
    { id: "dues", label: "Dues", icon: Receipt },
    { id: "settings", label: "Settings", icon: Users },
  ]

  return (
    <>
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 px-4 py-3 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800">Admin Dashboard</h1>
          <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-lg hover:bg-slate-100">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 z-40">
        <div className="flex justify-around">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action()
                  } else {
                    setCurrentPage(item.id)
                  }
                }}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? "text-sky-600 bg-sky-50" : "text-slate-600"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Full Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
            </div>

            <nav className="p-4">
              {allMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id)
                      setIsMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-1 ${
                      currentPage === item.id
                        ? "bg-sky-50 text-sky-700 border border-sky-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Content padding for mobile */}
      <div className="pt-16 pb-20">{/* This ensures content doesn't get hidden behind fixed headers */}</div>
    </>
  )
}

export default MobileNav
