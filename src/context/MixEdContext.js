import React from 'react';

const MixEdContext = React.createContext({
  data: {},
  groupings: [],
  addData: () => {},
  addGroupings: () => {},
  addStudentArr: () => {},
});

export default MixEdContext;