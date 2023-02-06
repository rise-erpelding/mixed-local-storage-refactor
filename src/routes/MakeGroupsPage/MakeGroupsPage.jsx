/* eslint-disable no-extra-boolean-cast */
import React, { Component } from "react";
import ValidationError from "../../components/ValidationError/ValidationError";
import FirstVisitModal from "../../components/Modals/FirstVisitModal/FirstVisitModal";
import MixEdContext from "../../context/MixEdContext";
import createDifferentGroups from "../../services/groupingAlgorithms/differentGroups";
import createSimilarGroups from "../../services/groupingAlgorithms/similarGroups";
import MakeGroupsService from "../../services/make-groups-service";
// import { MakeGroupsForm } from '../../components/MakeGroupsForm/MakeGroupsForm';
import { ButtonTextIcon } from "../../components/ButtonTextIcon/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import store from "../../services/store";
import propTypes from "prop-types";
import "./MakeGroupsPage.css";
import ls from "local-storage";
import { NumberInputSection } from "../../components/MakeGroupsForm/src/form-inputs/number-input";
import { RadioInputSection } from "../../components/MakeGroupsForm/src/form-inputs/radio-input";
import { TextAreaInputSection } from "../../components/MakeGroupsForm/src/form-inputs/textarea-input";
import { TextInputSection } from "../../components/MakeGroupsForm/src/form-inputs/text-input";
import { createTrimmedArr, numberizeArr, swapArrItems } from "../../services/helpers/helperFunctions";
import { validateAliases, validateAliasUniqueness, validateDataSize, validateTextareaLines, validateCatNumbers } from "../../services/helpers/formValidationFunctions";

class MakeGroupsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      groupSize: 2,
      groupingType: "",
      aliases: "",
      categoriesLength: 1,
      categoryTypes: [""],
      categoryNames: [""],
      categoryVals: [""],
      savedData: "",
      showPopUp: true,
    };
  }

  componentDidMount() {
    const visited = ls.get("alreadyVisited");
    !!visited ? this.setState({ showPopUp: false }) : ls.set("alreadyVisited", true); // shows pop up on first visit and sets it so that it will not pop up next time
    const savedData = ls.get("data"); // get any data saved from last time
    !!savedData && this.setState(savedData);
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
    const { setDataInLocalStorage } = this.context;
    const { history } = this.props;
    const {
      groupSize,
      groupingType,
      aliases,
      categoryTypes,
      categoryNames,
      categoryVals,
    } = this.state;
    // adds data to local storage so it will be there if we navigate back to this page
    setDataInLocalStorage(this.state);

    const quantitativeIndexes = [];
    const qualitativeIndexes = [];
    categoryTypes.forEach((type, index) => {
      if (type === "quantitative") {
        quantitativeIndexes.push(index);
      } else {
        qualitativeIndexes.push(index);
      }
    });

    // categoryValsArr will become an array containing arrays instead of strings
    const aliasesArr = createTrimmedArr(aliases);
    
    const categoryValsArr = [...categoryVals];

    quantitativeIndexes.forEach((index) => {
      categoryValsArr[index] = numberizeArr(
        createTrimmedArr(categoryValsArr[index])
      );
    });
    qualitativeIndexes.forEach((index) => {
      categoryValsArr[index] = createTrimmedArr(
        categoryValsArr[index]
      );
    });

    const studentArr = [];
    aliasesArr.forEach((alias) => studentArr.push({ alias: alias }));
    categoryValsArr.forEach((valArr, index) =>
      MakeGroupsService.addEachToObj(studentArr, valArr, categoryNames[index])
    );
    const categoryNamesLevels = [...categoryNames];

    quantitativeIndexes.forEach((index) => {
      categoryValsArr[index] = MakeGroupsService.getLevel(categoryValsArr[index], groupSize);
      MakeGroupsService.addEachToObj(studentArr, categoryValsArr[index], `${categoryNames[index]} Level`);
      categoryNamesLevels[index] = `${categoryNames[index]} Level`;
    });

    if (groupingType === "mixed") {
      this.handleMixedGroups(
        studentArr,
        groupSize,
        categoryNamesLevels,
        categoryNames
      );
    }
    if (groupingType === "similar") {
      this.handleSimilarGroups(
        studentArr,
        groupSize,
        categoryNamesLevels,
        categoryNames
      );
    }
    window.scrollTo({ top: 0 });
    history.push("/groups-made");
  };

  useSampleData = (data) => {
    this.setState(data);
  };

  handleClickCancel = () => {
    const { history } = this.props;
    history.goBack();
  };

  // METHODS RELATED TO HANDLESUBMIT
  handleMixedGroups = (
    studentArr,
    groupSize,
    categoryNamesLevels,
    categoryNames
  ) => {
    const { setStudentArrInLocalStorage, setCatNamesInLocalStorage } = this.context;
    const groups = createDifferentGroups(
      studentArr,
      groupSize,
      categoryNamesLevels
    );
    this.addGroupNumber(groups, studentArr);
    setStudentArrInLocalStorage(studentArr);
    setCatNamesInLocalStorage(categoryNames);
  };

  handleSimilarGroups = (
    studentArr,
    groupSize,
    categoryNamesLevels,
    categoryNames
  ) => {
    const { setStudentArrInLocalStorage, setCatNamesInLocalStorage } = this.context;
    const groups = createSimilarGroups(
      studentArr,
      groupSize,
      categoryNamesLevels
    );
    this.addGroupNumber(groups, studentArr);
    setStudentArrInLocalStorage(studentArr);
    setCatNamesInLocalStorage(categoryNames);
  };

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
  };

  // METHODS FOR BUTTONS THAT CONTROL CATEGORIES
  addCategory = () => {
    let { categoriesLength } = this.state;
    categoriesLength++;
    this.setState({ categoriesLength });
    const { categoryTypes, categoryNames, categoryVals } = this.state;
    this.setState({
      categoryTypes: [...categoryTypes, ""],
      categoryNames: [...categoryNames, ""],
      categoryVals: [...categoryVals, ""],
    });
  };

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
      categoryVals: catValArr,
    });
  };

  shiftCategory(index, direction = 'left') {
    const { categoryTypes, categoryNames, categoryVals } = this.state;
    const desiredIndex = direction === 'right' ? index + 1 : index - 1;
    this.setState({
      categoryTypes: swapArrItems(categoryTypes, index, desiredIndex),
      categoryNames: swapArrItems(categoryNames, index, desiredIndex),
      categoryVals: swapArrItems(categoryVals, index, desiredIndex),
    });
  }

  // METHODS FOR UPDATING FORM VALUES
  updateGroupSize = (e) => {
    let groupSize = parseInt(e.target.value);
    if (isNaN(groupSize)) {
      groupSize = "";
    }
    this.setState({ groupSize });
  };

  updateGroupingType = (e) => {
    this.setState({ groupingType: e.target.value });
  };

  updateAliases = (e) => {
    this.setState({ aliases: e.target.value });
  };

  updateCategoryType = (event, index) => {
    const { categoryTypes } = this.state;
    const catTypeArr = [...categoryTypes];
    catTypeArr.splice(index, 1, event.target.value);
    this.setState({ categoryTypes: catTypeArr });
  };

  updateCategoryName = (event, index) => {
    const { categoryNames } = this.state;
    const catNameArr = [...categoryNames];
    catNameArr.splice(index, 1, event.target.value);
    this.setState({ categoryNames: catNameArr });
  };

  updateCategoryVals = (event, index) => {
    const { categoryVals } = this.state;
    const catValArr = [...categoryVals];
    catValArr.splice(index, 1, event.target.value);
    this.setState({ categoryVals: catValArr });
  };

  // FIRST VISIT POP UP
  handleHidePopUp = () => {
    this.setState({ showPopUp: false });
  };

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
                this.state.categoryTypes[i] === "quantitative",
                this.state.categoryTypes[i] === "qualitative",
              ]}
              explanation="Values corresponding to a category."
              labels={["Quantitative (numbers)", "Qualitative (words)"]}
              inputGroupName={`cat${i}-type`}
              inputIds={[`cat${i}-quantitative`, `cat${i}-qualitative`]}
              onChangeFunc={(event) => {
                this.updateCategoryType(event, i);
              }}
              required
              values={["quantitative", "qualitative"]}
            />
            <TextInputSection
              className="make-groups-page__form--category-name"
              label="Category name:"
              name={`cat${i}-name`}
              onChange={(event) => this.updateCategoryName(event, i)}
              required
              value={this.state.categoryNames[i]}
            />
          </div>
          <TextAreaInputSection
            label="Values:"
            name={`cat${i}-vals`}
            onChange={(event) => this.updateCategoryVals(event, i)}
            placeholderText="Enter values here, one on each line."
            value={this.state.categoryVals[i]}
          />
          <div className="make-groups-page__form--after-textarea">
            {i === 0 ? (
              ""
            ) : (
              <ButtonTextIcon
                buttonText="Increase Priority"
                buttonIcon={<FontAwesomeIcon icon="plus" />}
                handleClick={() => this.shiftCategory(i, 'left')}
              />
            )}
            {i === categoriesLength - 1 ? (
              ""
            ) : (
              <ButtonTextIcon
                buttonText="Decrease Priority"
                buttonIcon={<FontAwesomeIcon icon="minus" />}
                handleClick={() => this.shiftCategory(i, 'right')}
              />
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
          <form className="make-groups-page__form" onSubmit={this.handleSubmit}>
            {/* break out grouping characteristics component */}
            <fieldset className="make-groups-page__form--grouping-characteristics">
              <legend>Grouping characteristics:</legend>
              <NumberInputSection
                explanation="Choose minimum group size (slightly larger groups will be made as needed)."
                label="Group size:"
                max={20}
                min={2}
                name="group-size"
                onChange={this.updateGroupSize}
                value={this.state.groupSize}
              />
              <RadioInputSection
                checkedStatuses={[
                  this.state.groupingType === "similar",
                  this.state.groupingType === "mixed",
                ]}
                explanation="Choose whether members within a group should have similar 
                traits or differing traits."
                labels={[
                  "Group members are similar",
                  "Group members are diverse",
                ]}
                inputGroupName="grouping-type"
                inputIds={["grouping-similar", "grouping-mixed"]}
                onChangeFunc={this.updateGroupingType}
                required
                values={["similar", "mixed"]}
              />
            </fieldset>
            {/* break out student data */}
            <div className="make-groups-page__form--student-data">
              <fieldset className="make-groups-page__form--fieldset">
                <legend>Aliases:</legend>
                <div className="make-groups-page__form--before-textarea">
                  <div className="make-groups-page__form--explanation">
                    List of names or other identifier.
                  </div>
                  <ValidationError message={validateAliases(this.state.aliases)} />
                  <ValidationError message={validateAliasUniqueness(this.state.aliases)} />
                  <ValidationError message={validateDataSize(this.state.aliases, this.state.groupSize)} />
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
              <ValidationError message={validateTextareaLines(this.state.aliases, this.state.categoryVals)} />
              <ValidationError message={validateCatNumbers(this.state.categoryTypes,this.state.categoryVals)} />
            </div>
            {/* break this out into something called form controls or something */}
            <div className="make-groups-page__form--buttons">
              <ButtonTextIcon
                buttonIcon={<FontAwesomeIcon icon="plus" />}
                buttonText="Add Category"
                handleClick={this.addCategory}
              />
              <ButtonTextIcon
                buttonIcon={<FontAwesomeIcon icon="minus" />}
                buttonText="Remove Category"
                handleClick={this.removeCategory}
              />
              <ButtonTextIcon
                buttonIcon={<FontAwesomeIcon icon="window-close" />}
                buttonText="Cancel Generator"
                handleClick={this.handleClickCancel}
              />
              <ButtonTextIcon
                buttonIcon={<FontAwesomeIcon icon="arrow-right" />}
                buttonText="Generate Groups"
                customContainerClass="bold"
                handleClick={null}
                type="submit"
              />
            </div>
            <div className="make-groups-page__sampledata--buttons">
              {store.map((dataset, index) => (
                <ButtonTextIcon
                  key={index}
                  buttonIcon={<span>{index + 1}</span>}
                  buttonText="See sample dataset"
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
