import React from 'react';
import propTypes from 'prop-types';
import '../Modals.css';

const DeleteClassGrouping = (props) => {
    return (
      <div className={
        props.show 
        ? 'modal modal__display-block'
        : 'modal modal__display-none'
      }>
        <main className="modal__main">
          <h1>{props.title}</h1>
          <p>{props.message}</p>
            <button type="button" onClick={props.handleClose}>Cancel</button>
            <button type="submit" onClick={props.handleDelete}>{props.title}</button>
        </main>
      </div>
    );
};

export default DeleteClassGrouping;

DeleteClassGrouping.defaultProps = {
  show: false,
  title: '',
  message: '',
  handleClose: () => {},
  handleDelete: () => {}
};

DeleteClassGrouping.propTypes = {
  show: propTypes.bool,
  title: propTypes.string,
  message: propTypes.string,
  handleClose: propTypes.func,
  handleDelete: propTypes.func,
};
