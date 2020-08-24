/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GroupGeneratorScreen from '../../images/group-generator-screen.png';
import SavedGroupsScreen from '../../images/saved-groups-screen.png';
import './UserOnboarding.css';

class UserOnboarding extends Component {
  render() {
    console.log(this.props.passRef);
    return (
      <section ref={this.props.passRef} className="user-onboarding">
        <div className="user-onboarding__intro">
          <h3>MixEd lets teachers generate groups based on data.</h3>
        </div>
        <div className="user-onboarding__data-entry">
          <div className="user-onboarding__flex-child--left user-onboarding__text">
            <h3>
              Enter the data into the group generator
          </h3>
            <p>First, enter the data for grouping students. You&apos;ll need to provide a name and any
            categories to be taken into account when creating the groups--student grades,
            personality types, learning styles, etc.</p>
            <p>Put one value on each line. The order of the values must correspond to the order
            in which students are inputted. We recommend saving your categories on a spreadsheet
            and copying/pasting from a spreadsheet.</p>
          </div>
          <div className="user-onboarding__flex-child--right">
            <img
              src={GroupGeneratorScreen}
              className="user-onboarding__data-entry--img"
              alt="screen shot of group generator"
            />
          </div>
        </div>
        <div className="user-onboarding__saved-groups">
          <div className="user-onboarding__flex-child--right user-onboarding__text">
            <h3>
              Organize groupings by class
          </h3>
            <p>You can save your groups to an existing class or create a new class for the grouping
            to belong to, then view your groupings organized by class.</p>
          </div>
          <div className="user-onboarding__flex-child--left">
            <img
              src={SavedGroupsScreen}
              className="user-onboarding__saved-groups--img"
              alt="screen shot of group generator"
            />
          </div>
        </div>
        <div className="user-onboarding__buttons">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top
          </button>
          <button type="button">
          <Link to={`/make-groups`}>Make some groups</Link>
          </button>
        </div>
      </section>
    );
  }
    
}

export default UserOnboarding;
