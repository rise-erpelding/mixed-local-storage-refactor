import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = (props) => {
    return (
      <section className="landing">
        <h1>Welcome to Mix Ed</h1>
        <h2>The stress-free way to make classroom groups</h2>
        <div className="landing__buttons">
          <button type="button" onClick={props.handleOnboarding}>
            See how it works
          </button>
          <button type="button">
            <Link to={`/make-groups`}>Make some groups</Link>
          </button>
        </div>
      </section>
    );
}

export default Landing;