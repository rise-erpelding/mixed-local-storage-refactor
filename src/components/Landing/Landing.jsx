import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = (props) => {
    return (
      <section className="landing">
        <h1>
          <span className="landing__orange">M</span>
          <span className="landing__yellow">i</span>
          <span className="landing__orange">x</span>
          {' '}
          <span className="landing__yellow">ED</span>
        </h1>
        <h2 className="landing__yellow">The stress-free way to make classroom groups</h2>
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
}

export default Landing;