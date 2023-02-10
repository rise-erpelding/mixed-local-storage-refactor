import React, { useState, useEffect, useContext } from "react";
import propTypes from "prop-types";
import ls from "local-storage";
import MixEdContext from "../../context/MixEdContext";
import { adaptGroupData } from "../../services/helpers/adaptGroupData";
import createDifferentGroups from "../../services/groupingAlgorithms/differentGroups";
import createSimilarGroups from "../../services/groupingAlgorithms/similarGroups";
import MakeGroupsService from "../../services/make-groups-service";
import { swapArrItems } from "../../services/helpers/helperFunctions";
import ValidationError from "../../components/ValidationError/ValidationError";
import { validateAliases, validateAliasUniqueness, validateDataSize, validateTextareaLines, validateCatNumbers } from "../../services/helpers/formValidationFunctions";
import { FormActions, SampleDataButtons } from "../../components/MakeGroupsForm/button-groups";
import store from "../../services/store";
import FirstVisitModal from "../../components/Modals/FirstVisitModal/FirstVisitModal";
import "./MakeGroupsPage.css";
import { AliasesField, CategoryField, GroupingCharacteristicsField } from "../../components/MakeGroupsForm/fieldsets";

export const MakeGroupsPage = (props) => {
  const {
    history,
  } = props;

  const [aliases, setAliases] = useState("");
  const [categoriesLength, setCategoriesLength] = useState(1);
  const [categoryNames, setCategoryNames] = useState([""]);
  const [categoryTypes, setCategoryTypes] = useState([""]);
  const [categoryVals, setCategoryVals] = useState([""]);
  const [groupingType, setGroupingType] = useState("");
  const [groupSize, setGroupSize] = useState(2);
  const [showPopUp, setShowPopUp] = useState(true);

  const dataObj = {
    aliases,
    categoriesLength,
    categoryNames,
    categoryTypes,
    categoryVals,
    groupingType,
    groupSize,
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
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!savedData) {
      setAliases(savedData.aliases);
      setCategoriesLength(savedData.categoriesLength);
      setCategoryNames(savedData.categoryNames);
      setCategoryTypes(savedData.categoryTypes);
      setCategoryVals(savedData.categoryVals);
      setGroupSize(savedData.groupSize);
      setGroupingType(savedData.groupingType);
    }
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

  const updateCategoryArr = (event, index, arr, updateFn) => {
    const arrCopy = [...arr];
    arrCopy.splice(index, 1, event.target.value);
    updateFn(arrCopy);
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

  let categoriesFields = [];
  for (let catIndex = 0; catIndex < categoriesLength; catIndex++) {
    categoriesFields.push(
      <CategoryField
        key={`category-index${catIndex}`}
        className="make-groups-page__form--fieldset"
        fieldName={`Category ${catIndex + 1}:`}
        isQuantitative={categoryTypes[catIndex] === "quantitative"}
        categoryNumber={catIndex}
        arrUpdateFunc={updateCategoryArr}
        categoryTypes={categoryTypes}
        categoryNames={categoryNames}
        categoryVals={categoryVals}
        categoryTypesUpdateFunc={setCategoryTypes}
        categoryNamesUpdateFunc={setCategoryNames}
        categoryValsUpdateFunc={setCategoryVals}
        categoriesLength={categoriesLength}
        shiftCategoryFunc={shiftCategory}
      />
    );
  }

  return (
    <main className="make-groups-page">
      <div className="make-groups-page__body-container">
        <h1>Group Generator</h1>
        <form className="make-groups-page__form" onSubmit={handleSubmit}>
          <GroupingCharacteristicsField
            updateGroupSizeFunc={updateGroupSize}
            groupSize={groupSize}
            groupingType={groupingType}
            updateGroupingTypeFunc={setGroupingType}
          />
          <div className="make-groups-page__form--student-data">
            <AliasesField
              className="make-groups-page__form--fieldset"
              fieldName="Aliases:"
              aliasesUpdateFunc={setAliases}
              aliases={aliases}
              groupSize={groupSize}
              aliasNumberValidationFunc={validateAliases}
              aliasUniquenessValidationFunc={validateAliasUniqueness}
              aliasGroupSizeValidationFunc={validateDataSize}
            />
            {categoriesFields}
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
          <SampleDataButtons
            data={store}
            clickFn={injectSampleData}
          />
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
