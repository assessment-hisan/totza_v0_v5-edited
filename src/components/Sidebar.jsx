"use client"
import { useStore } from "../stores/useStore"
import { LayoutDashboard, Receipt, FolderOpen, Users, Wrench, HeartHandshake, Clock, Settings } from "lucide-react"

const Sidebar = () => {
  const { currentPage, setCurrentPage } = useStore()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "vendors", label: "Vendors", icon: Users },
    { id: "workers", label: "Workers", icon: Wrench },
    { id: "partners", label: "Partners", icon: HeartHandshake },
    { id: "dues", label: "Dues", icon: Clock },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-60 bg-white border-r border-slate-200 shadow-sm">
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
      </div>

      <nav className="px-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
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
  )
}

export default Sidebar
