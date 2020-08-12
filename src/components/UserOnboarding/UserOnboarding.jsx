import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './UserOnboarding.css';

class UserOnboarding extends Component {
  render() {
    return (
      <section ref={this.props.passRef} className="user-onboarding">
        <div className="user-onboarding__intro">
          [placeholder for image of groupings]
          <h3>MixEd lets teachers generate groups based on data.</h3>
        </div>
        <div className="user-onboarding__data-entry">
          <h3>
            Enter the data
          </h3>
          [placeholder for image of sample data being entered into generator]
          <p>First, enter the data for grouping students. At a minimum, you need to provide a student alias (such as a name, number, etc.) to identify the student. You may also add categories that you want to be taken into account when making groups--for example, student grades, personality types, learning styles, topics of interest--any value that you might want to use to categorize students.</p>
          <p>Put one value on each line. The order of the values MUST correspond to the order in which students are inputted. We recommend saving your categories on a spreadsheet and copying/pasting from a spreadsheet.</p>
        </div>
        <div className="user-onboarding__generate-groups">
          <h3>
            Generate groups
          </h3>
          [placeholder for generate button]
          <p>Once you have entered all your data and picked all necessary criteria, click on the Generate button to generate your groups.</p>
        </div>
        <div className="user-onboarding__save-groups">
          <h3>
            Save groups to view them again later
          </h3>
          [placeholder for editing image]
          <p>If you’re not happy with your groups, you can edit them to your satisfaction. If you want to save your groups to your account (must be logged in), click Save. </p>
        </div>
        <div className="user-onboarding__organize-groups">
          <h3>
            Organize groupings by class
          </h3>
          [placeholder for teacher data screen]
          <p>You can save your groups to an existing class or create a new class for the grouping to belong to, then view your groupings organized by class.</p>
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
