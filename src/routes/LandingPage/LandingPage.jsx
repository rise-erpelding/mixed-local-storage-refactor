import React, { Component } from 'react';
import Landing from '../../components/Landing/Landing';
import UserOnboarding from '../../components/UserOnboarding/UserOnboarding';
import MixEdContext from '../../context/MixEdContext';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
  }

  scrollToRef = () => {
    window.scrollTo({
      top: this.scrollRef.current.offsetTop,
      left: 0,
      behavior: 'smooth'})
  }

  // TODO: possibly move this to App.js so that it can be reused and found more easily?
  // clearPreviousGroups = () => {
  //   console.log('clearing previous groups');
  //   ls.remove('groupings');
  //   ls.remove('data');
  //   ls.remove('studentArr');
  //   ls.remove('categoryNames');
  // }

  render() {
    const { removePrevData } = this.context;
    return (
      <main>
        <Landing 
          handleOnboarding={this.scrollToRef}
          handleMakeGroupsButton={removePrevData}
        />
        <UserOnboarding passRef={this.scrollRef} />
      </main>
    );
  }
}

export default LandingPage;

LandingPage.contextType = MixEdContext;