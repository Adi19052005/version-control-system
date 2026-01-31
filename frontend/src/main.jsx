import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Routes from './Routes.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './AuthContext.jsx'
createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Router>
      <Routes />
    </Router>
  </AuthProvider>,
)
