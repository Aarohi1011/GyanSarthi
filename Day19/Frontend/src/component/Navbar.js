import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/feed" className="navbar-brand">SocialConnect</Link>
        
        {user ? (
          <div className="navbar-menu">
            <Link to="/feed" className="navbar-item">Feed</Link>
            <Link to={`/profile/${user.id}`} className="navbar-item">Profile</Link>
            <button onClick={logout} className="navbar-item logout">Logout</button>
          </div>
        ) : (
          <div className="navbar-menu">
            <Link to="/login" className="navbar-item">Login</Link>
            <Link to="/register" className="navbar-item">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;