import React from 'react'

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-logo">
          <i className="fas fa-lock"></i> JWT Authentication
        </h1>
        
        {isAuthenticated && (
          <button className="nav-logout" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar