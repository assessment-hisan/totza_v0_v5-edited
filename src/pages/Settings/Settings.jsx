import React, { useRef } from "react" // Import useRef for file input
import { useStore } from "../../stores/useStore"

const Settings = () => {
  const { accountCategories, partners, vendors, projects, users, restoreData, exportData } = useStore()
  const fileInputRef = useRef(null) // Ref for the hidden file input

  const handleRestoreClick = () => {
    fileInputRef.current.click() // Programmatically click the hidden file input
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          restoreData(importedData) // Use the restoreData action from the store
          alert("Data restored successfully!")
        } catch (error) {
          alert("Failed to restore data. Invalid file format.")
          console.error("Error restoring data:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleExportClick = () => {
    const data = exportData(); // Get the data to export
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("Data exported successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
      </div>

      {/* Section: System Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">System Summary</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-slate-700 text-sm">
          <li>• <strong>{users.length}</strong> user(s) configured</li>
          <li>• <strong>{partners.length}</strong> partner(s)</li>
          <li>• <strong>{projects.length}</strong> project(s)</li>
          <li>• <strong>{vendors.length}</strong> vendor(s)</li>
          <li>• <strong>{accountCategories.length}</strong> account category(ies)</li>
        </ul>
      </div>

      {/* Section: Data Management */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Data Management</h3>
        <div className="flex space-x-4">
          <button
            onClick={handleExportClick}
            className="btn btn-primary" // Assuming you have a 'btn' and 'btn-primary' class for styling
          >
            Export Data
          </button>
          <button
            onClick={handleRestoreClick}
            className="btn btn-secondary" // Assuming you have a 'btn-secondary' class
          >
            Restore Data
          </button>
          {/* Hidden file input for file selection */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json" // Specify accepted file types
            style={{ display: 'none' }}
          />
        </div>
        <p className="text-slate-600 mt-4 text-sm">
          Export your current application data as a JSON file, or restore data from a previously exported file.
          <br />
          <span className="text-red-500">Warning: Restoring data will overwrite existing data.</span>
        </p>
      </div>

      {/* Section: Application Settings (formerly Coming Soon) */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Application Settings</h3>
        <p className="text-slate-600">This section allows you to configure various aspects of the application:</p>

        <ul className="mt-4 space-y-2 text-slate-600 list-disc pl-5">
          <li>User management and permissions</li>
          <li>Account category configuration</li>
          <li>PDF export template setup</li>
          <li>Email and notification preferences</li>
          <li>Third-party system integrations</li>
        </ul>

        {/* You would add more UI elements here for each setting category, e.g.: */}
        {/* <div className="mt-6">
          <h4 className="font-semibold text-slate-700 mb-2">Account Categories</h4>
          <p>Manage your custom account categories here.</p>
          <button className="btn btn-tertiary mt-2">Manage Categories</button>
        </div>
        <div className="mt-6">
          <h4 className="font-semibold text-slate-700 mb-2">User Management</h4>
          <p>Add, edit, or remove users and assign permissions.</p>
          <button className="btn btn-tertiary mt-2">Manage Users</button>
        </div> */}
      </div>
    </div>
  )
}

export default Settings