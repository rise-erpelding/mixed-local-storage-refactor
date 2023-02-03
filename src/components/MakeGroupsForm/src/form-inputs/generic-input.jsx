import React from 'react';
import propTypes from 'prop-types';

export const InputSection = ({ explanation, inputType, label, max, min, name, onChange, required, value }) => {
  return (
    <section>
      <div className="make-groups-page__form--explanation">{explanation}</div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        max={max}
        min={min}
        name={name}
        onChange={onChange}
        type={inputType}
        value={value}
        required={required ? true : false}
      />
    </section>
  );
};


InputSection.propTypes = {
  explanation: propTypes.string,
  inputType: propTypes.string,
  label: propTypes.string,
  max: propTypes.number,
  min: propTypes.number,
  name: propTypes.string,
  required: propTypes.bool,
  value: propTypes.oneOfType([
    propTypes.string,
    propTypes.number
  ]), // TODO: fix eventually, updateGroupSize coerces inputted str into num so it can be either
  onChange: propTypes.func,
};