import React from 'react';
import ReactDOM from 'react-dom';
import MakeGroupsPage from './MakeGroupsPage';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const main = document.createElement('main');
  ReactDOM.render(<BrowserRouter><MakeGroupsPage /></BrowserRouter>, main);
  ReactDOM.unmountComponentAtNode(main);
});