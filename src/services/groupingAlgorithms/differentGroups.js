/* takes an array of student objects,
groupSize as number,
priorities which is an array of the categories taken into consideration when grouping */
function createDifferentGroups(arr, groupSize, priorities) {
  let pool = [...arr];
  let groups = [];
  
  while (pool.length > 0) {
    // the first student in a new group can be whatever student is first in the pool
    if ((!groups.length) || (groups[groups.length - 1].length === groupSize)) {
      addFirstToGroup(pool, groups);
    }
    else {
      let currGroup = groups[groups.length - 1];
      /* create an array of priorities to keep track of the properties for each priority
      in the current group */
      let groupPriorities = [];
      priorities.forEach((priority) => {
        groupPriorities.push({ [priority]: [] })
      })
      currGroup.forEach((student) => {
        groupPriorities.forEach((priority, index) => {
          const priorityName = Object.keys(priority)[0];
          groupPriorities[index][priorityName].push(student[priorityName]);
        })
      });
      // then find the next student to add to the last group
      
      addNextToGroup(pool, groups, groupPriorities);
    } 

  }

  /* if number of students doesn't fit into groups of groupSize evenly
  then we will make slightly larger groups, this takes the smaller group at the end
  and redistributes it to the previous groups
  ideally it would be better to anticipate that students will not fit evenly and 
  adjust groupSize before the end though */
  if (groups[groups.length - 1].length !== groupSize) {
    for (let i = groups.length - 2; i >= 0 && !!groups[groups.length - 1].length; i--) {
      groups[i].push(groups[groups.length - 1][0]);
      groups[groups.length - 1].splice(0, 1);
    }
    groups.pop();
  }
  console.log(pool.length);
  return groups;
}

function addFirstToGroup(pool, groups) {
  // adds the first student from the pool to a new group
  // deletes that first student from the pool
  groups.push([pool[0]]);
  pool.splice(0, 1);
  return groups;
}

function addNextToGroup(pool, groups, groupPriorities) {
  // this function finds the most suitable member to add to the group
  // it will loop through the pool and find a student whose priorities do not match
  let currGroup = groups[groups.length - 1];
  let diffCatFound = [];
  for (let i = 0; i < pool.length; i++) {
    for (let j = 0; j < groupPriorities.length; j++) {
      const priorityName = Object.keys(groupPriorities[j])[0];
      const categoryArr = groupPriorities[j][priorityName];
      const studentCat = pool[i][priorityName];
      if (categoryArr.indexOf(studentCat) === -1) {
        diffCatFound.push(true);
      } else {
        diffCatFound.push(false);
      }
    }
    if ((diffCatFound.every((el) => el === true)) || !diffCatFound.length) {
      currGroup.push(pool[i]);
      pool.splice(i, 1);
      return groups;
    }
    diffCatFound.splice(0, diffCatFound.length);
  }
    groupPriorities.pop();
    addNextToGroup(pool, groups, groupPriorities);

}

export default createDifferentGroups;