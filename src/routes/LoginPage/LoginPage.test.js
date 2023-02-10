/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import LoginPage from './LoginPage';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const main = document.createElement('main');
  ReactDOM.render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>,
    main
  );
  ReactDOM.unmountComponentAtNode(main);
});
