import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="nav-bar">
      <NavLink 
        activeClassName="selected"
        to="/"
      >
        Login
      </NavLink>
      <NavLink 
        activeClassName="selected"
        to="/"
      >
        Generate Groups
      </NavLink>
      <NavLink 
        activeClassName="selected"
        to="/"
      >
        My Classes
      </NavLink>
      <Link 
        to="/"
        onClick={handleLogoutClick}
      >
        Logout
      </Link>
    </nav>
  );
}

export default NavBar;

const handleLogoutClick = () => {
  console.log('logging you out');
}