import React from 'react';
import ReactDOM from 'react-dom';
import LandingPage from './LandingPage';

it('renders without crashing', () => {
  const main = document.createElement('main');
  ReactDOM.render(<LandingPage />, main);
  ReactDOM.unmountComponentAtNode(main);
});