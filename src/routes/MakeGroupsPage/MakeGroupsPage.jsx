import React, { Component } from 'react';

import ValidationError from '../../components/ValidationError/ValidationError';

import './MakeGroupsPage.css';

class MakeGroupsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupSize: 2,
      groupingType: '',
      cat1Type: '',
      cat2Type: '',
      aliases: '',
      cat1Vals: '',
      cat2Vals: '',
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('pretending to submit form');
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

  updateCat1Vals = (e) => {
    this.setState({ cat1Vals: e.target.value });
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

  // validateGroupingType = () => {
  //   // Check that grouping type has been selected (RADIO)
  //   const { groupingType } = this.state;
  //   if (groupingType !== ('similar' || 'mixed')) {
  //     return 'Grouping type is required'
  //   }
  // }

  // validateDataTypeCat = () => {
  //   // Check that data type has been selected for each (RADIO) as long as there is also data in the textarea
  //   const { cat1Type } = this.state;
  //   if (cat1Type !== ('quantitative' || 'qualitative')) {
  //     return 'Data type is required'
  //   }
  // }

  validateNumbersCat1 = () => {
    const { cat1Vals } = this.state;
    const { cat1Type } = this.state;
    const cat1ValsArray = cat1Vals.split(`\n`).filter((val) => !!val.trim().length);
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
    const cat2ValsArray = cat2Vals.split(`\n`).filter((val) => !!val.trim().length);
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
    if (aliasesArray.length/groupSize < 2) {
      return `More aliases required in order to make groups of size ${groupSize}`;
    }
  }

  render() {
    return (
      <main className="make-groups-page">
        <form onSubmit={this.handleSubmit}>
        <h1>Group Generator</h1>
        <fieldset>
          <legend>Grouping characteristics:</legend>
          <label htmlFor="group-size">Group size (minimum):</label>
          <input
            name="group-size"
            id="group-size"
            type="number"
            min="2"
            max="20"
            defaultValue="2"
            // TODO: ensure this is appropriately bound, if not this.updateGroupSize.bind(this) may work better
            onChange={this.updateGroupSize}
          />
          <div>
            {/* <div>
              <ValidationError message={this.validateGroupingType()} />
            </div> */}
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
        <fieldset>
          <legend>Alias (list of names or other identifier):</legend>
          <div>
            <ValidationError message={this.validateAliases()} />
            <ValidationError message={this.validateDataSize()} />
          </div>
          <textarea
              id="aliases"
              name="aliases"
              rows="26"
              columns="20"
              placeholder="Enter aliases here, one on each line."
              value={this.state.aliases}
              onChange={this.updateAliases}
            />
        </fieldset>
        <fieldset>
          <legend>Primary category:</legend>
          <div>
            <div>
              {/* <ValidationError message={this.validateDataTypeCat()} /> */}
              <ValidationError message={this.validateNumbersCat1()} />
            </div>
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
            />
            <label htmlFor="cat1-qualitative">Qualitative (words)</label>
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
        </fieldset>
        <fieldset>
          <legend>Secondary category:</legend>
          <div>
            <div>
              {/* <ValidationError message={this.validateDataTypeCat()} /> */}
              <ValidationError message={this.validateNumbersCat2()} />
              <ValidationError message={this.validateCat2Vals()} />
            </div>
            <input
              name="cat2-type"
              id="cat2-quantitative"
              value="quantitative"
              type="radio"
              checked={this.state.cat2Type === 'quantitative'}
              onChange={this.updateCat2Type}
              />
            <label htmlFor="cat2-quantitative">Quantitative (numbers)</label>
            <input
              name="cat2-type"
              id="cat2-qualitative"
              value="qualitative"
              type="radio"
              checked={this.state.cat2Type === 'qualitative'}
              onChange={this.updateCat2Type}
            />
            <label htmlFor="cat2-qualitative">Qualitative (words)</label>
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
        </fieldset>
          <div>
            <ValidationError message={this.validateTextareaLines()} />
          </div>
          <button 
          type="button"
          >
            Cancel
          </button>
          <button
            type="button"
          >
            Use sample data
          </button>
          <button
            type="submit"
          >
            Generate Groups
          </button>
      </form>
      </main>
    );
  }
}

export default MakeGroupsPage;
