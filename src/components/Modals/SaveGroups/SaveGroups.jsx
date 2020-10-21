import React, { Component } from 'react';
import propTypes from 'prop-types';
import '../Modals.css';
import SimpleModal from 'simple-modal';
import 'simple-modal/dist/index.css';

class SaveGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupingName: '',
      className: '',
    };
  }

  updateName = (e) => {
    this.setState({ groupingName: e.target.value });
  }

  updateClass = (e) => {
    this.setState({ className: e.target.value });
  }

  handleSubmit = (e) => {
    const { groupingName, className } = this.state;
    const { handleSave, handleClose } = this.props;
    e.preventDefault();
    handleSave(groupingName, className);
    handleClose();
  }

  render() {
    const { handleClose, show, classes } = this.props;
    const modalClassName = show
      ? 'modal modal__display-block'
      : 'modal modal__display-none';
    const classOptions = classes.map((classObj) => (
      <option
        key={classObj.id}
        value={classObj.class_name}
      >
        {classObj.class_name}
      </option>
    ));

    return (
      <SimpleModal show={this.props.show}>
        <main className="modal__main">
          <h1>Save Grouping</h1>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="grouping-name">Grouping name:</label><br />
            <input
              name="grouping-name"
              id="grouping-name"
              type="text"
              onChange={this.updateName}
              required
            /><br />
            <label htmlFor="grouping-class">Class:</label><br />
            <select name="grouping-class" id="grouping-class" onChange={this.updateClass}>
              <option value=""></option>
              {classOptions}
            </select>
            <br />
            <label htmlFor="grouping-new-class">Or create new class:</label><br />
            <input
              name="grouping-new-class"
              id="grouping-new-class"
              type="text"
              onChange={this.updateClass}
            /><br />
            <div className="modal__buttons">
              <button 
                type="button"
                onClick={handleClose}
                className="modal__buttons--outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="modal__buttons--fill"
              >
                Save
              </button>
            </div>
          </form>
        </main>
        </SimpleModal>
    );
  }
}

export default SaveGroups;

SaveGroups.defaultProps = {
  show: false,
  classes: [],
  handleClose: () => { },
  handleSave: () => { },
};

SaveGroups.propTypes = {
  show: propTypes.bool,
  handleClose: propTypes.func,
  handleSave: propTypes.func,
  classes: propTypes.array,
};
