import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleModal from 'simple-modal';
import 'simple-modal/dist/index.css';
import propTypes from 'prop-types';
import '../Modals.css';


const FirstVisitModal = (props) => {
  return (
    <SimpleModal show={props.show}>
      <main className="modal__main--first-visit">
        <div className="modal__close">
          <button type="button" onClick={props.handleClose}>
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
        <div className="modal__text">
          <h1>Welcome to the Group Generator</h1>
          <p>
            This is where you can enter data for grouping your students.
            At a minimum, you will need to provide your students&apos; names
            (or some alias to help you identify them).
            You can add any categories you want for grouping, one value on each line.
          </p>
          <p>
            Still confused? Check out the sample datasets at the bottom of this page
            to see what you can do.
          </p>
        </div>
      </main>
    </SimpleModal>
  );
};

export default FirstVisitModal;

FirstVisitModal.defaultProps = {
  show: false,
  handleClose: () => {},
};

FirstVisitModal.propTypes = {
  show: propTypes.bool,
  handleClose: propTypes.func,
  saveGroups: propTypes.func,
};
