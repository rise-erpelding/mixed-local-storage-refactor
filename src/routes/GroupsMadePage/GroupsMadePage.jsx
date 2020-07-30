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

  handleClickCancel = () => {
    const { history } = this.props;
    history.push('/');
  }

  handleClickBack = () => {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    const { groupings } = this.state;
    const showGroupings = groupings.map((group, idx) => (
      <fieldset key={idx + 1} className="groups-made-page__group">
        <legend>Group {idx + 1}</legend>
          {group.map((stu, i) => (
            <div key={(idx + 1) + '-' + (i + 1)}>
            <input 
              name={'group' + (idx + 1) + '-' + (i + 1)}
              id={'group' + (idx + 1) + '-' + (i + 1)}
              value={stu.alias}
            />
            </div>
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
              onClick={this.handleClickCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={this.handleClickBack}
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
