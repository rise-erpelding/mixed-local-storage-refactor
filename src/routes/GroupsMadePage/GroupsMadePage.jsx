import React, { Component } from 'react';

import MixEdContext from '../../context/MixEdContext';
import ls from 'local-storage';
import './GroupsMadePage.css';

class GroupsMadePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupings: []
    }
  }

  componentDidMount() {
    // const { groupings } = this.context;
    const groupings = ls.get('groupings');
    console.log(groupings);
    this.setState({ groupings: groupings });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('pretending to save')
  }

  render() {
    const { groupings } = this.state;
    const showGroupings = groupings.map((group, idx) => (
      <fieldset class="groups-made-page__group">
        <legend>Group {idx + 1}</legend>
          {group.map((stu, i) => (
            <>
            <input 
              name={'group' + idx + '-' + i}
              id={'group' + idx + '-' + i}
              value={stu.alias}
            />
            <br />
            </>
          ))}
          
      </fieldset>
    ))

    return (
      <main className="groups-made-page">
        <h1>Groupings</h1>
        <p>Click on a student to edit the group</p>
        <form className="groups-made-page__form" onSubmit={this.handleSubmit}>
          {showGroupings}
          <div>
            <button
              type="button"
            >
              Cancel
            </button>
            <button
              type="button"
            >
              Back
            </button>
            <button
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </main>
    )
  }

}


export default GroupsMadePage;

GroupsMadePage.contextType = MixEdContext;
