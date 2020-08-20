import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import PropTypes from 'prop-types';
import './FirstVisitModal.css';
// import store from '../../services/store';


const FirstVisitModal = (props) => {
  return (
    <div className={
      props.show 
      ? 'first-visit-modal display-block' 
      : 'first-visit-modal display-none'
      }>
      <main className="first-visit-modal__main">
        <div className="first-visit-modal__close">
          <button type="button" onClick={props.handleClose}>
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
        <div className="first-visit-modal__text">
          <h1>Welcome to the Group Generator</h1>
          <p>
            This is where you can enter data for grouping your students.
            At a minimum, you will need to provide your students' names
            (or some alias to help you identify them).
            You can add any categories you want for grouping, one value on each line.
          </p>
          <p>
            Still confused? Check out the sample datasets at the bottom of this page
            to see what you can do.
          </p>
        </div>
      </main>
    </div>
  );
}

export default FirstVisitModal;

FirstVisitModal.defaultProps = {
  show: false,
  handleClose: () => {},
};

// SaveGroups.propTypes = {
//   show: PropTypes.bool,
//   handleClose: PropTypes.func,
//   saveGroups: PropTypes.func,
// };
