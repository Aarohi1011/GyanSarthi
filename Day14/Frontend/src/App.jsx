import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [showLogin, setShowLogin] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('jwtToken')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsAuthenticated(true)
      setCurrentUser(JSON.parse(userData))
    }
  }, [])

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true)
    setCurrentUser(user)
    setMessage('Login successful!')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleRegisterSuccess = (msg) => {
    setMessage(msg || 'Registration successful! Please login.')
    setTimeout(() => setMessage(''), 5000)
    setShowLogin(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setCurrentUser(null)
    setMessage('You have been logged out')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="App">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
      />
      
      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'info'}`}>
          {message}
        </div>
      )}
      
      <div className="main-content">
        {isAuthenticated ? (
          <Dashboard user={currentUser} onLogout={handleLogout} />
        ) : showLogin ? (
          <Login 
            onSwitchToRegister={() => setShowLogin(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <Register 
            onSwitchToLogin={() => setShowLogin(true)}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
      </div>
    </div>
  )
}

export default App