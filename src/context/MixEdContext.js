import React from 'react';

const MixEdContext = React.createContext({
  data: {},
  groupings: [],
  addData: () => {},
  addCatNames: () => {},
  addStudentArr: () => {},
});

export default MixEdContext;