import React, { Component } from 'react';
import ValidationError from '../../components/ValidationError/ValidationError';
import FirstVisitModal from '../../components/FirstVisitModal/FirstVisitModal';
import MixEdContext from '../../context/MixEdContext';
import createDifferentGroups from '../../services/groupingAlgorithms/differentGroups';
import createSimilarGroups from '../../services/groupingAlgorithms/similarGroups';
import MakeGroupsService from '../../services/make-groups-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import store from '../../services/store';
import './MakeGroupsPage.css';
import ls from 'local-storage';

class MakeGroupsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      groupSize: 2,
      groupingType: '',
      aliases: '',
      categoriesLength: 1,
      categoryTypes: [''],
      categoryNames: [''],
      categoryVals: [''],
      savedData: '',
      showPopUp: true,
    }
  }

  /**
   * Get any previous unsaved data from local storage.
   * Also, if it is the first visit, do a pop up here.
   */
  componentDidMount() {
    const visited = ls.get('alreadyVisited');
    if (!!visited) {
      this.setState({ showPopUp: false });
    }
    else {
      ls.set('alreadyVisited', true);
    }
    const savedData = ls.get('data');
    if (!!savedData) {
      this.setState(savedData);
    }
  }

  // METHODS FOR FORM BUTTONS ONCLICK
  handleSubmit = (e) => {
    e.preventDefault();
    const { addData } = this.context;
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



    /**
     * Next, prepare data for the sorting function to get the groups:
     * -Keep track of which indexes in categories arrays are qualitative vs quantitative
     * -Turn a set of quantitative category vals into a number array, turn a set of qualitative
     * category vals into an array of strings, and turn aliases into an array (of strings).
     * -Combine categoryTypes, categoryNames, categoryVals, and aliases into an array of objects,
     * one object with info for each student.
     * -Also add a level to each object for any quantitative variables--only as many levels as
     * number of people in a group, which is most helpful for making mixed groups. Levels are
     * assigned by sorting array, designating a number of cutoff points corresponding to number
     * of levels, the interval between each set of cutoff points corresponds to a level.
     * -Then send array of objects to grouping algorithm according to whether we want mixed
     * or similar groups.
     * -Then navigate to /groups-made
     */

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

    // categoryValsArr will become an array containing arrays instead of strings
    const aliasesArr = this.createTrimmedArr(aliases);
    const categoryValsArr = [...categoryVals];
    for (let i = 0; i < quantitativeIndexes.length; i++) {
      categoryValsArr[quantitativeIndexes[i]] = this.numberizeArr(this.createTrimmedArr(categoryValsArr[quantitativeIndexes[i]]));
    }
    for (let i = 0; i < qualitativeIndexes.length; i++) {
      categoryValsArr[qualitativeIndexes[i]] = this.createTrimmedArr(categoryValsArr[qualitativeIndexes[i]]);
    }

    const studentArr = [];
    aliasesArr.forEach((alias) => studentArr.push({ alias: alias }));
    categoryValsArr.forEach(
      (valArr, index) => MakeGroupsService.addEachToObj(studentArr, valArr, categoryNames[index])
    );
    const categoryNamesLevels = [...categoryNames]
    for (let i = 0; i < quantitativeIndexes.length; i++) {
      categoryValsArr[quantitativeIndexes[i]] = MakeGroupsService.getLevel(categoryValsArr[quantitativeIndexes[i]], groupSize);
      MakeGroupsService.addEachToObj(studentArr, categoryValsArr[quantitativeIndexes[i]], `${categoryNames[quantitativeIndexes[i]]} Level`);
      categoryNamesLevels[quantitativeIndexes[i]] = `${categoryNames[quantitativeIndexes[i]]} Level`;
    }

    if (groupingType === 'mixed') {
      this.handleMixedGroups(studentArr, groupSize, categoryNamesLevels, categoryNames);
    }
    if (groupingType === 'similar') {
      this.handleSimilarGroups(studentArr, groupSize, categoryNamesLevels, categoryNames);
    }
    history.push('/groups-made');
  }

  useSampleData = (datasetNum) => {
    this.setState(store['sampleData' + datasetNum])
  }

  handleClickCancel = () => {
    const { history } = this.props;
    history.goBack();
  }

  // METHODS RELATED TO HANDLESUBMIT
  handleMixedGroups = (studentArr, groupSize, categoryNamesLevels, categoryNames) => {
    const { addStudentArr, addCatNames } = this.context;
    const groups = createDifferentGroups(studentArr, groupSize, categoryNamesLevels);
    this.addGroupNumber(groups, studentArr);
    addStudentArr(studentArr);
    addCatNames(categoryNames);
  }

  handleSimilarGroups = (studentArr, groupSize, categoryNamesLevels, categoryNames) => {
    const { addStudentArr, addCatNames } = this.context;
    const groups = createSimilarGroups(studentArr, groupSize, categoryNamesLevels);
    this.addGroupNumber(groups, studentArr);
    addStudentArr(studentArr);
    addCatNames(categoryNames);
  }

  addGroupNumber = (groups, students) => {
    groups.forEach((group, index) => {
      group.forEach((groupMember) => {
        students.forEach((student) => {
          if (student.alias === groupMember.alias) {
            student.groupNum = index + 1;
          }
        })
      })
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
      return 'At least 3 aliases are required in order to generate groups.'
    }
  }

  validateAliasUniqueness = () => {
    const { aliases } = this.state;
    const aliasesArray = this.createTrimmedArr(aliases);
    const uniqueAliasesSet = new Set(aliasesArray);
    const uniqueAliasesArray = [...uniqueAliasesSet];
    if (uniqueAliasesArray.length !== aliasesArray.length) {
      return 'No duplicate aliases allowed.'
    }
  }

  validateDataSize = () => {
    const { aliases, groupSize } = this.state;
    const aliasesArray = this.createTrimmedArr(aliases);
    if ((aliasesArray.length / groupSize) < 2) {
      return `More aliases required in order to make groups of size ${groupSize}.`;
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

  // FIRST VISIT POP UP
  handleHidePopUp = () => {
    this.setState({ showPopUp: false });
  }

  // HELPER METHODS

  // creates array, trimming excess whitespace
  createTrimmedArr = (vals) => vals.split(`\n`).filter((val) => !!val.trim().length);

  // turns quantitative category values to numbers
  numberizeArr = (arr) => arr.map((val) => Number(val));

  render() {
    const { categoriesLength, showPopUp } = this.state;
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
          <div className="make-groups-page__form--after-textarea">
            {i === 0 ? '' : (
              <button
                type="button"
                onClick={(event) => { this.shiftCategoryLeft(event, i) }}
              >
                <div className="make-groups-page__button--container">
                    <div>
                    Increase Priority
                    </div>
                    <div>
                      <FontAwesomeIcon
                        className="make-groups-page__button--icon"
                        icon="plus"
                      />
                    </div>
                  </div>
              </button>
            )}
            {i === categoriesLength - 1 ? '' : (
              <button
                type="button"
                onClick={(event) => { this.shiftCategoryRight(event, i) }}
              >
                <div className="make-groups-page__button--container">
                    <div>
                    Decrease Priority
                    </div>
                    <div>
                      <FontAwesomeIcon
                        className="make-groups-page__button--icon"
                        icon="minus"
                      />
                    </div>
                  </div>
              </button>
            )}
          </div>
        </fieldset>
      )
    }
    return (
      <main className="make-groups-page">
        <div className="make-groups-page__body-container">
        <h1>Group Generator</h1>
        <form
          className="make-groups-page__form"
          onSubmit={this.handleSubmit}
        >
          <fieldset
            className="make-groups-page__form--grouping-characteristics"
          >
            <legend>Grouping characteristics:</legend>
            <div>
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
            </div>
            <div className="make-groups-page__form--radio-buttons">
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
                <ValidationError message={this.validateAliasUniqueness()} />
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
              <div className="make-groups-page__form--after-textarea"></div>
            </fieldset>
            {categories}
            <div className="make-groups-page__form--add-category-buttons">
              <button
                type="button"
                onClick={this.addCategory}
              >
                <div className="make-groups-page__button--container">
                    <div>
                    Add Category
                    </div>
                    <div>
                      <FontAwesomeIcon
                        className="make-groups-page__button--icon"
                        icon="plus"
                      />
                    </div>
                  </div>
              </button>
              <button
                type="button"
                onClick={this.removeCategory}
              >
                <div className="make-groups-page__button--container">
                    <div>
                    Remove Category
                    </div>
                    <div>
                      <FontAwesomeIcon
                        className="make-groups-page__button--icon"
                        icon="minus"
                      />
                    </div>
                  </div>
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
              <div className="make-groups-page__button--container">
                    <div>
                    Cancel
                    </div>
                    <div>
                      <FontAwesomeIcon
                        className="make-groups-page__button--icon"
                        icon="window-close"
                      />
                    </div>
                  </div>
            </button>
            <button type="submit">
            <div className="make-groups-page__button--container">
                    <div>
                    Generate Groups
                    </div>
                    <div>
                      <FontAwesomeIcon
                        className="make-groups-page__button--icon"
                        icon="arrow-right"
                      />
                    </div>
                  </div>
            </button>
          </div>
          <div className="make-groups-page__sampledata--buttons">
            <button
              type="button"
              onClick={() => this.useSampleData(1)}
            >
              <div className="make-groups-page__button--container">
                    <div>
                    See sample dataset
                    </div>
                    <div>
                      <span className="make-groups-page__button--icon">
                        1
                      </span>
                    </div>
                  </div>
          </button>
            <button
              type="button"
              onClick={() => this.useSampleData(2)}
            >
              <div className="make-groups-page__button--container">
                    <div>
                    See sample dataset
                    </div>
                    <div>
                      <span className="make-groups-page__button--icon">
                        2
                      </span>
                    </div>
                  </div>
          </button>
            <button
              type="button"
              onClick={() => this.useSampleData(3)}
            >
              <div className="make-groups-page__button--container">
                    <div>
                    See sample dataset
                    </div>
                    <div>
                      <span className="make-groups-page__button--icon">
                        3
                      </span>
                    </div>
                  </div>
          </button>
            <button
              type="button"
              onClick={() => this.useSampleData(4)}
            >
              <div className="make-groups-page__button--container">
                    <div>
                    See sample dataset
                    </div>
                    <div>
                      <span className="make-groups-page__button--icon">
                        4
                      </span>
                    </div>
                  </div>
          </button>
          </div>
        </form>
        <FirstVisitModal
          show={showPopUp}
          handleClose={this.handleHidePopUp}
        />
        </div>
      </main>
    )
  }
}
export default MakeGroupsPage;

MakeGroupsPage.contextType = MixEdContext;

