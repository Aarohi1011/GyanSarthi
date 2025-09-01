import { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { io } from 'socket.io-client'
import Header from './components/Header'
import Login from './components/Login'
import Register from './components/Register'
import Board from './components/Board'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      })
      setSocket(newSocket)

      return () => newSocket.close()
    }
  }, [user])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!user) {
    return (
      <div className="app">
        <Header />
        <div className="auth-container">
          <div className="auth-hero">
            <h1>TaskFlow</h1>
            <p>Organize your work and collaborate with your team</p>
            <div className="auth-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </div>
          </div>
        </div>

        {showLogin && (
          <Login 
            onClose={() => setShowLogin(false)}
            onSwitchToRegister={() => {
              setShowLogin(false)
              setShowRegister(true)
            }}
          />
        )}

        {showRegister && (
          <Register 
            onClose={() => setShowRegister(false)}
            onSwitchToLogin={() => {
              setShowRegister(false)
              setShowLogin(true)
            }}
          />
        )}
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <Header />
        <Board socket={socket} />
      </div>
    </DndProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App