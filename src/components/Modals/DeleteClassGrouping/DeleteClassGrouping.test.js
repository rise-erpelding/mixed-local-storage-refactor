import React from 'react';
import ReactDOM from 'react-dom';
import DeleteClassGrouping from './DeleteClassGrouping';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const main = document.createElement('main');
  ReactDOM.render(<BrowserRouter><DeleteClassGrouping /></BrowserRouter>, main);
  ReactDOM.unmountComponentAtNode(main);
});