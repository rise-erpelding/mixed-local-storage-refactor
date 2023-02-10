import React from 'react';
import propTypes from 'prop-types';

export const TextInputSection = ({
  className,
  label,
  name,
  onChange,
  required,
  value,
}) => {
  return (
    <section className={className}>
      <div>
        <label htmlFor={name}>{label}</label>
      </div>
      <input
        id={name}
        name={name}
        onChange={onChange}
        required={required ? true : false}
        type="text"
        value={value}
      />
    </section>
  );
};

TextInputSection.propTypes = {
  className: propTypes.string,
  explanation: propTypes.string,
  label: propTypes.string,
  name: propTypes.string,
  onChange: propTypes.func,
  required: propTypes.bool,
  value: propTypes.string,
};
