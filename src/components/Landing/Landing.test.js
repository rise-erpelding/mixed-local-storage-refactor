import React from 'react';
import ReactDOM from 'react-dom';
import Landing from './Landing';

it('renders without crashing', () => {
  const section = document.createElement('section');
  ReactDOM.render(<Landing />, section);
  ReactDOM.unmountComponentAtNode(section);
});