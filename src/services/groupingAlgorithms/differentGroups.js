/* takes an array of student objects,
groupSize as number,
priorities which is an array of the categories taken into consideration when grouping */
function createDifferentGroups(arr, groupSize, priorities) {
  let pool = JSON.parse(JSON.stringify(arr));
  let groups = [];
  let groupNumber = 1;

  addFirstToGroup(pool, groups, groupNumber);
  
  while (pool.length > 0) {
    // the first student in a new group can be whatever student is first in the pool
    if (groups[`group${groupNumber}`].length === groupSize) {
      groupNumber++;
      addFirstToGroup(pool, groups, groupNumber);
    }
    else {
      let currGroup = groups[`group${groupNumber}`];
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
      
      addNextToGroup(pool, groups, groupPriorities, groupNumber);
    } 
  }

  /* if number of students doesn't fit into groups of groupSize evenly
  then we will make slightly larger groups, this takes the smaller group at the end
  and redistributes it to the previous groups
  ideally it would be better to anticipate that students will not fit evenly and 
  adjust groupSize before the end though */
  // if (groups[`group${groupNumber}`].length !== groupSize) {
  //   for (let i = groups.length - 2; i >= 0 && !!groups[groups.length - 1].length; i--) {
  //     groups[i].push(groups[groups.length - 1][0]);
  //     groups[groups.length - 1].splice(0, 1);
  //   }
  //   groups.pop();
  // }
  console.log(groups);
  return groups;
}

function addFirstToGroup(pool, groups, groupNumber) {
  // adds the first student from the pool to a new group
  // deletes that first student from the pool
  groups[`group${groupNumber}`]= [pool[0]];
  pool.splice(0, 1);
  return groups;
}

function addNextToGroup(pool, groups, groupPriorities, groupNumber) {
  // this function finds the most suitable member to add to the group
  // it will loop through the pool and find a student whose priorities do not match
  let currGroup = groups[`group${groupNumber}`];
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
      console.log(groups);
      return groups;
    }
    diffCatFound.splice(0, diffCatFound.length);
  }
    groupPriorities.pop();
    addNextToGroup(pool, groups, groupPriorities, groupNumber);

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

// console.log(createDifferentGroups(studentArr, 2, ["Hogwarts House", "History of Magic Grade Level"]));