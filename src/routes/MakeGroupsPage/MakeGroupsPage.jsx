import React, { Component } from 'react';

import MixEdContext from '../../context/MixEdContext';

import ValidationError from '../../components/ValidationError/ValidationError';

import './MakeGroupsPage.css';

import createDifferentGroups from '../../services/groupingAlgorithms/differentGroups';
import createSimilarGroups from '../../services/groupingAlgorithms/similarGroups';
import MakeGroupsService from '../../services/make-groups-service';
import store from '../../services/store';

import ls from 'local-storage';


class MakeGroupsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupSize: 2,
      groupingType: '',
      cat1Type: '',
      cat2Type: '',
      aliases: '',
      cat1Name: '',
      cat1Vals: '',
      cat2Name: '',
      cat2Vals: '',
      primaryCat: 'cat1',

    }
  }

  componentDidMount() {
    const savedData = ls.get('data');
    if (!!savedData) {
      this.setState(savedData);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { addData, addStudentArr, addCatNames } = this.context;
    const { history } = this.props;
    const {
      groupSize,
      groupingType,
      cat1Type,
      cat2Type,
      aliases,
      cat1Name,
      cat1Vals,
      cat2Name,
      cat2Vals,
      primaryCat,
    } = this.state;
    addData(this.state);

    let primaryValsArr = primaryCat === 'cat1' ? this.createTrimmedArr(cat1Vals) : this.createTrimmedArr(cat2Vals);
    let secondaryValsArr = primaryCat === 'cat1' ? this.createTrimmedArr(cat2Vals) : this.createTrimmedArr(cat1Vals);
    let primaryCatName = primaryCat === 'cat1' ? cat1Name : cat2Name;
    let secondaryCatName = primaryCat === 'cat1' ? cat2Name : cat1Name;
    const primaryCatType = primaryCat === 'cat1' ? cat1Type : cat2Type;
    const secondaryCatType = primaryCat === 'cat1' ? cat2Type: cat1Type;

    // convert any numerical categories to numbers
    if (cat1Type === 'quantitative') {
      primaryValsArr = primaryValsArr.map((val) => Number(val));
    }
    if (cat2Type === 'quantitative') {
      secondaryValsArr = secondaryValsArr.map((val) => Number(val));
    }
    // create an arr of objs where each student with their data is an obj, add students and values
    const mixedStudentArray = [];
    const aliasesArray = this.createTrimmedArr(aliases);
    aliasesArray.forEach((alias) => mixedStudentArray.push({ alias: alias }));
    MakeGroupsService.addEachToObj(mixedStudentArray, primaryValsArr, primaryCatName);
    MakeGroupsService.addEachToObj(mixedStudentArray, secondaryValsArr, secondaryCatName);


    // if dealing with quantitative data, also separate into categorizable levels
    // (number of levels determined by group size)
    // and then add the level to the student object for any quantitative category
    // let createGroupsWith = [];
    if (primaryCatType === 'quantitative') {
      const studentScoreLevel = MakeGroupsService.getLevel(primaryValsArr, groupSize);
      primaryCatName = studentScoreLevel;
      MakeGroupsService.addEachToObj(mixedStudentArray, studentScoreLevel, primaryCat + ' Level');
      // createGroupsWith = [...mixedStudentArray]
    }
    // if (cat1Type === 'qualitative') {
    //   // reorder values
    //   createGroupsWith = MakeGroupsService.mostFrequentFirst(mixedStudentArray, cat1Name);
    // }
    if (secondaryCatType === 'quantitative') {
      const studentScoreLevel = MakeGroupsService.getLevel(secondaryValsArr, groupSize);
      secondaryCatName = studentScoreLevel;
      MakeGroupsService.addEachToObj(mixedStudentArray, studentScoreLevel, secondaryCatName + ' Level')
    }


    if (groupingType === 'mixed') {
      const groups = createDifferentGroups(mixedStudentArray, groupSize, [primaryCatName, secondaryCatName]);
      console.log(groups);
      this.addGroupNum(groups, mixedStudentArray);
      addCatNames(primaryCatName, secondaryCatName);
      addStudentArr(mixedStudentArray);
    }
    if (groupingType === 'similar') {
      const groups = createSimilarGroups(mixedStudentArray, groupSize, [primaryCatName, secondaryCatName]);
      console.log(groups);
      this.addGroupNum(groups, mixedStudentArray);
      addCatNames(primaryCatName, secondaryCatName);
      addStudentArr(mixedStudentArray);
    }
    history.push('/groups-made')
  }

  createTrimmedArr = (vals) => vals.split(`\n`).filter((val) => !!val.trim().length);

  addGroupNum = (groupArr, studentArr) => {
    // goes through the array elements of groups
    // within each innermost array, finds the student in the mixedStudentArray
    // adds their groupNumber (index of the outer array + 1) as a property
    groupArr.forEach((group, index) => {
      group.forEach((groupMem) => {
        studentArr.forEach((student) => {
          if (student.alias === groupMem.alias) {
            student.groupNum = (index + 1);
          }
        })
      })
    });
  }

  updateGroupSize = (e) => {
    this.setState({ groupSize: e.target.value });
  }

  updateGroupingType = (e) => {
    this.setState({ groupingType: e.target.value });
  }

  updateCat1Type = (e) => {
    this.setState({ cat1Type: e.target.value });
  }

  updateCat2Type = (e) => {
    this.setState({ cat2Type: e.target.value });
  }

  updateAliases = (e) => {
    this.setState({ aliases: e.target.value });
  }

  updateCat1Name = (e) => {
    this.setState({ cat1Name: e.target.value });
  }

  updateCat1Vals = (e) => {
    this.setState({ cat1Vals: e.target.value });
  }

  updateCat2Name = (e) => {
    this.setState({ cat2Name: e.target.value });
  }

  updateCat2Vals = (e) => {
    this.setState({ cat2Vals: e.target.value });
  }

  validateAliases = () => {
    // check that there are at least 3 aliases inputted
    const { aliases } = this.state;
    const aliasesArray = aliases.split(`\n`);
    if (aliasesArray.length < 3) {
      return 'At least 3 aliases are required in order to generate groups'
    }
  }

  validateTextareaLines = () => {
    // Check that each textarea that has input has the same number of lines
    const { aliases } = this.state;
    const { cat1Vals } = this.state;
    const { cat2Vals } = this.state;
    const aliasesArray = aliases.split(`\n`).filter((val) => !!val.trim().length);
    const cat1ValsArray = cat1Vals.split(`\n`).filter((val) => !!val.trim().length);
    const cat2ValsArray = cat2Vals.split(`\n`).filter((val) => !!val.trim().length);

    // checks for 3 valid conditions:
    // 1. if there are only aliases in the form (then will just make random groups)
    // 2. if there are aliases & category 1 values, and each has the same number of lines (then will only work with one category)
    // 3. if aliases and both categories are filled in, and each has the same number of lines (then will take into consideration both categories)
    const aliasesOnlyCondition = !cat1ValsArray[0] && !cat2ValsArray[0]; // stays true as long as nothing is in categories
    const aliasesAndCat1Vals = !cat2ValsArray[0] && (aliasesArray.length === cat1ValsArray.length);
    const aliasesAndAllCats = aliasesArray.length === cat1ValsArray.length && cat1ValsArray.length === cat2ValsArray.length;
    // as long as one of the conditions is true, no validation message
    if (!(aliasesOnlyCondition || aliasesAndCat1Vals || aliasesAndAllCats)) {
      return 'List of aliases, primary and secondary category data (if using) must all have the same number of lines.'
    }
  }

  validateNumbersCat1 = () => {
    const { cat1Vals } = this.state;
    const { cat1Type } = this.state;
    const cat1ValsArray = this.createTrimmedArr(cat1Vals);
    if (cat1Type === 'quantitative') {
      const cat1NumbersArray = cat1ValsArray.map((val) => Number(val));
      if (cat1NumbersArray.includes(NaN)) {
        return 'Quantitative data can only consist of numbers';
      }
    }
  }

  validateNumbersCat2 = () => {
    const { cat2Vals } = this.state;
    const { cat2Type } = this.state;
    const cat2ValsArray = this.createTrimmedArr(cat2Vals);
    if (cat2Type === 'quantitative') {
      const cat2NumbersArray = cat2ValsArray.map((val) => Number(val));
      if (cat2NumbersArray.includes(NaN)) {
        return 'Quantitative data can only consist of numbers';
      }
    }
  }

  validateCat2Vals = () => {
    const { cat2Vals } = this.state;
    const { cat1Vals } = this.state;
    if (cat1Vals === '' && cat2Vals !== '') {
      return 'Primary category data must be added';
    }
  }

  validateDataSize = () => {
    // Check that number of lines / group size is at least 2
    const { aliases } = this.state;
    const { groupSize } = this.state;
    const aliasesArray = aliases.split(`\n`).filter((val) => !!val.trim().length);
    if (aliasesArray.length / groupSize < 2) {
      return `More aliases required in order to make groups of size ${groupSize}`;
    }
  }

  useSampleData = () => {
    this.setState(store.sampleData);
  }

  handleClickCancel = () => {
    const { history } = this.props;
    history.goBack();
  }

  onDragStart = (event, catName) => {
    event.dataTransfer.setData("catName", catName);
  }

  onDragOver = (event) => {
    event.preventDefault();
  }

  onDrop = () => {
    console.log('dropping')
    const { primaryCat } = this.state;
    if (primaryCat === 'cat1') {
      this.setState({ primaryCat: 'cat2' })
    } else {
      this.setState({ primaryCat: 'cat1' })
    }
  }

  render() {
    const category1 = (
      <div
        className="make-groups-page__category--one"
        onDragStart={(event) => this.onDragStart(event, "category1")}
        draggable
      >
        <div>
          <ValidationError message={this.validateNumbersCat1()} />
        </div>
        <div>
          <input
            name="cat1-type"
            id="cat1-quantitative"
            value="quantitative"
            type="radio"
            checked={this.state.cat1Type === 'quantitative'}
            onChange={this.updateCat1Type}
            required
          />
          <label htmlFor="cat1-quantitative">Quantitative (numbers)</label>
          <input
            name="cat1-type"
            id="cat1-qualitative"
            value="qualitative"
            type="radio"
            checked={this.state.cat1Type === 'qualitative'}
            onChange={this.updateCat1Type}
            required
          />
          <label htmlFor="cat1-qualitative">Qualitative (words)</label>
        </div>
        <div>
          <label htmlFor="cat1-name">Category name:</label>{' '}
          <input
            name="cat1-name"
            id="cat1-name"
            type="text"
            value={this.state.cat1Name}
            onChange={this.updateCat1Name}
          />
        </div>
        <div>
          <textarea
            id="cat1-vals"
            name="cat1-vals"
            rows="26"
            columns="20"
            placeholder="Enter values here, one on each line."
            value={this.state.cat1Vals}
            onChange={this.updateCat1Vals}
          />
        </div>
      </div>
    );
    const category2 = (
      <div
        className="make-groups-page__category--two"
        onDragStart={(event) => this.onDragStart(event, "category2")}
        draggable
      >
        <div>
          <ValidationError message={this.validateNumbersCat2()} />
          {/* <ValidationError message={this.validateCat2Vals()} /> */}
        </div>
        <div>
          <input
            name="cat2-type"
            id="cat2-quantitative"
            value="quantitative"
            type="radio"
            checked={this.state.cat2Type === 'quantitative'}
            onChange={this.updateCat2Type}
            required
          />
          <label htmlFor="cat2-quantitative">Quantitative (numbers)</label>
          <input
            name="cat2-type"
            id="cat2-qualitative"
            value="qualitative"
            type="radio"
            checked={this.state.cat2Type === 'qualitative'}
            onChange={this.updateCat2Type}
            required
          />
          <label htmlFor="cat2-qualitative">Qualitative (words)</label>
        </div>
        <div>
          <label htmlFor="cat2-name">Category name:</label>{' '}
          <input
            name="cat2-name"
            id="cat2-name"
            type="text"
            value={this.state.cat2Name}
            onChange={this.updateCat2Name}
          />
        </div>
        <div>
          <textarea
            id="cat2-vals"
            name="cat2-vals"
            rows="26"
            columns="20"
            placeholder="Enter values here, one on each line."
            value={this.state.cat2Vals}
            onChange={this.updateCat2Vals}
          />
        </div>
      </div>
    );
    let primaryCategory;
    let secondaryCategory;
    const { primaryCat } = this.state;
    if (primaryCat === 'cat1') {
      primaryCategory = category1;
      secondaryCategory = category2;
    } else {
      secondaryCategory = category1;
      primaryCategory = category2;
    }

    return (
      <main className="make-groups-page">
        <h1>Group Generator</h1>
        <form className="make-groups-page__form" onSubmit={this.handleSubmit}>
          <fieldset>
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
            <fieldset className="make-groups-page__alias-section">
              <legend>Alias (list of names or other identifier):</legend>
              <div>
                <ValidationError message={this.validateAliases()} />
                <ValidationError message={this.validateDataSize()} />
              </div>
              <div className="make-groups-page__aliases">
                <textarea
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
            <fieldset className="make-groups-page__primary-section">
              <legend>Primary category:</legend>
              <div
                onDragOver={(event) => this.onDragOver(event)}
                onDrop={this.onDrop}
              >
                Click and drag to switch primary and secondary category.
                {primaryCategory}
              </div>
            </fieldset>
            <fieldset className="make-groups-page__secondary-section">
              <legend>Secondary category:</legend>
              <div
                onDragOver={(event) => this.onDragOver(event)}
                onDrop={this.onDrop}
              >
                Click and drag to switch primary and secondary category.
                {secondaryCategory}
              </div>
            </fieldset>
          </div>
          <div>
            <ValidationError message={this.validateTextareaLines()} />
          </div>
          <div>
            <button
              type="button"
              onClick={this.handleClickCancel}
            >
              Cancel
          </button>
            <button
              type="button"
              onClick={this.useSampleData}
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
    );
  }
}

export default MakeGroupsPage;

MakeGroupsPage.contextType = MixEdContext;
