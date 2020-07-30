import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import MixEdContext from '../../context/MixEdContext';

import LandingPage from '../../routes/LandingPage/LandingPage';
import MakeGroupsPage from '../../routes/MakeGroupsPage/MakeGroupsPage';
import NavBar from '../NavBar/NavBar';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      groupings: [],
    }
  }

  addData = (data) => {
    this.setState({ data: data });
  }

  addGroupings = (groupings) => {
    this.setState({ groupings: groupings });
  }

  render() {
    const { data, groupings } = this.state;

    const contextValue = {
      data,
      groupings,
      addData: this.addData,
      addGroupings: this.addGroupings,
    };

    return (
      <div className="app">
        <MixEdContext.Provider value={contextValue}>
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
        </MixEdContext.Provider>
      </div>
    );
  }
}

export default App;
