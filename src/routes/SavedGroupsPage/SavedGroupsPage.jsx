import React, { Component } from 'react';
import NewClass from '../../components/NewClass/NewClass';
import MixedApiService from '../../services/mixed-api-service';
import './SavedGroupsPage.css';
// import store from '../../services/store';
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
      show: false,
      error: null,
    }
  }

  componentDidMount() {
    this.loadAllGroupsAndClasses();
    
  }

  // METHODS FOR COMPONENT DID MOUNT
  // refactor all once database is in place
  loadAllGroupsAndClasses = () => {
    // fetch classes and groups/groupings from database
    MixedApiService.getClassesForTeacher()
      .then((response) => {
        console.log(response)
        this.setState({ allClasses: response });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      })
    MixedApiService.getGroupingsForTeacher()
      .then((response) => {
        console.log(response)
        const lastGroup = response[response.length - 1];
        this.setState({ currentGrouping: lastGroup })
        this.loadCurrentGroup(lastGroup);
        this.setState({ allGroups: response })
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      })
      // this.setState({ allClasses: store.myGroups.classes }); // ["1st Period", "2nd Period", etc...]
      // this.setState({ allGroups: store.myGroups.groups }); // [{id: "num", groupClass: "something", groupName: "something", groupings: [{student}, {...}, {...}]}, {...}, {...}]
      
  }

  loadCurrentGroup(currentGroup) {

    // const allGroups = store.myGroups.groups;
    // const lastGroup = allGroups[allGroups.length - 1];
    // add something for if there are no groups
    // this.setState({ currentGrouping: currentGroup })
    this.getGroupsForCurrentGroupings(currentGroup.groupings);
    this.getCurrentClass(currentGroup.class_id);
    this.getCategoriesForCurrentGroupings(currentGroup.groupings);
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

  getCurrentClass = (currentClassId) => {
    const { allGroups } = this.state;

    // const allGroups = store.myGroups.groups;
    const currentClassGroups = allGroups.filter(
      (grouping) => grouping.class_id === currentClassId
      );
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
    const currentClassGroups = allGroups.filter((group) => group.id === classToChange)
    this.setState({ currentClassGroups });
    this.setState({ currentGrouping: currentClassGroups[0] })
    this.getGroupsForCurrentGroupings(currentClassGroups[0].groupings);
    this.getCategoriesForCurrentGroupings(currentClassGroups[0].groupings);
  }

  createNewClassTab = () => {
    console.log('creating new class');
    this.showNewClassModal();
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
    console.log('This will go back to the group generator with the original data, see comments for additional info');
    // Ideally the original data should be linked in the database to to the current group
    // So we would set the data in ls then push the group generator page
    // I didn't set my store up this way (ie didn't save the original data for each of my groups)
    // But will set the db up properly so that grouping and original data are linked
    const { history } = this.props;
    history.push('/make-groups');
  }

  handleDelete = (groupToDelete) => {
    console.log(`Deleting group id ${groupToDelete.id}`);
  }

  handleSave = (groupToSave) => {
    console.log(`Saving group id ${groupToSave.id}`);
  }

    // METHODS FOR SAVE MODAL
  
    showNewClassModal = () => {
      this.setState({ show: true });
    }
  
    hideNewClassModal = () => {
      this.setState({ show: false });
    }

  render() {
    const { 
      currentNumberOfGroups,
      currentGrouping,
      allClasses,
      currentClassGroups,
      currentGroupCategoryNames,
      show
    } = this.state;

    // TO RENDER A GROUPING
    const currentStudents = currentGrouping.groupings;
    const currentGroupName = currentGrouping.groupName;
    const currentGroupClass = currentGrouping.groupClass;
    const showGroupings = (
      currentNumberOfGroups.map((group) => (
        <div
          key={group}
          className="saved-groups-page__group"
          onDragOver={(event) => this.onDragOver(event)}
          onDrop={(event) => {this.handleDrop(event, group)}}
        >
          Group {group}
          {currentStudents.map((student, idx) => {
            if (student.groupNum === group) {
              return (
                <div 
                  key={idx + 1}
                  className="saved-groups-page__student"
                  onDragStart={(event) => {this.handleDragStart(event, student.alias)}}
                  draggable
                >
                  {student.alias}
                <div className="saved-groups-page__tooltip">
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
    const classTabs = allClasses.map((classObj) => (
      <li
        key={`class-${classObj.id}`}
        className={
          classObj.id === currentGrouping.class_id
          ? 'saved-groups-page__class-tab--selected saved-groups-page__class-tab'
          : 'saved-groups-page__class-tab'
        }
      >
        <button
          type="button"
          onClick={() => this.changeClassTab(classObj.id)}
        >
          {classObj.class_name}
        </button>
      </li>
    ))

    // TO RENDER GROUPINGS ON LEFT SIDE
    const groupingNames = currentClassGroups.map((grouping) => (
      <li
        key={`grouping-${grouping.id}`}
        className={grouping.id === currentGrouping.id ? 'saved-groups-page__groupings-list--selected' : ''}
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
      <main className="saved-groups-page">
      <ul className="saved-groups-page__class-tabs">
        {classTabs}
        <li
          key="class-new"
          className="saved-groups-page__class-tab--new saved-groups-page__class-tab"
        >
          <button
            type="button"
            onClick={this.createNewClassTab}
          >
            + New Class
          </button>
        </li>
      </ul>
      <div className="saved-groups-page__class-groupings">
        <div className="saved-groups-page__groupings-list">
          <ul className="saved-groups-page__groupings-list--ul">
            {groupingNames}
            <li
              key="grouping-new"
              className="saved-groups-page__groupings-list--new"
            >
              <button
                
                onClick={this.createNewGroup}
              >
                + New Group
              </button>
            </li>
          </ul>
        </div>
        <section className="saved-groups-page__groups">
          <h1>{`${currentGroupName} - ${currentGroupClass}`}</h1>
          <p>Drag and drop students to edit groups.</p>
        <form>
        <div className="saved-groups-page__groupings">
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
      <NewClass 
        show={show}
        handleClose={this.hideNewClassModal}
        handleNewClass={this.showNewClassModal}
      />
    </main>
    )
  }
}

export default SavedGroupsPage;