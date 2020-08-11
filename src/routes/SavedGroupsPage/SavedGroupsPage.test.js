import React from 'react';
import ReactDOM from 'react-dom';
import SavedGroupsPage from './SavedGroupsPage';
import { BrowserRouter } from 'react-router-dom';



it('renders without crashing', () => {
  const main = document.createElement('main');
  ReactDOM.render(<BrowserRouter><SavedGroupsPage /></BrowserRouter>, main);
  ReactDOM.unmountComponentAtNode(main);
});