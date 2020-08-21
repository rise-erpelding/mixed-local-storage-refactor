import React from 'react';
import ReactDOM from 'react-dom';
import SaveGroups from './SaveGroups';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SaveGroups />, div);
  ReactDOM.unmountComponentAtNode(div);
});