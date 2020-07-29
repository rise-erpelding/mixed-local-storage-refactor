import React from 'react';
// import PropTypes from 'prop-types';
import './ValidationError.css';

const ValidationError = (props) => {
  const { message } = props;
  if (message) {
    return (
      <div className="validation-error">
        {props.message}
      </div>
    );
  }
  return <></>;
};

export default ValidationError;

// ValidationError.defaultProps = {
//   message: '',
// };

// ValidationError.propTypes = {
//   message: PropTypes.string,
// };
