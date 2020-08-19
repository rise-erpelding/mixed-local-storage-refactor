import React, { Component } from 'react';
import MixedApiService from '../../services/mixed-api-service';
// import PropTypes from 'prop-types';
import './NewClass.css';


class NewClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: '',
    }
  }

  updateClass = (e) => {
    this.setState({ className: e.target.value });
  }

  handleSubmit = (e) => {
    const { className } = this.state;
    const { handleNewClass, handleClose } = this.props;
    e.preventDefault();
    handleNewClass(className);
    handleClose();
  }

  render() {
    const { handleClose, show } = this.props;
    const modalClassName = show ? 'new-class display-block' : 'new-class display-none';

    return (
      <div className={modalClassName}>
        <main className="new-class__main">
          <h1>New Class</h1>
          <form onSubmit={this.handleSubmit}>
              <label htmlFor="new-class-name">New Class Name:</label><br />
              <input
                name="new-class-name"
                id="new-class-name"
                type="text"
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

export default NewClass;

NewClass.defaultProps = {
  show: false,
  handleClose: () => {},
  handleNewClass: () => {},
};

// SaveGroups.propTypes = {
//   show: PropTypes.bool,
//   handleClose: PropTypes.func,
//   saveGroups: PropTypes.func,
// };
