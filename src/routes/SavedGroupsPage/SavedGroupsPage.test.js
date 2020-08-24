/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import SavedGroupsPage from './SavedGroupsPage';
import { BrowserRouter } from 'react-router-dom';import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTrashAlt,
  faEdit,
  faTimes,
  faFlushed,
  faPlus,
  faMinus,
  faWindowClose,
  faArrowLeft,
  faArrowRight,
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
  faArrowLeft,
  faArrowRight
);



it('renders without crashing', () => {
  const main = document.createElement('main');
  ReactDOM.render(<BrowserRouter><SavedGroupsPage /></BrowserRouter>, main);
  ReactDOM.unmountComponentAtNode(main);
});