const MakeGroupsService = {
  addEachToObj(objArr, arr, keyName) {
    for (let i = 0; i < objArr.length; i++) {
      objArr[i][keyName] = arr[i];
    }
    return objArr;
  },
  getLevel(numArr, groupSize) {
    const sortedArr = [...numArr];
    sortedArr.sort((a, b) => a - b);
    const cutoffIndex = Math.ceil(sortedArr.length / groupSize);
    const cutoffScores = [sortedArr[0]];
    const studentScoreLevel = [];
    let cutoff = cutoffIndex;
    let groupNum = 1;
    while ((cutoff * groupNum) < sortedArr.length) {
      cutoffScores.push(sortedArr[cutoff * groupNum]);
      groupNum++;
    }
    cutoffScores.push(sortedArr[sortedArr.length - 1] + 1);
    for (let i = 0; i < numArr.length; i++) {
      for (let j = cutoffScores.length - 1; j >= 0; j--) {
        if (numArr[i] < cutoffScores[j] && numArr[i] >= cutoffScores[j - 1]) {
          studentScoreLevel.push(j);
        }
      }
    }
    return studentScoreLevel;
  },
  mostFrequentFirst(arr, primaryCatKey) {
    const reorderedData = [];
    const freqArr = [];
    const freq = {};
    // first count frequencies
    for (let i = 0; i < arr.length; i++) {
      freq[arr[i][primaryCatKey]] = (freq[arr[i][primaryCatKey]] || 0) + 1;
    }
    // then put in an array so we can put in order of most frequent
    for (let key in freq) {
      freqArr.push({
        [primaryCatKey]: key,
        frequency: freq[key],
      });
    }
    // then use that order to rearrange student array
    freqArr
      .sort((a, b) => b.frequency - a.frequency)
      .forEach((cat) => reorderedData
        .push(arr
          .filter((student) => student[primaryCatKey] === cat[primaryCatKey])));

    return reorderedData.flat();
  },
};

export default MakeGroupsService;

