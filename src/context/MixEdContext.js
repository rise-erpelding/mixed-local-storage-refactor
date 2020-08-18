import React from 'react';

const MixEdContext = React.createContext({
  data: {},
  groupings: [],
  addData: () => {},
  addCatNames: () => {},
  addStudentArr: () => {},
  toggleLogin: () => {},
});

export default MixEdContext;