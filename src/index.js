import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './components/App/App';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTrashAlt,
  faEdit,
  faTimes,
  faFlushed,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faTrashAlt,
  faEdit,
  faTimes,
  faFlushed,
  faPlus,
  faMinus,
);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
