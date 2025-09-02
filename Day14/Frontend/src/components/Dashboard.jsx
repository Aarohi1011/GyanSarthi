import React, { useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const Dashboard = ({ user, onLogout }) => {
  const [profile, setProfile] = useState(user)
  const [apiResponse, setApiResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If user data not passed as prop, try to get it from localStorage
    if (!user) {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setProfile(JSON.parse(savedUser))
      }
    }
  }, [user])

  const testProtectedRoute = async () => {
    setLoading(true)
    try {
      const response = await authAPI.getProfile()
      setApiResponse(response.data)
    } catch (err) {
      setApiResponse({ error: err.response?.data?.message || 'Request failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <div className="welcome">
        <h2>Welcome, {profile?.username}!</h2>
        <p>You have successfully logged in with JWT authentication.</p>
      </div>
      
      <div className="user-info">
        <h3>User Information</h3>
        <p>Email: <span>{profile?.email}</span></p>
        <p>Username: <span>{profile?.username}</span></p>
        <p>User ID: <span>{profile?.id}</span></p>
      </div>
      
      <div className="token-info">
        <p><strong>JWT Token:</strong></p>
        <p className="jwt-token">{localStorage.getItem('jwtToken')}</p>
        <p className="jwt-info">
          This token is stored in localStorage and sent with API requests to authenticate you.
        </p>
      </div>
      
      <div className="actions">
        <button 
          className="btn-test" 
          onClick={testProtectedRoute}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test Protected Route'}
        </button>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
      
      {apiResponse && (
        <div className="api-response">
          <h4>API Response:</h4>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default Dashboard