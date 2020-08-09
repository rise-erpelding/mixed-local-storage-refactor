import React, { Component } from 'react';
import ValidationError from '../../components/ValidationError/ValidationError';
import MixEdContext from '../../context/MixEdContext';
import createDifferentGroups from '../../services/groupingAlgorithms/differentGroups';
import createSimilarGroups from '../../services/groupingAlgorithms/similarGroups';
import MakeGroupsService from '../../services/make-groups-service';
import store from '../../services/store';
import './MakeGroupsPage.css';
import ls from 'local-storage';
// import _ from "lodash";

class MakeGroupsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupSize: 2,
      groupingType: '',
      aliases: '',
      categoriesLength: 1,
      categoryTypes: [''],
      categoryNames: [''],
      categoryVals: [''],
      savedData: '',
    }
  }

  componentDidMount() {
    const savedData = ls.get('data');
    if (!!savedData) {
      this.setState(savedData);
    }
  }

  // METHODS FOR FORM BUTTONS ONCLICK
  handleSubmit = (e) => {
    e.preventDefault();
    // get things from context, props, state
    const { addData, addStudentArr, addCatNames } = this.context;
    const { history } = this.props;
    const {
      groupSize,
      groupingType,
      aliases,
      categoryTypes,
      categoryNames,
      categoryVals
    } = this.state;

    // add data to local storage so it will be there if we navigate back to this page
    addData(this.state);

    // turn all the textarea values into arrays, and if quantitative then turn the values to numbers
    // first, to turn category textarea values into arrays, get indexes for each type of data
    const quantitativeIndexes = [];
    const qualitativeIndexes = [];
    categoryTypes.forEach((type, index) => {
      if (type === 'quantitative') {
        quantitativeIndexes.push(index);
      }
      else {
        qualitativeIndexes.push(index);
      }
    })
    // then copy the array containing all the values
    const categoryValsArr = [...categoryVals];
    // then loop over the quantitative indexes and turn to an array containing numbers
    for (let i = 0; i < quantitativeIndexes.length; i++) {
      categoryValsArr[quantitativeIndexes[i]] = this.numberizeArr(this.createTrimmedArr(categoryValsArr[quantitativeIndexes[i]]));
    }
    // then loop over qualitative indexes and turn to an array
    for (let i = 0; i < qualitativeIndexes.length; i++) {
      categoryValsArr[qualitativeIndexes[i]] = this.createTrimmedArr(categoryValsArr[qualitativeIndexes[i]]);
    }
    // now categoryValsArr should contain only arrays, each of the same length
    // next change aliases to an array
    const aliasesArr = this.createTrimmedArr(aliases);
    
    // then combine aliasesArr and categoryValsArr and combine into an arr of objects, studentArr
    const studentArr = [];
    aliasesArr.forEach((alias) => studentArr.push({ alias: alias }));
    categoryValsArr.forEach(
      (valArr, index) => MakeGroupsService.addEachToObj(studentArr, valArr, categoryNames[index])
    );
    // for quantitative categories, we'll also go back and add a level
    // do this only after we've already pushed the raw numbers to studentArr
    // number of levels corresponds to groupSize
    const categoryNamesLevels = [...categoryNames]
    for (let i = 0; i < quantitativeIndexes.length; i++) {
      // turns array of numbers into an array of levels
      categoryValsArr[quantitativeIndexes[i]] = MakeGroupsService.getLevel(categoryValsArr[quantitativeIndexes[i]], groupSize);
      // adds the levels into the array of student objects
      MakeGroupsService.addEachToObj(studentArr, categoryValsArr[quantitativeIndexes[i]], `${categoryNames[quantitativeIndexes[i]]} Level`);
      // replaces the category name as '... Level' because this is what we want to use in our grouping algorithm
      categoryNamesLevels[quantitativeIndexes[i]] = `${categoryNames[quantitativeIndexes[i]]} Level`;
    }

    if (groupingType === 'mixed') {
      // const groups = createDifferentGroups(studentArr, groupSize, categoryNamesLevels);
      // console.log(groups);
      // // this.addGroupNum(groups, studentArr);
      // console.log(studentArr);
      // addCatNames(categoryNames);
      // addStudentArr(studentArr);
      this.handleMixedGroups(studentArr, groupSize, categoryNamesLevels, categoryNames);
    }
    if (groupingType === 'similar') {
      const groups = createSimilarGroups(studentArr, groupSize, categoryNamesLevels);
      console.log(groups);
      // this.addGroupNum(groups, studentArr);
      console.log(studentArr);
      addCatNames(categoryNames);
      addStudentArr(studentArr);

    }
    // history.push('/groups-made');
  }

  useSampleData = (datasetNum) => {
    // TODO: update this function
    if (datasetNum === 1) {
      this.setState(store.sampleData1);
    }
  }

  handleClickCancel = () => {
    const { history } = this.props;
    history.goBack();
  }

  // METHODS RELATED TO HANDLESUBMIT
  handleMixedGroups = (studentArr, groupSize, categoryNamesLevels, categoryNames) => {
    const groups = createDifferentGroups(studentArr, groupSize, categoryNamesLevels);
    console.log(groups);
    this.addGroupNumber(groups, studentArr);
    console.log(studentArr);

  }

  addGroupNumber = (groups, students) => {
    // groups.forEach((group, index) => {
    //   group.forEach((groupMember) => {
    //     students.forEach((student) => {
    //       if (student.alias === groupMember.alias) {
    //         student.groupNum = index;
    //       }
    //     })
    //   })
    // })
    groups.forEach((group, index) => {
      console.log(group);
      console.log(index);
    })
  }

  // METHODS FOR BUTTONS THAT CONTROL CATEGORIES
  addCategory = () => {
    let { categoriesLength } = this.state;
    categoriesLength++;
    this.setState({ categoriesLength });
    const { categoryTypes, categoryNames, categoryVals } = this.state;
    this.setState({
      categoryTypes: [...categoryTypes, ''],
      categoryNames: [...categoryNames, ''],
      categoryVals: [...categoryVals, ''],
    });
  }

  removeCategory = () => {
    let { categoriesLength } = this.state;
    categoriesLength--;
    this.setState({ categoriesLength });
    const { categoryTypes, categoryNames, categoryVals } = this.state;
    const catTypeArr = [...categoryTypes];
    const catNameArr = [...categoryNames];
    const catValArr = [...categoryVals];
    catTypeArr.pop();
    catNameArr.pop();
    catValArr.pop();
    this.setState({
      categoryTypes: catTypeArr,
      categoryNames: catNameArr,
      categoryVals: catValArr
    });
  }

  shiftCategoryLeft(event, index) {
    console.log(`shifting ${index} to the left`)
    const { categoryTypes, categoryNames, categoryVals } = this.state;
    const catTypeArr = [...categoryTypes];
    const catNameArr = [...categoryNames];
    const catValArr = [...categoryVals];
    [catTypeArr[index - 1], catTypeArr[index]] = [catTypeArr[index], catTypeArr[index - 1]];
    [catNameArr[index - 1], catNameArr[index]] = [catNameArr[index], catNameArr[index - 1]];
    [catValArr[index - 1], catValArr[index]] = [catValArr[index], catValArr[index - 1]];
    this.setState({
      categoryTypes: catTypeArr,
      categoryNames: catNameArr,
      categoryVals: catValArr
    });
  }

  shiftCategoryRight(event, index) {
    console.log(`shifting ${index} to the right`);
    const { categoryTypes, categoryNames, categoryVals } = this.state;
    const catTypeArr = [...categoryTypes];
    const catNameArr = [...categoryNames];
    const catValArr = [...categoryVals];
    [catTypeArr[index], catTypeArr[index + 1]] = [catTypeArr[index + 1], catTypeArr[index]];
    [catNameArr[index], catNameArr[index + 1]] = [catNameArr[index + 1], catNameArr[index]];
    [catValArr[index], catValArr[index + 1]] = [catValArr[index + 1], catValArr[index]];
    this.setState({
      categoryTypes: catTypeArr,
      categoryNames: catNameArr,
      categoryVals: catValArr
    });
  }

  // METHODS FOR UPDATING FORM VALUES
  updateGroupSize = (e) => {
    let groupSize = parseInt(e.target.value);
    if (isNaN(groupSize)) {
      groupSize = '';
    }
    this.setState({ groupSize });
  }

  updateGroupingType = (e) => {
    this.setState({ groupingType: e.target.value });
  }

  updateAliases = (e) => {
    this.setState({ aliases: e.target.value });
  }

  updateCategoryType = (event, index) => {
    const { categoryTypes } = this.state;
    const catTypeArr = [...categoryTypes];
    catTypeArr.splice(index, 1, event.target.value);
    this.setState({ categoryTypes: catTypeArr });
  }

  updateCategoryName = (event, index) => {
    const { categoryNames } = this.state;
    const catNameArr = [...categoryNames];
    catNameArr.splice(index, 1, event.target.value);
    this.setState({ categoryNames: catNameArr });
  }

  updateCategoryVals = (event, index) => {
    const { categoryVals } = this.state;
    const catValArr = [...categoryVals];
    catValArr.splice(index, 1, event.target.value);
    this.setState({ categoryVals: catValArr });
  }


  // METHODS FOR VALIDATING FORM VALUES
  validateAliases = () => {
    const { aliases } = this.state;
    const aliasesArray = this.createTrimmedArr(aliases);
    if (aliasesArray.length < 3) {
      return 'At least 3 aliases are required in order to generate groups'
    }
  }

  validateDataSize = () => {
    const { aliases, groupSize } = this.state;
    const aliasesArray = this.createTrimmedArr(aliases);
    if ((aliasesArray.length / groupSize) < 2) {
      return `More aliases required in order to make groups of size ${groupSize}`;
    }
  }

  validateTextareaLines = () => {
    // check that each textarea has the same number of lines
    const { aliases, categoryVals } = this.state;
    const aliasesArray = this.createTrimmedArr(aliases);
    const valsArrays = categoryVals.map((category) => this.createTrimmedArr(category).length);
    if (!valsArrays.every((length) => length === aliasesArray.length)) {
      return `Alias values and category values must all have the same number of lines.`
    }
  }

  validateCatNumbers = () => {
    const { categoryTypes, categoryVals } = this.state;
    const quantitativeIndexes = [];
    categoryTypes.forEach((type, index) => {
      if (type === 'quantitative') {
        quantitativeIndexes.push(index);
      }
    })
    for (let i = 0; i < quantitativeIndexes.length; i++) {
      const categoryArr = this.createTrimmedArr(categoryVals[quantitativeIndexes[i]]);
      const numbersArr = this.numberizeArr(categoryArr);
      if (numbersArr.includes(NaN)) {
        return 'Quantitative data can only consist of numbers.'
      }
    }
  }

  // HELPER METHODS

  // creates array, trimming excess whitespace
  createTrimmedArr = (vals) => vals.split(`\n`).filter((val) => !!val.trim().length);

  numberizeArr = (arr) => arr.map((val) => Number(val));

  // addGroupNum = (groupArr, studentArr) => {
  //   // goes through the array elements of groups
  //   // within each innermost array, finds the student in the mixedStudentArray
  //   // adds their groupNumber (index of the outer array + 1) as a property
  //   groupArr.forEach((group, index) => {
  //     group.forEach((groupMem) => {
  //       studentArr.forEach((student) => {
  //         if (student.alias === groupMem.alias) {
  //           student.groupNum = (index + 1);
  //         }
  //       })
  //     })
  //   });
  // }

  render() {
    const { categoriesLength } = this.state;
    let categories = [];
    for (let i = 0; i < categoriesLength; i++) {
      categories.push(
        <fieldset
          className="make-groups-page__form--fieldset"
          key={`category-index${i}`}
        >
          <legend>{`Category ${i + 1}:`}</legend>
          <div className="make-groups-page__form--before-textarea">
            <div className="make-groups-page__form--explanation">
              Values corresponding to a category.
            </div>
            <div className="make-groups-page__form--radio-buttons">
              <div>
                <input
                  name={`cat${i}-type`}
                  id={`cat${i}-quantitative`}
                  value="quantitative"
                  type="radio"
                  checked={this.state.categoryTypes[i] === 'quantitative'}
                  onChange={(event) => { this.updateCategoryType(event, i) }}
                  required
                />
                <label htmlFor={`cat${i}-quantitative`}>Quantitative (numbers)</label>
              </div>
              <div>
                <input
                  name={`cat${i}-type`}
                  id={`cat${i}-qualitative`}
                  value="qualitative"
                  type="radio"
                  checked={this.state.categoryTypes[i] === 'qualitative'}
                  onChange={(event) => { this.updateCategoryType(event, i) }}
                  required
                />
                <label htmlFor={`cat${i}-qualitative`}>Qualitative (words)</label>
              </div>
            </div>
            <div className="make-groups-page__form--category-name">
              <label htmlFor={`cat${i}-name`}>Category name:</label>{' '}
              <input
                name={`cat${i}-name`}
                id={`cat${i}-name`}
                type="text"
                value={this.state.categoryNames[i]}
                onChange={(event) => { this.updateCategoryName(event, i) }}
                required
              />
            </div>
          </div>
          <div>
            <div>
              <label htmlFor={`cat${i}-vals`}>Values:</label>
            </div>
            <textarea
              className="make-groups-page__form--textarea"
              id={`cat${i}-vals`}
              name={`cat${i}-vals`}
              rows="26"
              columns="20"
              placeholder="Enter values here, one on each line."
              value={this.state.categoryVals[i]}
              onChange={(event) => { this.updateCategoryVals(event, i) }}
            />
          </div>
          <div className="make-groups-page__form--below-textarea">
            {i === 0 ? '' : (
              <button
                type="button"
                onClick={(event) => { this.shiftCategoryLeft(event, i) }}
              >
                Shift Left
              </button>
            )}
            {i === categoriesLength - 1 ? '' : (
              <button
                type="button"
                onClick={(event) => { this.shiftCategoryRight(event, i) }}
              >
                Shift Right
              </button>
            )}
          </div>
        </fieldset>
      )
    }
    return (
      <main className="make-groups-page">
        <h1>Group Generator</h1>
        <form
          className="make-groups-page__form"
          onSubmit={this.handleSubmit}
        >
          <fieldset
            className="make-groups-page__form--grouping-characteristics"
          >
            <legend>Grouping characteristics:</legend>
            <label htmlFor="group-size">Group size (minimum):</label>
            <input
              name="group-size"
              id="group-size"
              type="number"
              min="2"
              max="20"
              value={this.state.groupSize}
              onChange={this.updateGroupSize}
            />
            <div className="make-groups-page__form--radio-buttons">
              <div>
                <input
                  name="grouping-type"
                  id="grouping-similar"
                  value="similar"
                  type="radio"
                  checked={this.state.groupingType === 'similar'}
                  onChange={this.updateGroupingType}
                  required
                />
                <label htmlFor="grouping-similar">Group members are similar</label>
              </div>
              <div>
                <input
                  name="grouping-type"
                  id="grouping-mixed"
                  value="mixed"
                  type="radio"
                  checked={this.state.groupingType === 'mixed'}
                  onChange={this.updateGroupingType}
                />
                <label htmlFor="grouping-mixed">Group members are diverse</label>
              </div>
            </div>
          </fieldset>
          <div className="make-groups-page__form--student-data">
            <fieldset
              className="make-groups-page__form--fieldset"
            >
              <legend>Aliases:</legend>
              <div className="make-groups-page__form--before-textarea">
                <div className="make-groups-page__form--explanation">
                  List of names or other identifier.
                </div>
                <ValidationError message={this.validateAliases()} />
                <ValidationError message={this.validateDataSize()} />
              </div>
              <div>
                <div>
                  <label htmlFor="aliases">Values:</label>
                </div>
                <textarea
                  className="make-groups-page__form--textarea"
                  id="aliases"
                  name="aliases"
                  rows="26"
                  columns="20"
                  placeholder="Enter aliases here, one on each line."
                  value={this.state.aliases}
                  onChange={this.updateAliases}
                />
              </div>
              <div className="make-groups-page__form--below-textarea"></div>
            </fieldset>
            {categories}
            <div className="make-groups-page__form--add-category-buttons">
              <button
                type="button"
                onClick={this.addCategory}
              >
                + Add Category
              </button>
              <button
                type="button"
                onClick={this.removeCategory}
              >
                - Remove Category
              </button>
            </div>
          </div>
          <div>
            <ValidationError message={this.validateTextareaLines()} />
            <ValidationError message={this.validateCatNumbers()} />
          </div>
          <div className="make-groups-page__form--buttons">
            <button
              type="button"
              onClick={this.handleClickCancel}
            >
              Cancel
          </button>

            <button
              type="submit"
            >
              Generate Groups
          </button>
          </div>
          <div>
          <button
              type="button"
            onClick={() => this.useSampleData(1)} 
            >
              Use sample dataset 1
          </button>
          </div>
        </form>
      </main>
    )
  }
}
export default MakeGroupsPage;

MakeGroupsPage.contextType = MixEdContext;

