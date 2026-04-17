import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AdminAuthProvider } from './admin/AdminAuthContext.jsx'
import { EmployeeAuthProvider } from './employee/EmployeeAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthProvider>
      <EmployeeAuthProvider>
        <App />
      </EmployeeAuthProvider>
    </AdminAuthProvider>
  </StrictMode>,
)
