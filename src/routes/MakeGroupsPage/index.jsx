import React, { useState, useEffect, useContext } from "react";
import propTypes from "prop-types";
import ls from "local-storage";
import MixEdContext from "../../context/MixEdContext";
import { adaptGroupData } from "../../services/helpers/adaptGroupData";
import createDifferentGroups from "../../services/groupingAlgorithms/differentGroups";
import createSimilarGroups from "../../services/groupingAlgorithms/similarGroups";
import MakeGroupsService from "../../services/make-groups-service";
import { swapArrItems } from "../../services/helpers/helperFunctions";
import { NumberInputSection } from "../../components/MakeGroupsForm/src/form-inputs/number-input";
import { RadioInputSection } from "../../components/MakeGroupsForm/src/form-inputs/radio-input";
import { TextAreaInputSection } from "../../components/MakeGroupsForm/src/form-inputs/textarea-input";
import { TextInputSection } from "../../components/MakeGroupsForm/src/form-inputs/text-input";
import ValidationError from "../../components/ValidationError/ValidationError";
import { validateAliases, validateAliasUniqueness, validateDataSize, validateTextareaLines, validateCatNumbers } from "../../services/helpers/formValidationFunctions";
import { FormActions } from "../../components/MakeGroupsForm/button-groups";
import store from "../../services/store";
import { ButtonTextIcon } from "../../components/ButtonTextIcon/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FirstVisitModal from "../../components/Modals/FirstVisitModal/FirstVisitModal";
import "./MakeGroupsPage.css";

