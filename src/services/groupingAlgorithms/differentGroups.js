/* takes an array of student objects,
groupSize as number,
priorities which is an array of the categories taken into consideration when grouping */
  /* if number of students doesn't fit into groups of groupSize evenly
  then we will make slightly larger groups, this takes the smaller group at the end
  and redistributes it to the previous groups
  ideally it would be better to anticipate that students will not fit evenly and 
  adjust groupSize before the end though */
  /* create an array of priorities to keep track of the properties for each priority
      in the current group */

function createDifferentGroups(arr, groupSize, priorities) {
  const groups = [];
  const pool = [];
  let currGroupIndex = 0;

  for (let i = 0; i < arr.length; i++) {
    pool.push(i);
  }
  shuffle(pool);
  // arr.findIndex((el) => el.alias === pool[i])
  
  addFirstToGroup(pool, arr, groups, currGroupIndex);
  
  
  while (pool.length > 0) {
    if (groups[currGroupIndex].length === groupSize) {
      currGroupIndex++;
      addFirstToGroup(pool, arr, groups, currGroupIndex);
    }
    else {
      let groupPriorities = [];
      priorities.forEach((priority) => {
        groupPriorities.push({ [priority]: [] })
      })
      groups[currGroupIndex].forEach((student) => {
        groupPriorities.forEach((priority, index) => {
          const priorityName = Object.keys(priority)[0];
          groupPriorities[index][priorityName].push(student[priorityName]);
        })
      });
      // then find the next student to add to the last group
      
      addNextToGroup(pool, arr, groups, groupPriorities, currGroupIndex);
    } 
  }

  // if (groups[`group${groupNumber}`].length !== groupSize) {
  //   for (let i = groups.length - 2; i >= 0 && !!groups[groups.length - 1].length; i--) {
  //     groups[i].push(groups[groups.length - 1][0]);
  //     groups[groups.length - 1].splice(0, 1);
  //   }
  //   groups.pop();
  // }
  console.log(groups);
  addGroupNum(groups, arr);
  console.log(arr);
  return arr;
  // return groups;
}

function shuffle(arr) { // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function addFirstToGroup(pool, arr, groups, currGroupIndex) {
  let indexToAdd = pool[0];
  groups[currGroupIndex]= [arr[indexToAdd]];
  pool.splice(0, 1);
  return groups;
}

function addNextToGroup(pool, arr, groups, groupPriorities, currGroupIndex) {
  let diffCatFound = [];
  for (let i = 0; i < pool.length; i++) {
    let indexToCheck = pool[i];
    for (let j = 0; j < groupPriorities.length; j++) {
      const priorityName = Object.keys(groupPriorities[j])[0];
      const categoryArr = groupPriorities[j][priorityName];
      const studentCat = arr[indexToCheck][priorityName];
      if (categoryArr.indexOf(studentCat) === -1) {
        diffCatFound.push(true);
      } else {
        diffCatFound.push(false);
      }
    }
    if ((diffCatFound.every((el) => el === true)) || !diffCatFound.length) {
      groups[currGroupIndex].push(arr[indexToCheck]);
      pool.splice(i, 1);
      return groups;
    }
    diffCatFound.splice(0, diffCatFound.length);
  }
    groupPriorities.pop();
    addNextToGroup(pool, arr, groups, groupPriorities, currGroupIndex);
}

function addGroupNum(groups, arr) {
  groups.forEach((group, index) => {
    group.forEach((groupMember) => {
      arr.forEach((student) => {
        if (student.alias === groupMember.alias) {
          student.groupNumber = (index + 1);
        }
      })
    })
  })
  return arr;
}

export { createDifferentGroups, addFirstToGroup, addNextToGroup };
// export addFirstToGroup;
// export addNextToGroup;

