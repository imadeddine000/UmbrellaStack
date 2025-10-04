import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router,Routes,Route, Link} from 'react-router'
import Dashboard from './pages/Dashboard'
import VMPage from './pages/VMPage'
import VPCPage from './pages/VPCPage'
import SubnetPage from './pages/SubnetPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <span className="navbar-brand">Cloud Platform</span>
            <div className="navbar-nav">
            <Link to={'/vms'}>vms</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vms" element={<VMPage />} />
          <Route path="/vpcs" element={<VPCPage />} />
          <Route path="/subnets" element={<SubnetPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
