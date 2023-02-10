import React from 'react';
import ReactDOM from 'react-dom';
import UserOnboarding from './UserOnboarding';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const section = document.createElement('section');
  ReactDOM.render(
    <BrowserRouter>
      <UserOnboarding />
    </BrowserRouter>,
    section
  );
  ReactDOM.unmountComponentAtNode(section);
});
