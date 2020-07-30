import React from 'react';
import ReactDOM from 'react-dom';
import GroupsMadePage from './GroupsMadePage';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const main = document.createElement('main');
  ReactDOM.render(<BrowserRouter><GroupsMadePage /></BrowserRouter>, main);
  ReactDOM.unmountComponentAtNode(main);
});