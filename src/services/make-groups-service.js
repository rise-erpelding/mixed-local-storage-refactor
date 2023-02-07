const MakeGroupsService = {
  addEachToObj(objArr, arr, keyName) {
    objArr.forEach((obj, i) => {
      obj[keyName] = arr[i];
    });
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
  addGroupNumber(groups, students) {
    groups.forEach((group, index) => {
      group.forEach((groupMember) => {
        students.forEach((student) => {
          if (student.alias === groupMember.alias) {
            student.groupNum = index + 1;
          }
        });
      });
    });
  },
};

export default MakeGroupsService;

