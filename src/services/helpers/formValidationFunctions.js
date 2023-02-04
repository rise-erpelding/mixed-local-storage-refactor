import { createTrimmedArr, numberizeArr } from "../../services/helpers/helperFunctions";

export const validateAliases = (aliases) => {
  const aliasesArray = createTrimmedArr(aliases);
  if (aliasesArray.length < 3) {
    return "At least 4 aliases are required in order to generate groups.";
  }
};

export const validateAliasUniqueness = (aliases) => {
  const aliasesArray = createTrimmedArr(aliases);
  const uniqueAliasesSet = new Set(aliasesArray);
  const uniqueAliasesArray = [...uniqueAliasesSet];
  if (uniqueAliasesArray.length !== aliasesArray.length) {
    return "No duplicate aliases allowed.";
  }
};

export const validateDataSize = (aliases, groupSize) => {
  const aliasesArray = createTrimmedArr(aliases);
  if (aliasesArray.length / groupSize < 2) {
    return `More aliases required in order to make groups of size ${groupSize}.`;
  }
};

export const validateTextareaLines = (aliases, categoryVals) => {
  // check that each textarea has the same number of lines
  const aliasesArray = createTrimmedArr(aliases);
  const valsArrays = categoryVals.map(
    (category) => createTrimmedArr(category).length
  );
  if (!valsArrays.every((length) => length === aliasesArray.length)) {
    return `Alias values and category values must all have the same number of lines.`;
  }
};

export const validateCatNumbers = (categoryTypes, categoryVals) => {
  const quantitativeIndexes = [];
  categoryTypes.forEach((type, index) => {
    if (type === "quantitative") {
      quantitativeIndexes.push(index);
    }
  });
  for (let i = 0; i < quantitativeIndexes.length; i++) {
    const categoryArr = createTrimmedArr(
      categoryVals[quantitativeIndexes[i]]
    );
    const numbersArr = numberizeArr(categoryArr);
    if (numbersArr.includes(NaN)) {
      return "Quantitative data can only consist of numbers.";
    }
  }
};