import React, { Component } from 'react';
import propTypes from 'prop-types';
import '../Modals.css';


class AddUpdateClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: '',
    };
  }

  updateClass = (e) => {
    this.setState({ className: e.target.value });
  }

  handleSubmit = (e) => {
    const { className } = this.state;
    const { handleUpdate, handleClose } = this.props;
    e.preventDefault();
    handleUpdate(className);
    handleClose();
    this.setState({ className: '' });
  }

  render() {
    const { className } = this.state;
    const { handleClose, show, title } = this.props;
    const modalClassName = show ? 'modal modal__display-block' : 'modal modal__display-none';

    return (
      <div className={modalClassName}>
        <main className="modal__main">
          <h1>{title}</h1>
          <form onSubmit={this.handleSubmit}>
              <label htmlFor="name-of-class">Name:</label><br />
              <input
                name="name-of-class"
                id="class-name"
                type="text"
                value={className}
                onChange={this.updateClass}
                /><br />
    
            <button type="button" onClick={handleClose}>Cancel</button>
            <button type="submit">Save</button>
          </form>
        </main>
      </div>
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
