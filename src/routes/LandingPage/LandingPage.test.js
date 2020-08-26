/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import LandingPage from './LandingPage';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const main = document.createElement('main');
  ReactDOM.render(<BrowserRouter><LandingPage /></BrowserRouter>, main);
  ReactDOM.unmountComponentAtNode(main);
});