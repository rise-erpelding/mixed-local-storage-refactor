import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import MixEdContext from '../../context/MixEdContext';

import LandingPage from '../../routes/LandingPage/LandingPage';
import MakeGroupsPage from '../../routes/MakeGroupsPage/MakeGroupsPage';
import GroupsMadePage from '../../routes/GroupsMadePage/GroupsMadePage';
import SavedGroupsPage from '../../routes/SavedGroupsPage/SavedGroupsPage';
import NavBar from '../NavBar/NavBar';

import ls from 'local-storage';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      studentArr: [],
    }
  }

  addData = (data) => {
    this.setState({ data: data });
    ls.set('data', data);
  }

  addStudentArr = (studentArr) => {
    this.setState({ studentArr: studentArr });
    ls.set('studentArr', studentArr);
  }

  addCatNames = (primaryCatName, secondaryCatName) => {
    ls.set('primaryCat', primaryCatName);
    ls.set('secondaryCat', secondaryCatName);
  }

  render() {
    const { data, groupings } = this.state;

    const contextValue = {
      data,
      groupings,
      addData: this.addData,
      addStudentArr: this.addStudentArr,
      addCatNames: this.addCatNames,
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
          <Route
            path="/my-groups"
            component={SavedGroupsPage}
          />
        </Switch>
        </MixEdContext.Provider>
      </div>
    );
  }
}

export default App;
