/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import AddUpdateClass from './AddUpdateClass';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const main = document.createElement('main');
  ReactDOM.render(<BrowserRouter><AddUpdateClass /></BrowserRouter>, main);
  ReactDOM.unmountComponentAtNode(main);
});