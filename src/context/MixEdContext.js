import React from 'react';

const MixEdContext = React.createContext({
  data: {},
  groupings: [],
  addData: () => {},
  removePrevData: () => {},
  addCatNames: () => {},
  addStudentArr: () => {},
  toggleLogin: () => {},
});

export default MixEdContext;