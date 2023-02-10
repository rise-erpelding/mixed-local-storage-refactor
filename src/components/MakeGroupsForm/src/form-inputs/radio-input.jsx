import React from 'react';
import propTypes from 'prop-types';

export const RadioInputSection = ({
  checkedStatuses,
  explanation,
  labels,
  inputGroupName,
  inputIds,
  onChangeFunc,
  required,
  values,
}) => {
  return (
    <section>
      <div className="make-groups-page__form--explanation">{explanation}</div>
      {values.map((value, index) => (
        <div key={value} className="make-groups-page__form--radio-buttons">
          <input
            checked={checkedStatuses[index]}
            id={inputIds[index]}
            name={inputGroupName}
            onChange={onChangeFunc}
            required={index === 0 ? true : false}
            type="radio"
            value={values[index]}
          />
          <label htmlFor={inputIds[index]}>{labels[index]}</label>
        </div>
      ))}
    </section>
  );
};

RadioInputSection.propTypes = {
  checkedStatuses: propTypes.arrayOf(propTypes.bool),
  explanation: propTypes.string,
  labels: propTypes.arrayOf(propTypes.string),
  inputGroupName: propTypes.string,
  inputIds: propTypes.arrayOf(propTypes.string),
  required: propTypes.bool,
  onChangeFunc: propTypes.func,
  values: propTypes.arrayOf(propTypes.string),
};