export const MakeGroupsPage = (props) => {
  const {
    history,
  } = props;

  const [aliases, setAliases] = useState("");
  const [categoriesLength, setCategoriesLength] = useState(1);
  const [categoryNames, setCategoryNames] = useState([""]);
  const [categoryTypes, setCategoryTypes] = useState([""]);
  const [categoryVals, setCategoryVals] = useState([""]);
  // const [error, setError] = useState(null);
  const [groupingType, setGroupingType] = useState("");
  const [groupSize, setGroupSize] = useState(2);
  const [savedData, setSavedData] = useState([""]);
  const [showPopUp, setShowPopUp] = useState(true);

  const dataObj = {
    aliases,
    categoriesLength,
    categoryNames,
    categoryTypes,
    categoryVals,
    groupingType,
    groupSize,
    savedData,
    showPopUp,
  };

  const {
    setDataInLocalStorage,
    setStudentArrInLocalStorage,
    setCatNamesInLocalStorage,
  } = useContext(MixEdContext);

  useEffect(() => {
    const visited = ls.get("alreadyVisited");
    // eslint-disable-next-line no-extra-boolean-cast
    !!visited ? setShowPopUp(false) : ls.set("alreadyVisited", true);
    const savedData = ls.get("data");
    !!savedData && setSavedData(savedData);
  }, []);

  const injectSampleData = (data) => {
    const {
      groupSize,
      groupingType,
      categoriesLength,
      categoryTypes,
      categoryNames,
      categoryVals,
      aliases
    } = data;
    setGroupSize(groupSize);
    setGroupingType(groupingType);
    setCategoriesLength(categoriesLength);
    setCategoryTypes(categoryTypes);
    setCategoryNames(categoryNames);
    setCategoryVals(categoryVals);
    setAliases(aliases);
  };

  const addCategory = () => {
    setCategoriesLength(categoriesLength + 1);
    setCategoryTypes([...categoryTypes, ""]);
    setCategoryNames([...categoryNames, ""]);
    setCategoryVals([...categoryVals, ""]);
  };

  const removeCategory = () => {
    setCategoriesLength(categoriesLength - 1);
    const catTypeArr = [...categoryTypes];
    const catNameArr = [...categoryNames];
    const catValArr = [...categoryVals];
    catTypeArr.pop();
    catNameArr.pop();
    catValArr.pop();
    setCategoryTypes(catTypeArr);
    setCategoryNames(catNameArr);
    setCategoryVals(catValArr);
  };

  const shiftCategory = (index, direction = 'left') => {
    const desiredIndex = direction === 'right' ? index + 1 : index - 1;
    setCategoryTypes(swapArrItems(categoryTypes, index, desiredIndex));
    setCategoryNames(swapArrItems(categoryNames, index, desiredIndex));
    setCategoryVals(swapArrItems(categoryVals, index, desiredIndex));
  };

  const updateGroupSize = (e) => {
    let groupSize = parseInt(e.target.value);
    if (isNaN(groupSize)) {
      groupSize = "";
    }
    setGroupSize(groupSize);
  };

  // this is pretty repetitive we can probably condense
  const updateCategoryType = (event, index) => {
    const catTypeArr = [...categoryTypes];
    catTypeArr.splice(index, 1, event.target.value);
    setCategoryTypes(catTypeArr);
  };

  const updateCategoryName = (event, index) => {
    const catNameArr = [...categoryNames];
    catNameArr.splice(index, 1, event.target.value);
    setCategoryNames(catNameArr);
  };

  const updateCategoryVals = (event, index) => {
    const catValArr = [...categoryVals];
    catValArr.splice(index, 1, event.target.value);
    setCategoryVals(catValArr);
  };

  const handleMixedGroups = (
    studentArr,
    groupSize,
    categoryNamesLevels,
    categoryNames
  ) => {
    const groups = createDifferentGroups(
      studentArr,
      groupSize,
      categoryNamesLevels
    );
    MakeGroupsService.addGroupNumber(groups, studentArr);
    setStudentArrInLocalStorage(studentArr);
    setCatNamesInLocalStorage(categoryNames);
  };

  const handleSimilarGroups = (
    studentArr,
    groupSize,
    categoryNamesLevels,
    categoryNames
  ) => {
    const groups = createSimilarGroups(
      studentArr,
      groupSize,
      categoryNamesLevels
    );
    MakeGroupsService.addGroupNumber(groups, studentArr);
    setStudentArrInLocalStorage(studentArr);
    setCatNamesInLocalStorage(categoryNames);
  };

  const handleClickCancel = () => {
    history.goBack();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setDataInLocalStorage(dataObj);

    const { studentArr, categoryNamesLevels} = adaptGroupData(categoryTypes, aliases, categoryVals, categoryNames, groupSize);

    if (groupingType === "mixed") {
      handleMixedGroups(
        studentArr,
        groupSize,
        categoryNamesLevels,
        categoryNames
      );
    }
    if (groupingType === "similar") {
      handleSimilarGroups(
        studentArr,
        groupSize,
        categoryNamesLevels,
        categoryNames
      );
    }

    window.scrollTo({ top: 0 });
    history.push("/groups-made");
  };

  // this totally needs a refactor
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
              categoryTypes[i] === "quantitative",
              categoryTypes[i] === "qualitative",
            ]}
            explanation="Values corresponding to a category."
            labels={["Quantitative (numbers)", "Qualitative (words)"]}
            inputGroupName={`cat${i}-type`}
            inputIds={[`cat${i}-quantitative`, `cat${i}-qualitative`]}
            onChangeFunc={(event) => {
              updateCategoryType(event, i);
            }}
            required
            values={["quantitative", "qualitative"]}
          />
          <TextInputSection
            className="make-groups-page__form--category-name"
            label="Category name:"
            name={`cat${i}-name`}
            onChange={(event) => updateCategoryName(event, i)}
            required
            value={categoryNames[i]}
          />
        </div>
        <TextAreaInputSection
          label="Values:"
          name={`cat${i}-vals`}
          onChange={(event) => updateCategoryVals(event, i)}
          placeholderText="Enter values here, one on each line."
          value={categoryVals[i]}
        />
        <div className="make-groups-page__form--after-textarea">
          {i === 0 ? (
            ""
          ) : (
            <ButtonTextIcon
              buttonText="Increase Priority"
              buttonIcon={<FontAwesomeIcon icon="plus" />}
              handleClick={() => shiftCategory(i, 'left')}
            />
          )}
          {i === categoriesLength - 1 ? (
            ""
          ) : (
            <ButtonTextIcon
              buttonText="Decrease Priority"
              buttonIcon={<FontAwesomeIcon icon="minus" />}
              handleClick={() => shiftCategory(i, 'right')}
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
        <form className="make-groups-page__form" onSubmit={handleSubmit}>
          {/* break out grouping characteristics component */}
          <fieldset className="make-groups-page__form--grouping-characteristics">
            <legend>Grouping characteristics:</legend>
            <NumberInputSection
              explanation="Choose minimum group size (slightly larger groups will be made as needed)."
              label="Group size:"
              max={20}
              min={2}
              name="group-size"
              onChange={updateGroupSize}
              value={groupSize}
            />
            <RadioInputSection
              checkedStatuses={[
                groupingType === "similar",
                groupingType === "mixed",
              ]}
              explanation="Choose whether members within a group should have similar 
              traits or differing traits."
              labels={[
                "Group members are similar",
                "Group members are diverse",
              ]}
              inputGroupName="grouping-type"
              inputIds={["grouping-similar", "grouping-mixed"]}
              onChangeFunc={(e) => setGroupingType(e.target.value)}
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
                <ValidationError message={validateAliases(aliases)} />
                <ValidationError message={validateAliasUniqueness(aliases)} />
                <ValidationError message={validateDataSize(aliases, groupSize)} />
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
                  value={aliases}
                  onChange={(e) => setAliases(e.target.value)}
                />
              </div>
              <div className="make-groups-page__form--after-textarea"></div>
            </fieldset>
            {categories}
          </div>
          <div>
            <ValidationError message={validateTextareaLines(aliases, categoryVals)} />
            <ValidationError message={validateCatNumbers(categoryTypes, categoryVals)} />
          </div>
          <FormActions
            addCategory={addCategory}
            removeCategory={removeCategory}
            clickCancel={handleClickCancel}
          />
          <div className="make-groups-page__sampledata--buttons">
            {store.map((dataset, index) => (
              <ButtonTextIcon
                key={index}
                buttonIcon={<span>{index + 1}</span>}
                buttonText="See sample dataset"
                handleClick={() => injectSampleData(dataset)}
              />
            ))}
          </div>
        </form>
        <FirstVisitModal
          show={showPopUp}
          handleClose={() => setShowPopUp(false)}
        />
      </div>
    </main>
  );
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