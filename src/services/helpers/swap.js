export const swapArrItems = (arr, index, newIndex) => {
  const arrCopy = [...arr];
  [arrCopy[index], arrCopy[newIndex]] = [arrCopy[newIndex], arrCopy[index]];
  return arrCopy;
};
