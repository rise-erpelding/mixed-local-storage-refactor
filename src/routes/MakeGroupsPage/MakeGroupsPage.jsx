/* eslint-disable no-extra-boolean-cast */
import React, { Component } from 'react';
import ValidationError from '../../components/ValidationError/ValidationError';
import FirstVisitModal from '../../components/Modals/FirstVisitModal/FirstVisitModal';
import MixEdContext from '../../context/MixEdContext';
import createDifferentGroups from '../../services/groupingAlgorithms/differentGroups';
import createSimilarGroups from '../../services/groupingAlgorithms/similarGroups';
import MakeGroupsService from '../../services/make-groups-service';
// import { MakeGroupsForm } from '../../components/MakeGroupsForm/MakeGroupsForm';
import { ButtonTextIcon } from '../../components/ButtonTextIcon/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import store from '../../services/store';
import propTypes from 'prop-types';
import './MakeGroupsPage.css';
import ls from 'local-storage';
import { NumberInputSection } from '../../components/MakeGroupsForm/src/form-inputs/number-input';
import { RadioInputSection } from '../../components/MakeGroupsForm/src/form-inputs/radio-input';

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
    };
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
  /**
   * handleSubmit preps data for the sorting function to get the groups:
   * -Keeps track of which indexes in categories arrays are qualitative vs quantitative
   * -Turns a set of quantitative category vals into a number array, turn a set of qualitative
   * category vals into an array of strings, and turn aliases into an array (of strings).
   * -Combines categoryTypes, categoryNames, categoryVals, and aliases into an array of objects,
   * one object with info for each student.
   * -Also adds a level to each object for any quantitative variables--only as many levels as
   * number of people in a group, which is most helpful for making mixed groups. Levels are
   * assigned by sorting array, designating a number of cutoff points corresponding to number
   * of levels, the interval between each set of cutoff points corresponds to a level.
   * -Then send array of objects to grouping algorithm according to whether we want mixed
   * or similar groups.
   * -Then navigates to /groups-made
   */
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
    // adds data to local storage so it will be there if we navigate back to this page
    addData(this.state);

    const quantitativeIndexes = [];
    const qualitativeIndexes = [];
    categoryTypes.forEach((type, index) => {
      if (type === 'quantitative') {
        quantitativeIndexes.push(index);
      }
      else {
        qualitativeIndexes.push(index);
      }
    });

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
    const categoryNamesLevels = [...categoryNames];
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
    window.scrollTo({ top: 0 });
    history.push('/groups-made');
  }

  useSampleData = (data) => {
    this.setState(data);
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
        });
      });
    });
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

  // shiftCategoryLeft and shiftCategoryRight can be more dynamic, set up a shiftCategory method instead
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
    console.log(typeof groupSize)
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
      return 'At least 3 aliases are required in order to generate groups.';
    }
  }

  validateAliasUniqueness = () => {
    const { aliases } = this.state;
    const aliasesArray = this.createTrimmedArr(aliases);
    const uniqueAliasesSet = new Set(aliasesArray);
    const uniqueAliasesArray = [...uniqueAliasesSet];
    if (uniqueAliasesArray.length !== aliasesArray.length) {
      return 'No duplicate aliases allowed.';
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
      return `Alias values and category values must all have the same number of lines.`;
    }
  }

  validateCatNumbers = () => {
    const { categoryTypes, categoryVals } = this.state;
    const quantitativeIndexes = [];
    categoryTypes.forEach((type, index) => {
      if (type === 'quantitative') {
        quantitativeIndexes.push(index);
      }
    });
    for (let i = 0; i < quantitativeIndexes.length; i++) {
      const categoryArr = this.createTrimmedArr(categoryVals[quantitativeIndexes[i]]);
      const numbersArr = this.numberizeArr(categoryArr);
      if (numbersArr.includes(NaN)) {
        return 'Quantitative data can only consist of numbers.';
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
            <RadioInputSection
              checkedStatuses={[
                this.state.categoryTypes[i] === 'quantitative',
                this.state.categoryTypes[i] === 'qualitative',
              ]}
              explanation='Values corresponding to a category.'
              labels={['Quantitative (numbers)', 'Qualitative (words)']}
              inputGroupName={`cat${i}-type`}
              inputIds={[`cat${i}-quantitative`, `cat${i}-qualitative`]}
              onChangeFunc={(event) => {this.updateCategoryType(event, i)}}
              required
              values={['quantitative', 'qualitative']}
            />
            <div className="make-groups-page__form--category-name">
              <label htmlFor={`cat${i}-name`}>Category name:</label>{" "}
              <input
                name={`cat${i}-name`}
                id={`cat${i}-name`}
                type="text"
                value={this.state.categoryNames[i]}
                onChange={(event) => {
                  this.updateCategoryName(event, i);
                }}
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
              onChange={(event) => {
                this.updateCategoryVals(event, i);
              }}
            />
          </div>
          <div className="make-groups-page__form--after-textarea">
            {i === 0 ? (
              ""
            ) : (
              <button
                type="button"
                onClick={(event) => {
                  this.shiftCategoryLeft(event, i);
                }}
              >
                <div className="make-groups-page__button--container">
                  <div>Increase Priority</div>
                  <div className="make-groups-page__button--icon-container">
                    <FontAwesomeIcon icon="plus" />
                  </div>
                </div>
              </button>
            )}
            {i === categoriesLength - 1 ? (
              ""
            ) : (
              <button
                type="button"
                onClick={(event) => {
                  this.shiftCategoryRight(event, i);
                }}
              >
                <div className="make-groups-page__button--container">
                  <div>Decrease Priority</div>
                  <div className="make-groups-page__button--icon-container">
                    <FontAwesomeIcon icon="minus" />
                  </div>
                </div>
              </button>
            )}
          </div>
        </fieldset>
      );
    }
    return (
      <main className="make-groups-page">
        <div className="make-groups-page__body-container">
        <h1>Group Generator</h1>
        {/* create a separate form component, pass in classname and onSubmit as props */}
        <form
          className="make-groups-page__form"
          onSubmit={this.handleSubmit}
        >
          {/* break out grouping characteristics component */}
          <fieldset
            className="make-groups-page__form--grouping-characteristics"
          >
            <legend>Grouping characteristics:</legend>
              <NumberInputSection
                explanation='Choose minimum group size (slightly larger groups will be made as needed).'
                label='Group size:'
                max={20}
                min={2}
                name='group-size'
                onChange={this.updateGroupSize}
                value={this.state.groupSize}
              />
              <RadioInputSection
                checkedStatuses={[this.state.groupingType === 'similar', this.state.groupingType === 'mixed']}
                explanation='Choose whether members within a group should have similar 
                traits or differing traits.'
                labels={['Group members are similar', 'Group members are diverse']}
                inputGroupName='grouping-type'
                inputIds={['grouping-similar', 'grouping-mixed']}
                onChangeFunc={this.updateGroupingType}
                required
                values={['similar', 'mixed']}
              />
          </fieldset>
          {/* break out student data */}
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
            
          </div>
          <div>
            <ValidationError message={this.validateTextareaLines()} />
            <ValidationError message={this.validateCatNumbers()} />
          </div>
          {/* break this out into something called form controls or something */}
          <div className="make-groups-page__form--buttons">
            <ButtonTextIcon
              buttonIcon={<FontAwesomeIcon icon="plus"/>}
              buttonText='Add Category'
              handleClick={this.addCategory}
            />
            <ButtonTextIcon
              buttonIcon={<FontAwesomeIcon icon="minus"/>}
              buttonText='Remove Category'
              handleClick={this.removeCategory}
            />
            <ButtonTextIcon
              buttonIcon={<FontAwesomeIcon icon="window-close" />}
              buttonText='Cancel Generator'
              handleClick={this.handleClickCancel}
            />
            <ButtonTextIcon
              buttonIcon={<FontAwesomeIcon icon="arrow-right" />}
              buttonText='Generate Groups'
              customContainerClass='bold'
              handleClick={null}
              type='submit'
            />
          </div>
          <div className="make-groups-page__sampledata--buttons">
            {store.map((dataset, index) => (
              <ButtonTextIcon
                key={index}
                buttonIcon={<span>{index + 1}</span>}
                buttonText='See sample dataset'
                handleClick={() => this.useSampleData(dataset)}
              />
            ))}
          </div>
        </form>
        <FirstVisitModal
          show={showPopUp}
          handleClose={this.handleHidePopUp}
        />
        </div>
      </main>
    );
  }
}
export default MakeGroupsPage;

MakeGroupsPage.defaultProps = {
  history: {},
};

MakeGroupsPage.propTypes = {
  history: propTypes.shape({
    action: propTypes.string,
    block: propTypes.func,
    createHref: propTypes.func,
    go: propTypes.func,
    goBack: propTypes.func,
    goForward: propTypes.func,
    length: propTypes.number,
    listen: propTypes.func,
    location: propTypes.object,
    push: propTypes.func,
    replace: propTypes.func,
  }),
};

MakeGroupsPage.contextType = MixEdContext;
