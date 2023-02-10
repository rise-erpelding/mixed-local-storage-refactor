import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import MixEdContext from '../../context/MixEdContext';
// import TokenService from '../../services/token-service';
import propTypes from 'prop-types';
import './NavBar.css';

class NavBar extends Component {
  // handleLogoutClick = () => {
  //   const { toggleLogin, clearDataInLocalStorage } = this.context;
  //   clearDataInLocalStorage();
  //   toggleLogin();
  //   TokenService.clearAuthToken();
  // }

  renderLoggedInLinks() {
    return (
      <nav className="nav-bar">
        <NavLink to="/">Home</NavLink>
        <NavLink activeClassName="nav-bar__selected" to="/make-groups">
          Generate Groups
        </NavLink>
        <NavLink activeClassName="nav-bar__selected" to="/my-groups">
          My Classes
        </NavLink>
        {/* <Link 
          to="/"
          onClick={this.handleLogoutClick}
        >
          Logout
        </Link> */}
      </nav>
    );
  }

  // renderNotLoggedInLinks() {
  //   return (
  //     <nav className="nav-bar">
  //       <NavLink
  //         activeClassName="selected"
  //         to="/"
  //       >
  //         Home
  //       </NavLink>
  //       <NavLink
  //         activeClassName="selected"
  //         to="/make-groups"
  //       >
  //         Generate Groups
  //       </NavLink>
  //       <NavLink
  //         activeClassName="selected"
  //         to="/login"
  //       >
  //         Login
  //       </NavLink>
  //     </nav>
  //   );
  // }

  render() {
    // const { login } = this.props;
    return (
      <>
        {this.renderLoggedInLinks()}
        {/* { login === true
      ? this.renderLoggedInLinks()
      : this.renderNotLoggedInLinks() } */}
      </>
    );
  }
}

export default NavBar;

NavBar.defaultProps = {
  login: false,
};

NavBar.propTypes = {
  login: propTypes.bool,
};

NavBar.contextType = MixEdContext;
