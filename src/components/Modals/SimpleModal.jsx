/* eslint-disable react/prop-types */
import React from 'react';
import classnames from 'classnames';

const SimpleModal = (props) => {
  const modalClass = classnames({
    'modal__show': props.show,
    'modal__hide': !props.show
  }, 'modal');
  
  return (
    <div className={modalClass}>
      {props.children}
    </div>
  );
};

export default SimpleModal;