import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import MixEdContext from '../../context/MixEdContext';

import LandingPage from '../../routes/LandingPage/LandingPage';
import MakeGroupsPage from '../../routes/MakeGroupsPage/MakeGroupsPage';
import GroupsMadePage from '../../routes/GroupsMadePage/GroupsMadePage';
import NavBar from '../NavBar/NavBar';

import ls from 'local-storage';

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
    ls.set('data', data);
  }

  addGroupings = (groupings) => {
    this.setState({ groupings: groupings });
    ls.set('groupings', groupings)
  }

  updateGroupings = (groupings) => {
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
          <Route
            path="/groups-made"
            component={GroupsMadePage}
          />
        </Switch>
        </MixEdContext.Provider>
      </div>
    );
  }
}

export default App;
