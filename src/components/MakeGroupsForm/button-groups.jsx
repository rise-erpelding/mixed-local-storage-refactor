import React from 'react';
import propTypes from 'prop-types';
import { ButtonTextIcon } from '../ButtonTextIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const FormActions = ({ addCategory, removeCategory, clickCancel }) => {
  return (
    <div className="make-groups-page__form--buttons">
      <ButtonTextIcon
        buttonIcon={<FontAwesomeIcon icon="plus" />}
        buttonText="Add Category"
        handleClick={addCategory}
      />
      <ButtonTextIcon
        buttonIcon={<FontAwesomeIcon icon="minus" />}
        buttonText="Remove Category"
        handleClick={removeCategory}
      />
      <ButtonTextIcon
        buttonIcon={<FontAwesomeIcon icon="window-close" />}
        buttonText="Cancel Generator"
        handleClick={clickCancel}
      />
      <ButtonTextIcon
        buttonIcon={<FontAwesomeIcon icon="arrow-right" />}
        buttonText="Generate Groups"
        customContainerClass="bold"
        handleClick={null}
        type="submit"
      />
    </div>
  );
};

export const SampleDataButtons = ({ data, clickFn }) => {
  return (
    <div className="make-groups-page__sampledata--buttons">
      {data.map((dataset, index) => (
        <ButtonTextIcon
          key={index}
          buttonIcon={<span>{index + 1}</span>}
          buttonText="See sample dataset"
          handleClick={() => clickFn(dataset)}
        />
      ))}
    </div>
  );
};

FormActions.propTypes = {
  addCategory: propTypes.func,
  removeCategory: propTypes.func,
  clickCancel: propTypes.func,
};

SampleDataButtons.propTypes = {
  data: propTypes.array,
  clickFn: propTypes.func,
};
