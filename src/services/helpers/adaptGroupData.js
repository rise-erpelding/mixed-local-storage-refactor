import { createTrimmedArr, numberizeArr } from "../../services/helpers/helperFunctions";
import MakeGroupsService from "../make-groups-service";

export const adaptGroupData = (categoryTypes, aliases, categoryVals, categoryNames, groupSize) => {
  // track indexes for qualitative data and quantitative data
  const quantitativeIndexes = [];
  const qualitativeIndexes = [];
  categoryTypes.forEach((type, index) => {
    if (type === "quantitative") {
      quantitativeIndexes.push(index);
    } else {
      qualitativeIndexes.push(index);
    }
  });

  // turn the data into arrays
  const aliasesArr = createTrimmedArr(aliases);
  const categoryValsArr = [...categoryVals];
  quantitativeIndexes.forEach((index) => {
    categoryValsArr[index] = numberizeArr(
      createTrimmedArr(categoryValsArr[index])
    );
  });
  qualitativeIndexes.forEach((index) => {
    categoryValsArr[index] = createTrimmedArr(
      categoryValsArr[index]
    );
  });

  const studentArr = [];
  aliasesArr.forEach((alias) => studentArr.push({ alias: alias }));
  categoryValsArr.forEach((valArr, index) =>
    MakeGroupsService.addEachToObj(studentArr, valArr, categoryNames[index])
  );

  const categoryNamesLevels = [...categoryNames];
  quantitativeIndexes.forEach((index) => {
    categoryValsArr[index] = MakeGroupsService.getLevel(categoryValsArr[index], groupSize);
    MakeGroupsService.addEachToObj(studentArr, categoryValsArr[index], `${categoryNames[index]} Level`);
    categoryNamesLevels[index] = `${categoryNames[index]} Level`;
  });

  return { studentArr, categoryNamesLevels };
};
