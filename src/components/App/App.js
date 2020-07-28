import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import LandingPage from '../../routes/Landing/LandingPage';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Route 
            exact
            path="/"
            component={LandingPage}
          />
          {/* <Route /> */}
        </Switch>
      </div>
    );
  }
}

export default App;
