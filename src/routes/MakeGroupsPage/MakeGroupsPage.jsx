import React, { Component } from 'react';
import ValidationError from '../../components/ValidationError/ValidationError';

// import MixEdContext from '../../context/MixEdContext';



import './MakeGroupsPage.css';

// import createDifferentGroups from '../../services/groupingAlgorithms/differentGroups';
// import createSimilarGroups from '../../services/groupingAlgorithms/similarGroups';
// import MakeGroupsService from '../../services/make-groups-service';
// import store from '../../services/store';

// import ls from 'local-storage';


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
    }
  }

  // METHODS FOR FORM BUTTONS ONCLICK
  handleSubmit = (e) => {
    e.preventDefault();
    console.log('pretending to submit form')
  }

  useSampleData = () => {
    // TODO: update this function
    console.log('use sample data')
  }

  handleClickCancel = () => {
    const { history } = this.props;
    history.goBack();
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
      categoryVals: catValArr });
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
      categoryVals: catValArr });

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
      categoryVals: catValArr });
  }

  // METHODS FOR UPDATING FORM VALUES
  updateGroupSize = (e) => {
    this.setState({ groupSize: e.target.value });
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
    console.log(aliasesArray);
    if ((aliasesArray.length / groupSize) < 2) {
      return `More aliases required in order to make groups of size ${groupSize}`;
    }
  }

  validateTextareaLines = () => {
    // TODO: add to this function later
    // console.log('validating textarea lines');
  }

  // DRAG AND DROP METHODS

  handleDragStart = (event, categoryIndex) => {
    event.dataTransfer.setData("category", categoryIndex);
    console.log(`dragging ${categoryIndex}`);
  }

  handleDragOver = (event) => {
    event.preventDefault();
  }

  handleDrop = (event, dropAreaIndex) => {
    
    let indexToMove = Number(event.dataTransfer.getData("category"));
    console.log(`dropping index ${indexToMove} in index ${dropAreaIndex}`)
    const { categoryTypes, categoryNames, categoryVals } = this.state;
    const catTypeArr = [...categoryTypes];
    const catNameArr = [...categoryNames];
    const catValArr = [...categoryVals];
    const typeToMove = catTypeArr[indexToMove];
    catTypeArr.splice(dropAreaIndex, 0, typeToMove);
    catTypeArr.splice((indexToMove + 1), 1);
    const nameToMove = catNameArr[indexToMove];
    catNameArr.splice(dropAreaIndex, 0, nameToMove);
    catNameArr.splice((indexToMove + 1), 1);
    const valsToMove = catValArr[indexToMove];
    catValArr.splice(dropAreaIndex, 0, valsToMove);
    catValArr.splice((indexToMove + 1), 1);
    this.setState({ 
      categoryTypes: catTypeArr,
      categoryNames: catNameArr, 
      categoryVals: catValArr });
  }

  // HELPER METHODS

  // creates array, trimming excess whitespace
  createTrimmedArr = (vals) => vals.split(`/n`).filter((val) => !!val.trim().length);

  render() {
    const { categoriesLength } = this.state;
    let categories = [];
    for (let i = 0; i < categoriesLength; i++) {
      categories.push(
        // <div
        //   className="make-groups-page__form--dropzone"
        //   // onDragOver={this.handleDragOver}
        //   // onDrop={(event) => this.handleDrop(event, i)}
        //   // key={`category-index${i}`}
        // >
          <fieldset
            className="make-groups-page__form--fieldset"
            key={`category-index${i}`}
          >
            <legend>{`Category ${i + 1}:`}</legend>
            {/* TODO: add validateCatNumbers here */}
            {/* <div
              className="make-groups-page__form--draggable"
              onDragStart={(event) => this.handleDragStart(event, i)}
              draggable
            > */}
              <div className="make-groups-page__form--before-textarea">
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
            {/* </div> */}
            <div>
            {i === 0 ? '' : (
              <button
              type="button"
              onClick={(event) => {this.shiftCategoryLeft(event, i)}}
            >
              Shift Left
            </button>
            )}
            {i === categoriesLength - 1 ? '' : (
              <button
              type="button"
              onClick={(event) => {this.shiftCategoryRight(event, i)}}
            >
              Shift Right
            </button>
            )}
          </div>
          </fieldset>

        // </div>
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
              <legend>Alias (list of names or other identifier):</legend>
              <div className="make-groups-page__form--before-textarea">
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
            </fieldset>
            {/* TODO: ADD CATEGORIES and button to add categories here */}
            {categories}
            <div className="make-groups-page__form--category-buttons">
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
          </div>
          <div className="make-groups-page__form--buttons">
            <button
              type="button"
              onClick={this.handleClickCancel}
            >
              Cancel
          </button>
            <button
              type="button"
            // onClick={this.useSampleData} 
            >
              Use sample data
          </button>
            <button
              type="submit"
            >
              Generate Groups
          </button>
          </div>
        </form>
      </main>
    )
  }
}
export default MakeGroupsPage;

// MakeGroupsPage.contextType = MixEdContext;
