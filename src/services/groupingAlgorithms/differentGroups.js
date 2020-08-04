// TODO: algorithm needs tweaking, we should sort the array of student objects
// so that the students belonging to the most common categories appear first

function createDifferentGroups(arr, groupSize, primaryCatKey, secondaryCatKey) {
  let pool = [...arr];
  let groups = [];
  let lastGroupPrimaryCats = [];
  let lastGroupSecondaryCats = [];
  

  while (pool.length > 0) {
    let diffStudentAdded = false;
    let diffSameStudentAdded = false;
    if ((!groups.length) || (groups[groups.length - 1].length === groupSize)) {
      // add the first element from pool within a new array to groups
      groups.push([pool[0]]);
      // keep track of the house that we added to the group as well as the learning style in arrays
      lastGroupPrimaryCats.push(pool[0][primaryCatKey]);
      lastGroupSecondaryCats.push(pool[0][secondaryCatKey]);

      // then delete the first element from the pool so we don't add it again
      pool.splice(0, 1);
      diffStudentAdded = true;
    }
    // otherwise if the last group size is not 3
    else {
      //
      for (let i = 0; i < pool.length; i++) {
        let iPrimaryCat = pool[i][primaryCatKey];
        let iSecondaryCat = pool[i][secondaryCatKey];
        // if there is no index in lastGroupPrimaryCats that matches iPrimaryCat and same for secondary cats
        // basically if we don't find iPrimaryCat or iSecondaryCat in lastGroupPrimaryCats or lastGroupSecondaryCats
        if ((lastGroupPrimaryCats.indexOf(iPrimaryCat) === -1) && (lastGroupSecondaryCats.indexOf(iSecondaryCat) === -1)) {
          // then we can add the categories to the arrays
          lastGroupPrimaryCats.push(iPrimaryCat);
          lastGroupSecondaryCats.push(iSecondaryCat);
          groups[groups.length - 1].push(pool[i]);
          pool.splice(i, 1);
          diffStudentAdded = true;
          // check groupSize, if it's 3 then clear out the cats arrays so we can start over with the next group
          if (groups[groups.length - 1].length === groupSize) {
            lastGroupPrimaryCats.splice(0, groupSize);
            lastGroupSecondaryCats.splice(0, groupSize);
          }
          // break out of the i loop because we've found a student to add
          break;
        }
      } // i loop ends here
    } // else statement ends here
    // if we get to this point without having added any students, we've looped through the pool and not found anything that fits
    // we should not be going through the pool again because it will not find anything new
    // let's go through the pool again but lower our standards
    if (diffStudentAdded === false) {
      for (let i = 0; i < pool.length; i++) {
        
        let iPrimaryCat = pool[i][primaryCatKey];
        if (lastGroupPrimaryCats.indexOf(iPrimaryCat) === -1) {
          lastGroupPrimaryCats.push(iPrimaryCat);
          groups[groups.length - 1].push(pool[i]);
          pool.splice(i, 1);
          diffSameStudentAdded = true;
          if (groups[groups.length - 1].length === groupSize) {
            lastGroupPrimaryCats.splice(0, groupSize);
          }
          break;
        }
      } // end of i loop
    } // end of if block

    // if we get to this point without having added any students
    // lower the standards again (allow anything in) and just add the next student to the group
    if (diffStudentAdded === false && diffSameStudentAdded === false) {
      groups[groups.length - 1].push(pool[0]);
      pool.splice(0, 1);
    }
  } // while loop ends here
    // check the length of the last group to see if it is the appropriate size
    if (groups[groups.length - 1].length !== groupSize) {
      // if it is not, we will loop backwards over our groups, starting with the second to last
      for (let i = groups.length - 2; i >= 0 && !!groups[groups.length - 1].length; i--) {
        // then push the first element from the last group to the second to last group, third to last group, etc.
        // so on until we've pushed each person from the last group to a different group
        groups[i].push(groups[groups.length - 1][0]);
        // delete the student we just pushed from the last group since we've added them elsewhere
        groups[groups.length - 1].splice(0, 1);
      }
      // delete the empty array
      groups.pop();
    }

  return groups;
}

export default createDifferentGroups;