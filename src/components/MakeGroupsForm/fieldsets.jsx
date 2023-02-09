import React from "react";
import propTypes from "prop-types";

export const FieldsetContainer = ({ className, legendText, children }) => {
  return (
    <fieldset className={className}>
      <legend>{legendText}</legend>
      {children}
    </fieldset>
  );
};

export const CategoryField = ({ className, fieldName }) => {
  return (
    <FieldsetContainer>

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
};
