import React from 'react';
import './Landing.css';

const Landing = (props) => {
    return (
      <section className="landing">
        <h1>Welcome to Mix Ed</h1>
        <h2>The stress-free way to make classroom groups</h2>
        <div className="landing__buttons">
          <button onClick={props.handleOnboarding}>See how it works</button>
          <button>Make some groups</button>
        </div>
      </section>
    );
}

export default Landing;