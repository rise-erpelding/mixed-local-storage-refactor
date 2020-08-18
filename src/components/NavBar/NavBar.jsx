import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MixEdContext from '../../context/MixEdContext';
import TokenService from '../../services/token-service';
import './NavBar.css';

class NavBar extends Component {
  handleLogoutClick = () => {
    console.log('logging you out');
    // const { toggleLogin } = this.context;
    // toggleLogin();
    TokenService.clearAuthToken();
  }

  render() {
    return (
      <nav className="nav-bar">
        <NavLink 
          activeClassName="selected"
          to="/login"
        >
          Login
        </NavLink>
        <NavLink 
          activeClassName="selected"
          to="/make-groups"
        >
          Generate Groups
        </NavLink>
        <NavLink 
          activeClassName="selected"
          to="/my-groups"
        >
          My Classes
        </NavLink>
        <Link 
          to="/"
          onClick={this.handleLogoutClick}
        >
          Logout
        </Link>
      </nav>
    );
  }
}

export default NavBar;

NavBar.contextType = MixEdContext;
