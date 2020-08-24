import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import './Landing.css';

const Landing = (props) => {
    return (
      <section className="landing">
        <h1>
          <span className="landing__orange">Mix</span>
          {' '}
          <span className="landing__yellow">ED</span>
        </h1>
        <h2>
          <span className="landing__orange">The</span>
          {' '}
          <span className="landing__yellow">stress-free</span>
          {' '}
          <span className="landing__orange">way to make</span>
          {' '}
          <span className="landing__yellow">classroom groups</span>
        </h2>
        <div className="landing__buttons">
          <button type="button" onClick={props.handleOnboarding}>
            See how it works
          </button>
          <button
            type="button"
            onClick={props.handleMakeGroupsButton}
          >
            <Link to={`/make-groups`}>Make some groups</Link>
          </button>
        </div>
      </section>
    );
};

export default Landing;

Landing.defaultProps = {
  handleOnboarding: () => {},
  handleMakeGroupsButton: () => {},
};

Landing.propTypes = {
  handleOnboarding: propTypes.func,
  handleMakeGroupsButton: propTypes.func,
};
