import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import './SaveGroups.css';
import store from '../../services/store';


class SaveGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupingName: '',
      className: '',
    }
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
    const { handleClose, show } = this.props;
    const modalClassName = show ? 'save-groups display-block' : 'save-groups display-none';
    const classOptions = store.classes.map((el, idx) => (
      <option
        key={idx + 1}
        value={el}
      >
        {el}
      </option>
    ))

    return (
      <div className={modalClassName}>
        <main className="save-groups__main">
          <h1>Save Grouping</h1>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="grouping-name">Grouping name:</label><br />
              <input 
                name="grouping-name"
                id="grouping-name"
                type="text"
                onChange={this.updateName}
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
    
            <button type="button" onClick={handleClose}>Cancel</button>
            <button type="submit">Save</button>
          </form>
        </main>
      </div>
    );
  }
}

export default SaveGroups;

SaveGroups.defaultProps = {
  show: false,
  handleClose: () => {},
  saveGroups: () => {},
};

// SaveGroups.propTypes = {
//   show: PropTypes.bool,
//   handleClose: PropTypes.func,
//   saveGroups: PropTypes.func,
// };
