import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import MixEdContext from '../../context/MixEdContext';
import LandingPage from '../../routes/LandingPage/LandingPage';
// import MakeGroupsPage from '../../routes/MakeGroupsPage/MakeGroupsPage';
import { MakeGroupsPage } from '../../routes/MakeGroupsPage';
import GroupsMadePage from '../../routes/GroupsMadePage/GroupsMadePage';
import SavedGroupsPage from '../../routes/SavedGroupsPage/SavedGroupsPage';
import NotFoundPage from '../../routes/NotFoundPage/NotFoundPage';
// import LoginPage from '../../routes/LoginPage/LoginPage';
// import PrivateRoute from '../../Utils/PrivateRoute';
// import PublicOnlyRoute from '../../Utils/PublicOnlyRoute';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
// import TokenService from '../../services/token-service';
import ls from 'local-storage';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      studentArr: [],
      // isLoggedIn: TokenService.hasAuthToken(),
    };
    // this.toggleLogin = this.toggleLogin.bind(this);
  }

  setDataInLocalStorage = (data) => {
    // adds generator data to local storage so it will persist until saved
    this.setState({ data: data });
    ls.set('data', data);
  };

  clearDataInLocalStorage = () => {
    // clears local storage data
    ls.remove('groupings');
    ls.remove('data');
    ls.remove('studentArr');
    ls.remove('categoryNames');
  };

  setStudentArrInLocalStorage = (studentArr) => {
    this.setState({ studentArr: studentArr });
    ls.set('studentArr', studentArr);
  };

  setCatNamesInLocalStorage = (catNamesArr) => {
    ls.set('categoryNames', catNamesArr);
  };

  // toggleLogin() {
  //   const { isLoggedIn } = this.state;
  //   this.setState({ isLoggedIn: !isLoggedIn });
  // }

  render() {
    const { data, groupings } = this.state;

    const contextValue = {
      data,
      groupings,
      setDataInLocalStorage: this.setDataInLocalStorage,
      clearDataInLocalStorage: this.clearDataInLocalStorage,
      setStudentArrInLocalStorage: this.setStudentArrInLocalStorage,
      setCatNamesInLocalStorage: this.setCatNamesInLocalStorage,
    };

    return (
      <div className="app">
        <MixEdContext.Provider value={contextValue}>
          <NavBar />
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/make-groups" component={MakeGroupsPage} />
            <Route
              path="/groups-made"
              component={(props) => <GroupsMadePage {...props} />}
            />
            <Route path="/my-groups" component={SavedGroupsPage} />
            {/* <PublicOnlyRoute
            path="/login"
            component={LoginPage}
          /> */}
            <Route component={NotFoundPage} />
          </Switch>
        </MixEdContext.Provider>
        <Footer />
      </div>
    );
  }
}

export default App;
