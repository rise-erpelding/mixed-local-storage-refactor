import React from 'react';
import propTypes from 'prop-types';

export const TextAreaInputSection = ({ label, name, onChange, placeholderText, value }) => {
  return (
    <section>
      <div>
        <label htmlFor={name}>{label}</label>
      </div>
      <textarea
        className="make-groups-page__form--textarea"
        columns="20"
        id={name}
        name={name}
        onChange={onChange}
        placeholder={placeholderText}
        rows="26"
        value={value}
      />
    </section>
  );
};


TextAreaInputSection.propTypes = {
  label: propTypes.string,
  name: propTypes.string,
  placeholderText: propTypes.string,
  onChange: propTypes.func,
  value: propTypes.string,
};