// const studentArr = 
// [{ "alias": "Blaise", "Hogwarts House": "Slytherin", "History of Magic Grade": 81, "History of Magic Grade Level": 2, "groupNum": 1 },
// { "alias": "Draco", "Hogwarts House": "Slytherin", "History of Magic Grade": 82, "History of Magic Grade Level": 2, "groupNum": 3 },
// { "alias": "Cho", "Hogwarts House": "Ravenclaw", "History of Magic Grade": 89, "History of Magic Grade Level": 3, "groupNum": 1 },
// { "alias": "Colin", "Hogwarts House": "Gryffindor", "History of Magic Grade": 79, "History of Magic Grade Level": 2, "groupNum": 1 },
// { "alias": "Cormac", "Hogwarts House": "Gryffindor", "History of Magic Grade": 81, "History of Magic Grade Level": 2, "groupNum": 2 },
// { "alias": "Crabbe", "Hogwarts House": "Slytherin", "History of Magic Grade": 52, "History of Magic Grade Level": 1, "groupNum": 2 },
// { "alias": "Dean", "Hogwarts House": "Gryffindor", "History of Magic Grade": 75, "History of Magic Grade Level": 1, "groupNum": 3 },
// { "alias": "Ernie", "Hogwarts House": "Hufflepuff", "History of Magic Grade": 83, "History of Magic Grade Level": 2, "groupNum": 2 },
// { "alias": "Ginny", "Hogwarts House": "Gryffindor", "History of Magic Grade": 81, "History of Magic Grade Level": 2, "groupNum": 4 },
// { "alias": "Goyle", "Hogwarts House": "Slytherin", "History of Magic Grade": 55, "History of Magic Grade Level": 1, "groupNum": 4 },
// { "alias": "Hannah", "Hogwarts House": "Hufflepuff", "History of Magic Grade": 65, "History of Magic Grade Level": 1, "groupNum": 3 },
// { "alias": "Harry", "Hogwarts House": "Gryffindor", "History of Magic Grade": 78, "History of Magic Grade Level": 2, "groupNum": 5 },
// { "alias": "Hermione", "Hogwarts House": "Gryffindor", "History of Magic Grade": 100, "History of Magic Grade Level": 3, "groupNum": 6 },
// { "alias": "Justin", "Hogwarts House": "Hufflepuff", "History of Magic Grade": 77, "History of Magic Grade Level": 2, "groupNum": 4 },
// { "alias": "Katie", "Hogwarts House": "Gryffindor", "History of Magic Grade": 75, "History of Magic Grade Level": 1, "groupNum": 7 },
// { "alias": "Lavender", "Hogwarts House": "Gryffindor", "History of Magic Grade": 84, "History of Magic Grade Level": 3, "groupNum": 8 },
// { "alias": "Luna", "Hogwarts House": "Ravenclaw", "History of Magic Grade": 92, "History of Magic Grade Level": 3, "groupNum": 5 },
// { "alias": "Michael", "Hogwarts House": "Ravenclaw", "History of Magic Grade": 68, "History of Magic Grade Level": 1, "groupNum": 6 },
// { "alias": "Neville", "Hogwarts House": "Gryffindor", "History of Magic Grade": 65, "History of Magic Grade Level": 1, "groupNum": 8 },
// { "alias": "Pansy", "Hogwarts House": "Slytherin", "History of Magic Grade": 84, "History of Magic Grade Level": 3, "groupNum": 5 },
// { "alias": "Padma", "Hogwarts House": "Ravenclaw", "History of Magic Grade": 88, "History of Magic Grade Level": 3, "groupNum": 7 },
// { "alias": "Parvati", "Hogwarts House": "Gryffindor", "History of Magic Grade": 90, "History of Magic Grade Level": 3, "groupNum": 8 },
// { "alias": "Ron", "Hogwarts House": "Gryffindor", "History of Magic Grade": 68, "History of Magic Grade Level": 1, "groupNum": 8 },
// { "alias": "Seamus", "Hogwarts House": "Gryffindor", "History of Magic Grade": 74, "History of Magic Grade Level": 1, "groupNum": 7 },
// { "alias": "Theodore", "Hogwarts House": "Slytherin", "History of Magic Grade": 86, "History of Magic Grade Level": 3, "groupNum": 6 },
// { "alias": "Zacharias", "Hogwarts House": "Hufflepuff", "History of Magic Grade": 95, "History of Magic Grade Level": 3, "groupNum": 7 }];

// console.log(createDifferentGroups(studentArr, 5, ["Hogwarts House", "History of Magic Grade Level"]));