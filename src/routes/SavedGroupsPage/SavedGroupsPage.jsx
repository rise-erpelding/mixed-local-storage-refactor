import React, { Component } from 'react';
import './SavedGroupsPage.css';
import store from '../../services/store';
import ls from 'local-storage';

class SavedGroupsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNumberOfGroups: [],
      currentGrouping: {},
      currentClassGroups: [],
      currentGroupCategoryNames: [],
      allClasses: [],
      allGroups: [],
    }
  }

  componentDidMount() {
    this.loadAllGroups();
    this.loadCurrentGroup();
  }

  // METHODS FOR COMPONENT DID MOUNT
  // refactor all once database is in place
  loadAllGroups = () => {
    // fetch classes and groups/groupings from database
      this.setState({ allClasses: store.myGroups.classes });
      this.setState({ allGroups: store.myGroups.groups });
  }

  loadCurrentGroup() {
    const allGroups = store.myGroups.groups;
    const lastGroup = allGroups[allGroups.length - 1];
    this.setState({ currentGrouping: lastGroup })
    this.getGroupsForCurrentGroupings(lastGroup.groupings);
    this.getCurrentClass(lastGroup.groupClass);
    this.getCategoriesForCurrentGroupings(lastGroup.groupings);
  }

  getGroupsForCurrentGroupings = (studentsArr) => {
    const groupNums = [];
    // get all the group numbers for all the students and push into arr
    studentsArr.forEach((student) => {
      groupNums.push(student.groupNum);
    })
    // create array with a set containing only unique items
    const currentNumberOfGroups = Array.from(new Set(groupNums));
    currentNumberOfGroups.sort((a, b) => a - b);
    this.setState({ currentNumberOfGroups });
  }

  getCategoriesForCurrentGroupings = (studentsArr) => {
    const categories = [];
    const typicalStudent = studentsArr[0];
    for (let key in typicalStudent) {
      if (key !== 'alias' && key !== 'groupNum') {
        categories.push(key);
      }
    }
    /**
     * Removes any category ending in " Level" if the beginning is the duplicate of another.
     * For example, if categories contains ["Test Score", "Test Score Level"] this removes
     * "Test Score Level" from the array.
     */

    for (let i = 0; i < categories.length; i++) {
      let current = categories[i];
      for (let j = 0; j < categories.length; j++) {
        let currentPlusLevel = `${categories[j]} Level`
        if (current === currentPlusLevel) {
          categories.splice(i, 1);
        }
      }
    }
    this.setState({ currentGroupCategoryNames: categories });
  }

  getCurrentClass = (currentClassName) => {
    const allGroups = store.myGroups.groups;
    const currentClassGroups = allGroups.filter((grouping) => grouping.groupClass === currentClassName);
    this.setState({ currentClassGroups });
  }

  // METHODS FOR DRAG AND DROP STUDENT NAMES
  handleDragStart = (event, student) => {
    event.dataTransfer.setData("student", student);
  }

  onDragOver = (event) => {
    event.preventDefault();
  }

  handleDrop = (event, newGroup) => {
    let { currentGrouping } = this.state;
    const students = currentGrouping.groupings;
    const draggedStudent = event.dataTransfer.getData("student");
    let updatedStudent = students.filter((student) => {
      if (draggedStudent === student.alias) {
        student.groupNum = newGroup;
      }
      return student;
    })
    currentGrouping = {...currentGrouping, updatedStudent};
    this.setState({ currentGrouping });
  }

  // METHODS FOR CLICKING CLASS TABS AND GROUP TABS
  changeClassTab = (classToChange) => {
    const { allGroups } = this.state;
    const currentClassGroups = allGroups.filter((group) => group.groupClass === classToChange)
    this.setState({ currentClassGroups });
    this.setState({ currentGrouping: currentClassGroups[0] })
    this.getGroupsForCurrentGroupings(currentClassGroups[0].groupings);
    this.getCategoriesForCurrentGroupings(currentClassGroups[0].groupings);
  }

  createNewClassTab = () => {
    console.log('creating new class');
  }

  createNewGroup = () => {
    // move clearPreviousGroups() from LandingPage to App so we can call that function instead of rewriting code
    const { history } = this.props;
    history.push('/make-groups');
    console.log('clearing previous groups');
    ls.remove('groupings');
    ls.remove('data');
    ls.remove('studentArr');
    ls.remove('categoryNames');
  }

  seeSelectedGrouping = (groupingId) => {
    const { currentClassGroups } = this.state;
    const currentGrouping = currentClassGroups.filter((group) => group.id === groupingId)[0];
    this.setState({ currentGrouping });
    this.getGroupsForCurrentGroupings(currentGrouping.groupings);
    this.getCategoriesForCurrentGroupings(currentGrouping.groupings);
  }

  // HANDLING MAIN BUTTONS (View Data, Delete Grouping, Save Changes)
  viewGroupData = () => {
    console.log('Going back to the group generator with the original data, see comments for additional info');
    // Ideally the original data should be linked in the database to to the current group
    // So we would set the data in ls then push the group generator page
    // I didn't set my store up this way (ie didn't save the original data for each of my groups)
    // But will set the db up properly
    const { history } = this.props;
    history.push('/make-groups');
  }

  handleDelete = (groupToDelete) => {
    console.log(`Deleting group id ${groupToDelete.id}`);
  }

  handleSave = (groupToSave) => {
    console.log(`Saving group id ${groupToSave.id}`);
  }

  render() {
    const { 
      currentNumberOfGroups,
      currentGrouping,
      allClasses,
      currentClassGroups,
      currentGroupCategoryNames
    } = this.state;

    // TO RENDER A GROUPING
    const currentStudents = currentGrouping.groupings;
    const currentGroupName = currentGrouping.groupName;
    const currentGroupClass = currentGrouping.groupClass;
    const showGroupings = (
      currentNumberOfGroups.map((group) => (
        <div
          key={group}
          className="groups-made-page__group"
          onDragOver={(event) => this.onDragOver(event)}
          onDrop={(event) => {this.handleDrop(event, group)}}
        >
          Group {group}
          {currentStudents.map((student, idx) => {
            if (student.groupNum === group) {
              return (
                <div 
                  key={idx + 1}
                  className="groups-made-page__student"
                  onDragStart={(event) => {this.handleDragStart(event, student.alias)}}
                  draggable
                >
                  {student.alias}
                <div className="groups-made-page__tooltip">
                  {currentGroupCategoryNames.map((category, index) => (
                    <p key={`category-${index}`}>
                    {`${category}: ${student[category]}`}
                    </p>
                  ))}
                </div>
                </div>
              )
            }
            return '';
          })}
        </div>
      )
    ));

    // TO RENDER CLASS TABS
    const classTabs = allClasses.map((clss, idx) => (
      <li
        key={`${clss}-${idx}`}
        className={clss === currentGrouping.groupClass ? 'groups-made-page__class-tab--selected groups-made-page__class-tab' : 'groups-made-page__class-tab'}
      >
        <button
          type="button"
          onClick={() => this.changeClassTab(clss)}
        >
          {clss}
        </button>
      </li>
    ))

    // TO RENDER GROUPINGS ON LEFT SIDE
    const groupingNames = currentClassGroups.map((grouping) => (
      <li
        key={`grouping-${grouping.id}`}
        className={grouping.id === currentGrouping.id ? 'groups-made-page__groupings-list--selected' : ''}
      >
        <button
          type="button"
          onClick={() => this.seeSelectedGrouping(grouping.id)}
        >
          {grouping.groupName}
        </button>
      </li>
    ))
  
    return (
      <main>
        
      <ul className="groups-made-page__class-tabs">
        {classTabs}
        <li
          key="class-new"
          className="groups-made-page__class-tab--new groups-made-page__class-tab"
        >
          <button
            type="button"
            onClick={this.createNewClassTab}
          >
            + New Class
          </button>
        </li>
      </ul>
      <div className="groups-made-page__class-groupings">
        <div className="groups-made-page__groupings-list">
          <ul className="groups-made-page__groupings-list--ul">
            {groupingNames}
            <li
              key="grouping-new"
            >
              <button
                className="groups-made-page__groupings-list--new"
                onClick={this.createNewGroup}
              >
                + New Group
              </button>
            </li>
          </ul>
        </div>
        <section className="groupings">
          <h1>{`${currentGroupName} - ${currentGroupClass}`}</h1>
          <p>Click on a student to edit the group</p>
        <form>
        <div className="groups-made-page__groupings">
            {showGroupings}
        </div>
        <div>
          <button
            type="button"
            onClick={this.viewGroupData}
          >
            View Data
          </button>
          <button
            type="button"
            onClick={() => this.handleDelete(currentGrouping)}
          >
            Delete Grouping
          </button>
          <button
            type="button"
            onClick={() => this.handleSave(currentGrouping)}
          >
            Save Changes
          </button>
        </div>
      </form>
      </section>
      </div>
    </main>
    )
  }
}

export default SavedGroupsPage;