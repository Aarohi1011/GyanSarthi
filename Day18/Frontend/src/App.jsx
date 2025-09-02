import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import Header from './components/Header'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Board from './components/Board'
import { AuthProvider, useAuth } from './Contexts/AuthContext'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io('http://localhost:5000')
    setSocket(newSocket)

    return () => newSocket.close()
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle('dark-mode')
  }

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <AuthProvider>
        <Router>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard socket={socket} />
                </ProtectedRoute>
              } />
              <Route path="/board/:id" element={
                <ProtectedRoute>
                  <Board socket={socket} />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </div>
  )
}

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default App