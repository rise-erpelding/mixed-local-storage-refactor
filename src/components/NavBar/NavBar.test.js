import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import NavBar from './NavBar';

it('renders without crashing', () => {
  const nav = document.createElement('nav');
  ReactDOM.render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>,
    nav
  );
  ReactDOM.unmountComponentAtNode(nav);
});
