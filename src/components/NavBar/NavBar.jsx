import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MixEdContext from '../../context/MixEdContext';
import TokenService from '../../services/token-service';
import './NavBar.css';

class NavBar extends Component {

  handleLogoutClick = () => {
    console.log('logging you out');
    const { toggleLogin, removePrevData } = this.context;
    removePrevData();
    toggleLogin();
    TokenService.clearAuthToken();
  }

  renderLoggedInLinks() {
    return (
      <nav className="nav-bar">
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
    )
  }

  renderNotLoggedInLinks() {
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
      </nav>
    )
  }

  render() {
    const { login } = this.props;
    // console.log(login);
    return (
      <>
      { login === true
      ? this.renderLoggedInLinks()
      : this.renderNotLoggedInLinks() }
      </>
    );
  }
}

export default NavBar;

NavBar.defaultProps = {
  login: false,
};

NavBar.contextType = MixEdContext;
