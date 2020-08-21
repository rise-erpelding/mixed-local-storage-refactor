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
  faWindowClose,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { faSave as faSaveRegular, faEye as faEyeRegular } from '@fortawesome/free-regular-svg-icons';

library.add(
  faTrashAlt,
  faEdit,
  faTimes,
  faFlushed,
  faPlus,
  faMinus,
  faSaveRegular,
  faEyeRegular,
  faWindowClose,
  faArrowLeft
);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
