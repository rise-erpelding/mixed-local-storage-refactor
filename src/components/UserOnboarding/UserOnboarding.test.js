import React from 'react';
import ReactDOM from 'react-dom';
import UserOnboarding from './UserOnboarding';

it('renders without crashing', () => {
  const section = document.createElement('section');
  ReactDOM.render(<UserOnboarding />, section);
  ReactDOM.unmountComponentAtNode(section);
});