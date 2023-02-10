import React, { Component } from 'react';
import propTypes from 'prop-types';
import SimpleModal from 'simple-modal';
import 'simple-modal/dist/index.css';
import '../Modals.css';

// Updates class OR grouping name, also can add a new class with specified name
class AddUpdateClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: '',
    };
  }

  updateClass = (e) => {
    this.setState({ className: e.target.value });
  };

  handleSubmit = (e) => {
    const { className } = this.state;
    const { handleUpdate, handleClose } = this.props;
    e.preventDefault();
    handleUpdate(className);
    handleClose();
    this.setState({ className: '' });
  };

  render() {
    const { className } = this.state;
    const { handleClose, show, title } = this.props;

    return (
      <SimpleModal show={show}>
        <main className="modal__main">
          <h1>{title}</h1>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="name-of-class">Name:</label>
            <br />
            <input
              name="name-of-class"
              id="class-name"
              type="text"
              value={className}
              onChange={this.updateClass}
            />
            <br />
            <div className="modal__buttons">
              <button
                type="button"
                onClick={handleClose}
                className="modal__buttons--outline"
              >
                Cancel
              </button>
              <button type="submit" className="modal__buttons--fill">
                Save
              </button>
            </div>
          </form>
        </main>
      </SimpleModal>
    );
  }
}

export default AddUpdateClass;

AddUpdateClass.defaultProps = {
  show: false,
  title: '',
  handleClose: () => {},
  handleUpdate: () => {},
};

AddUpdateClass.propTypes = {
  show: propTypes.bool,
  title: propTypes.string,
  handleClose: propTypes.func,
  handleUpdate: propTypes.func,
};
