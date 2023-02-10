/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import Footer from './Footer';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const footer = document.createElement('footer');
  ReactDOM.render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>,
    footer
  );
  ReactDOM.unmountComponentAtNode(footer);
});
