import React from "react";
import propTypes from "prop-types";
import { RadioInputSection } from "./src/form-inputs/radio-input";
import { TextAreaInputSection } from "./src/form-inputs/textarea-input";
import { TextInputSection } from "./src/form-inputs/text-input";
import { NumberInputSection } from "./src/form-inputs/number-input";
import ValidationError from '../../components/ValidationError/ValidationError';
import { ButtonTextIcon } from "../ButtonTextIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const FieldsetContainer = ({ className, legendText, children }) => {
  return (
    <fieldset className={className}>
      <legend>{legendText}</legend>
      {children}
    </fieldset>
  );
};

export const GroupingCharacteristicsField = ({
  updateGroupSizeFunc,
  groupSize,
  groupingType,
  updateGroupingTypeFunc,
}) => {
  return (
    <FieldsetContainer
      className="make-groups-page__form--grouping-characteristics"
      legendText="Grouping characteristics:"
    >
      <NumberInputSection
        explanation="Choose minimum group size (slightly larger groups will be made as needed)."
        label="Group size:"
        max={20}
        min={2}
        name="group-size"
        onChange={updateGroupSizeFunc}
        value={groupSize}
      />
      <RadioInputSection
        checkedStatuses={[
          groupingType === "similar",
          groupingType === "mixed",
        ]}
        explanation="Choose whether members within a group should have similar traits or differing traits."
        labels={[
          "Group members are similar",
          "Group members are diverse",
        ]}
        inputGroupName="grouping-type"
        inputIds={["grouping-similar", "grouping-mixed"]}
        onChangeFunc={(e) => updateGroupingTypeFunc(e.target.value)}
        required
        values={["similar", "mixed"]}
      />
    </FieldsetContainer>
  );
};

export const AliasesField = ({
  className,
  fieldName,
  aliasesUpdateFunc,
  aliases,
  groupSize,
  aliasNumberValidationFunc,
  aliasUniquenessValidationFunc,
  aliasGroupSizeValidationFunc,
}) => {
  return (
    <FieldsetContainer
      className={className}
      legendText={fieldName}
    >
      <div className="make-groups-page__form--before-textarea">
        <div className="make-groups-page__form--explanation">
          List of names or other identifier.
        </div>
        <ValidationError message={aliasNumberValidationFunc(aliases)} />
        <ValidationError message={aliasUniquenessValidationFunc(aliases)} />
        <ValidationError message={aliasGroupSizeValidationFunc(aliases, groupSize)} />
      </div>
      <TextAreaInputSection
        label="Values:"
        name="aliases"
        onChange={(e) => aliasesUpdateFunc(e.target.value)}
        placeholderText="Enter aliases here, one on each line."
        value={aliases}
      />
      <div className="make-groups-page__form--after-textarea"></div>
    </FieldsetContainer>
  );
};

export const CategoryField = ({
  className,
  fieldName,
  isQuantitative,
  categoryNumber,
  arrUpdateFunc,
  categoryTypes,
  categoryTypesUpdateFunc,
  categoryNames,
  categoryNamesUpdateFunc,
  categoryVals,
  categoryValsUpdateFunc,
  categoriesLength,
  shiftCategoryFunc,
}) => {
  return (
    <FieldsetContainer
      className={className}
      legendText={fieldName}
    >
      <div className="make-groups-page__form--before-textarea">
        <RadioInputSection
          checkedStatuses={[isQuantitative, !isQuantitative]}
          explanation="Values corresponding to a category."
          labels={["Quantitative (numbers)", "Qualitative (words)"]}
          inputGroupName={`cat${categoryNumber}-type`}
          inputIds={[`cat${categoryNumber}-quantitative`, `cat${categoryNumber}-qualitative`]}
          onChangeFunc={(event) => {
            arrUpdateFunc(event, categoryNumber, categoryTypes, categoryTypesUpdateFunc);
          }}
          required
          values={["quantitative", "qualitative"]}
        />
        <TextInputSection
          className="make-groups-page__form--category-name"
          label="Category name:"
          name={`cat${categoryNumber}-name`}
          onChange={(event) => {
            arrUpdateFunc(event, categoryNumber, categoryNames, categoryNamesUpdateFunc);
          }}
          required
          value={categoryNames[categoryNumber]}
        />
      </div>
      <TextAreaInputSection
          label="Values:"
          name={`cat${categoryNumber}-vals`}
          onChange={(event) => {
            arrUpdateFunc(event, categoryNumber, categoryVals, categoryValsUpdateFunc);
          }}
          placeholderText="Enter values here, one on each line."
          value={categoryVals[categoryNumber]}
        />
      <div className="make-groups-page__form--after-textarea">
        {categoryNumber === 0 ? (
            ""
          ) : (
            <ButtonTextIcon
              buttonText="Increase Priority"
              buttonIcon={<FontAwesomeIcon icon="plus" />}
              handleClick={() => shiftCategoryFunc(categoryNumber, 'left')}
            />
          )}
          {categoryNumber === categoriesLength - 1 ? (
            ""
          ) : (
            <ButtonTextIcon
              buttonText="Decrease Priority"
              buttonIcon={<FontAwesomeIcon icon="minus" />}
              handleClick={() => shiftCategoryFunc(categoryNumber, 'right')}
            />
          )}
      </div>
    </FieldsetContainer>
  );
};

FieldsetContainer.propTypes = {
  className: propTypes.string,
  legendText: propTypes.string,
  children: propTypes.any,
};

CategoryField.propTypes = {
  className: propTypes.string,
  fieldName: propTypes.string,
  isQuantitative: propTypes.bool,
  categoryNumber: propTypes.number,
  radioUpdateFunc: propTypes.func,
  arrUpdateFunc: propTypes.func,
  categoryTypes: propTypes.array,
  categoryTypesUpdateFunc: propTypes.func,
  categoryNames: propTypes.array,
  categoryNamesUpdateFunc: propTypes.func,
  categoryVals: propTypes.array,
  categoryValsUpdateFunc: propTypes.func,
  categoriesLength: propTypes.number,
  shiftCategoryFunc: propTypes.func,
};

AliasesField.propTypes = {
  className: propTypes.string,
  fieldName: propTypes.string,
  aliasesUpdateFunc: propTypes.func,
  aliases: propTypes.string,
  groupSize: propTypes.oneOfType([
    propTypes.string,
    propTypes.number
  ]), // TODO: fix eventually, updateGroupSize coerces inputted str into num so it can be either
  aliasNumberValidationFunc: propTypes.func,
  aliasUniquenessValidationFunc: propTypes.func,
  aliasGroupSizeValidationFunc: propTypes.func,
};

GroupingCharacteristicsField.propTypes = {
  updateGroupSizeFunc: propTypes.func,
  groupSize: propTypes.oneOfType([
    propTypes.string,
    propTypes.number
  ]), // TODO: fix eventually, updateGroupSize coerces inputted str into num so it can be either
  groupingType: propTypes.string,
  updateGroupingTypeFunc: propTypes.func,
};
