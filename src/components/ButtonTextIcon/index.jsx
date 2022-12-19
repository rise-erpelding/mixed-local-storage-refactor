import React from 'react';
import propTypes from 'prop-types';

export const ButtonTextIcon = ({buttonText, buttonIcon, customContainerClass, handleClick, type}) => {
  const defaultClassName = 'make-groups-page__button--container';
  const containerClassNames = customContainerClass ? `${defaultClassName} ${customContainerClass}` : defaultClassName;
  return (
    <button type={type ? type : 'button'} onClick={handleClick}>
      <div className={containerClassNames}>
        <div>{buttonText}</div>
        <div className="make-groups-page__button--icon-container">{buttonIcon}</div>
      </div>
    </button>
  );
};


ButtonTextIcon.propTypes = {
  handleClick: propTypes.func,
  buttonText: propTypes.string,
  buttonIcon: propTypes.element,
  customContainerClass: propTypes.string,
  type: propTypes.string,
};

// const buttonIcons = {
//   plus: 
// }