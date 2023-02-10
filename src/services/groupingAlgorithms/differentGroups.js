/**
 * Creates groups, tries to ensure that each member of the group has different properties.
 * Uses functions shuffle, addFirstToGroup, and addNextToGroup, described below.
 *
 * Returns a nested array in which each inner array is a group of length groupSize, consisting of
 * the students belonging to that group.
 *
 * Creates a pool of students, as the algorithm finds an appropriate student to add to the group
 * it adds the student to the group and removes it from the pool.
 *
 * Adds the first student in the pool to the first group and every time there is a new group,
 * calling addFirstToGroup.
 *
 * After adding the first student to a group, it will look at the properties (priorities) in the
 * existing group members, and search the pool for a student whose properties do not match at all.
 * If it cannot find one, it will remove the lowest priority property (thus why they're called
 * properties) and look in the pool for a student different from all the priorities except the
 * removed last one. If it cannot find student that doesn't match, it will again remove the lowest
 * priority and search again, and so on. If only the first priority remains and still a unique
 * student is not found to put into the group, then it eliminates the priorities completely and
 * adds the next student in the pool.
 *
 * If number of students % groupSize !== 0, then the remaining students are added to the last
 * groups to make them slightly larger, as this is generally more favorable than making the
 * last groups smaller. To do this, groupSize is incremented only for these last groups.
 *
 */

/**
 * Core function that creates the groups
 * @param {array} arr - array of objects, each object representing a student
 * @param {number} groupSize - number specifying the ideal groupSize, which may be exceeded if
 * number of students doesn't fit into group evenly
 * @param {array} priorities - array of the names of the categories taken into account when
 * sorting into groups
 * @return {array} array containing arrays (each representing a group) of objects (each
 * representing a student)
 */
function createDifferentGroups(arr, groupSize, priorities) {
  let pool = JSON.parse(JSON.stringify(arr));
  let groups = [];
  let groupNumber = 1;
  const finalNumberOfGroups = Math.floor(pool.length / groupSize);
  const extraStudents = pool.length % groupSize;
  const startLargerGroups = finalNumberOfGroups - extraStudents + 1;

  shuffle(pool); // shuffles students to eliminate some bias

  addFirstToGroup(pool, groups, groupNumber);

  while (pool.length > 0) {
    if (groups[groups.length - 1].length === groupSize) {
      groupNumber++;
      if (groupNumber === startLargerGroups) {
        groupSize++;
      }
      addFirstToGroup(pool, groups, groupNumber);
    } else {
      let currGroup = groups[groups.length - 1];
      let groupPriorities = [];
      priorities.forEach((priority) => {
        groupPriorities.push({ [priority]: [] });
      });
      currGroup.forEach((student) => {
        groupPriorities.forEach((priority, index) => {
          const priorityName = Object.keys(priority)[0];
          groupPriorities[index][priorityName].push(student[priorityName]);
        });
      });
      addNextToGroup(pool, groups, groupPriorities, groupNumber);
    }
  }
  return groups;
}

function shuffle(arr) {
  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * The first student in a group can be anyone (since the group is empty), so this picks a random
 * student by choosing the first student in the pool (which has been shuffled randomly). Adds the
 * student and exits.
 *
 * @param {array} pool - pool of remaining students who have not been sorted into groups yet
 * @param {array} groups - nested arrays of students who have already been put into groups
 * @param {number} groupNumber - current number of group being added to
 */
// eslint-disable-next-line no-unused-vars
function addFirstToGroup(pool, groups, groupNumber) {
  groups.push([pool[0]]);
  pool.splice(0, 1);
  return groups;
}

/**
 *
 * Finds the next student to add to an existing group. Compares each student in the pool's
 * categories to the groupPriorities (to check to see what categories are already in the group)
 * and tries to find a student in the pool who doesn't match on any of the categories. If there
 * is none, then it removes the last priority (the lowest priority), and tries again, if there is
 * a point where all priorities have been removed it adds the next student from the pool and exits.
 *
 * @param {array} pool -see above
 * @param {array} groups - see above
 * @param {array} groupPriorities - array of existing categories already in the current group
 * @param {number} groupNumber - see above
 */
function addNextToGroup(pool, groups, groupPriorities, groupNumber) {
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
    if (diffCatFound.every((el) => el === true) || !diffCatFound.length) {
      currGroup.push(pool[i]);
      pool.splice(i, 1);
      return groups;
    }
    diffCatFound.splice(0, diffCatFound.length);
  }
  groupPriorities.pop();
  addNextToGroup(pool, groups, groupPriorities, groupNumber);
}

export default createDifferentGroups;
