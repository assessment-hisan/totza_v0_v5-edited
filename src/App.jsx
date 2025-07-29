import { useStore } from "./stores/useStore"
import Sidebar from "./components/Sidebar"
import MobileNav from "./components/MobileNav"
import Dashboard from "./pages/Dashboard/Dashboard"
import Transactions from "./pages/Transactions/Transactions"
import Projects from "./pages/Projects/Projects"
import Vendors from "./pages/Vendors/Vendors"
import Workers from "./pages/Workers/Workers"
import Partners from "./pages/Partners/Partners"
import Dues from "./pages/Dues/Dues"
import Settings from "./pages/Settings/Settings"

function App() {
  const { currentPage } = useStore()

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "transactions":
        return <Transactions />
      case "projects":
        return <Projects />
      case "vendors":
        return <Vendors />
      case "workers":
        return <Workers />
      case "partners":
        return <Partners />
      case "dues":
        return <Dues />
      case "settings":
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Main Content */}
      <div className="md:ml-60 lg:ml-60 pb-16 md:pb-0">
        <main className="p-4 md:p-6">{renderPage()}</main>
      </div>
    </div>
  )
}

export default App
