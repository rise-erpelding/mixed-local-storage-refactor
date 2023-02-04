export const createTrimmedArr = (vals) => vals.split(`\n`).filter((val) => !!val.trim().length);

export const numberizeArr = (arr) => arr.map((val) => Number(val));

export const swapArrItems = (arr, index, newIndex) => {
  const arrCopy = [...arr];
  [arrCopy[index], arrCopy[newIndex]] = [arrCopy[newIndex], arrCopy[index]];
  return arrCopy;
};
