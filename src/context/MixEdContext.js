import React from 'react';

const MixEdContext = React.createContext({
  data: {},
  groupings: [],
  setDataInLocalStorage: () => {},
  clearDataInLocalStorage: () => {},
  setCatNamesInLocalStorage: () => {},
  setStudentArrInLocalStorage: () => {},
  toggleLogin: () => {},
});

export default MixEdContext;
