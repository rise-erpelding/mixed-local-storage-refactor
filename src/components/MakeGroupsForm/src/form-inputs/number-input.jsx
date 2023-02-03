import React from 'react';
import propTypes from 'prop-types';

// we can further refactor to put all inputs together with maybe some switch logic or something like that

export const NumberInputSection = ({ explanation, label, max, min, name, onChange, value }) => {
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
        type="number"
        value={value}
      />
    </section>
  );
};


NumberInputSection.propTypes = {
  explanation: propTypes.string,
  label: propTypes.string,
  max: propTypes.number,
  min: propTypes.number,
  name: propTypes.string,
  value: propTypes.oneOfType([
    propTypes.string,
    propTypes.number
  ]), // TODO: fix eventually, updateGroupSize coerces inputted str into num so it can be either
  onChange: propTypes.func,
};
