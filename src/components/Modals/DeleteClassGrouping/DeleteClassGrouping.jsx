import React from 'react';
import propTypes from 'prop-types';
import '../Modals.css';
import SimpleModal from 'simple-modal';
import 'simple-modal/dist/index.css';

const DeleteClassGrouping = (props) => {
  return (
    <SimpleModal show={props.show}>
      <main className="modal__main">
        <h1>{props.title}</h1>
        <p>{props.message}</p>
        <div className="modal__buttons">
          <button
            type="button"
            onClick={props.handleClose}
            className="modal__buttons--outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={props.handleDelete}
            className="modal__buttons--fill"
          >
            {props.title}
          </button>
        </div>
      </main>
    </SimpleModal>
  );
};

export default DeleteClassGrouping;

DeleteClassGrouping.defaultProps = {
  show: false,
  title: '',
  message: '',
  handleClose: () => {},
  handleDelete: () => {},
};

DeleteClassGrouping.propTypes = {
  show: propTypes.bool,
  title: propTypes.string,
  message: propTypes.string,
  handleClose: propTypes.func,
  handleDelete: propTypes.func,
};
