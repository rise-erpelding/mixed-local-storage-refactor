import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import LandingPage from '../../routes/LandingPage/LandingPage';
import MakeGroupsPage from '../../routes/MakeGroupsPage/MakeGroupsPage';
import NavBar from '../NavBar/NavBar';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <NavBar />
        <Switch>
          <Route 
            exact
            path="/"
            component={LandingPage}
          />
          <Route 
            path="/make-groups"
            component={MakeGroupsPage}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
