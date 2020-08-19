import React, { Component } from 'react';
import NewClass from '../../components/NewClass/NewClass';
import MixedApiService from '../../services/mixed-api-service';
import './SavedGroupsPage.css';
// import store from '../../services/store';
import MixEdContext from '../../context/MixEdContext';
import { Link } from 'react-router-dom';
import ls from 'local-storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// TO BE CLEAR
// A 'Grouping' Refers to a class of students that has been broken into groups
// A 'group' should refer to the group within a class

class SavedGroupsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allClasses: [],
      allGroupings: [],
      currentGrouping: {},
      currentGroupingGroupNumbers: [],
      currentGroupingCategoryNames: [],
      currentClass: {},
      currentClassGroupings: [],
      show: false,
      groupingUpdated: false,
      error: null,
    }
  }

  componentDidMount() {
    MixedApiService.getClassesAndGroupingsForTeacher()
      .then(([classes, groupings]) => {
        const currentGrouping = groupings[groupings.length - 1];
        const currentClass = classes.find((classObj) => classObj.id === currentGrouping.class_id);
        this.setState({
          allClasses: classes,
          allGroupings: groupings,
          // currentGrouping: currentGrouping,
          currentClass: currentClass,
        })
        /* below methods will set state for currentGroupingGroupNumbers, 
        currentGroupingCategoryNames, currentClassGroupings, respectively */
        this.updateCurrentGrouping(currentGrouping);
        // this.getCurrentGroupingGroupNumbers(currentGrouping.groupings);
        // this.getCategoriesForCurrentGroupings(currentGrouping.groupings);
        this.getCurrentClassGroupingsList(currentClass.id, groupings);
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  // METHODS TO SET INFO ABOUT CURRENT GROUPING IN STATE
  updateCurrentGrouping = (currentGrouping) => {
    this.setState({ currentGrouping });
    this.getCurrentGroupingGroupNumbers(currentGrouping.groupings);
    this.getCategoriesForCurrentGroupings(currentGrouping.groupings);
  }

  updateCurrentClass = (currentClassId, groupings) => {

  }

  getCurrentGroupingGroupNumbers = (studentsArr) => {
    const allGroupNums = [];
    // get all the group numbers for all the students and push into arr
    studentsArr.forEach((student) => {
      allGroupNums.push(student.groupNum);
    })
    // create array with a set containing only unique items
    const currentGroupNumbers = Array.from(new Set(allGroupNums));
    currentGroupNumbers.sort((a, b) => a - b);
    // console.log(currentGroupNumbers);
    this.setState({ currentGroupingGroupNumbers: currentGroupNumbers });
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
    this.setState({ currentGroupingCategoryNames: categories });
  }

  getCurrentClassGroupingsList = (currentClassId, allGroupings) => {
    const currentClassGroupings = allGroupings.filter(
      (grouping) => grouping.class_id === currentClassId
    );
    this.setState({ currentClassGroupings });
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
    currentGrouping = { ...currentGrouping, updatedStudent };
    this.updateCurrentGrouping(currentGrouping);
    // this.setState({ currentGrouping });
  }

  // METHODS FOR CLICKING CLASS TABS AND GROUP TABS
  // used when user clicks on class tab other than currently selected
  changeClassTab = (classId) => {
    const { allGroupings, allClasses } = this.state;
    const currentClassGroupings = allGroupings.filter((group) => group.class_id === classId);
    const currentClass = allClasses.find((classObj) => classObj.id === classId);
    this.setState({ currentClass });
    if (!!currentClassGroupings.length) {   // if there are groupings in the class
      const currentGrouping = currentClassGroupings[currentClassGroupings.length - 1];
      this.setState({ currentClassGroupings });
      this.updateCurrentGrouping(currentGrouping);
      // this.setState({ currentGrouping });
      // this.getCurrentGroupingGroupNumbers(currentGrouping.groupings);
      // this.getCategoriesForCurrentGroupings(currentGrouping.groupings);
      this.getCurrentClassGroupingsList(classId, allGroupings);
    }
    else {                                // if there are no groupings in the class
      this.setState({
        currentClassGroupings: [],
        currentGrouping: {},
        currentGroupingCategoryNames: [],
        currentGroupingGroupNumbers: [],
      });
    }
  }

  createNewClassTab = () => {
    console.log('creating new class');
    this.showNewClassModal();
  }

  createNewGroup = () => {
    // move clearPreviousGroups() from LandingPage to App so we can call that function instead of rewriting code
    const { history } = this.props;
    const { removePrevData } = this.context;
    history.push('/make-groups');
    removePrevData();
    // console.log('clearing previous groups');
    // ls.remove('groupings');
    // ls.remove('data');
    // ls.remove('studentArr');
    // ls.remove('categoryNames');
  }

  // used when user clicks on grouping other than currently selected
  seeSelectedGrouping = (groupingId) => {
    const { currentClassGroupings } = this.state;
    const currentGrouping = currentClassGroupings.find((grouping) => grouping.id === groupingId);
    console.log(currentGrouping); // should be an object
    this.setState({ currentGrouping });
    this.updateCurrentGrouping(currentGrouping);
  }

  // HANDLING MAIN BUTTONS (View Data, Delete Grouping, Save Changes)
  viewGroupData = () => {
    const { currentGrouping } = this.state;
    console.log('This will go back to the group generator with the original data, see comments for additional info');
    // Ideally the original data should be linked in the database to to the current group
    // So we would set the data in ls then push the group generator page
    // I didn't set my store up this way (ie didn't save the original data for each of my groups)
    // But will set the db up properly so that grouping and original data are linked
    ls.set('data', currentGrouping.data);
    const { history } = this.props;
    history.push('/make-groups');
  }

  handleDelete = (currentGrouping) => {
    const { allGroupings, currentClassGroupings } = this.state;
    // remove the current grouping from all groupings
    // remove current grouping from everywhere else? see if this is necessary before trying to do it
    // call changeClassTab with the current class Id again to re-render?
    console.log(`Deleting group id ${currentGrouping.id}`);
    // let { allGroupings } = this.state;
    MixedApiService.deleteGrouping(currentGrouping.id)
      .then((res) => {
        console.log(res.json)
      })
      .catch((error) => {
        this.setState({ error })
      })
    const updatedAllGroupings = allGroupings.filter(
      (grouping) => grouping.id !== currentGrouping.id
    );
    const updatedCurrentClassGroupings = currentClassGroupings.filter(
      (grouping) => grouping.id !== currentGrouping.id
    );
    this.setState({
      allGroupings: updatedAllGroupings,
      currentClassGroupings: updatedCurrentClassGroupings,
    })
    if (!!updatedCurrentClassGroupings.length) { // if there are still groupings to show
      // TODO: put some logic here that will render the most recent group, still have to figure out how to do that
      const currentGrouping = updatedCurrentClassGroupings[0];
      this.updateCurrentGrouping(currentGrouping);
    }
    else { // if there are no groupings to show
      this.setState({
        currentGrouping: {},
        currentGroupingCategorynames: [],
        currentGroupingGroupNumbers: [],
      })
    }
  }

  handleSave = (currentGrouping) => {
    let { allGroupings } = this.state;
    MixedApiService.editGrouping(currentGrouping)
      .then(() => {
        // Update allGroupings to include changes in currentGrouping
        allGroupings = allGroupings.filter((grouping) => grouping.id !== currentGrouping.id)
        allGroupings = [...allGroupings, currentGrouping];
        this.setState({
          allGroupings,
          groupingUpdated: true,
        });
      })
      .catch((error) => {
        this.setState({ error })
      })
  }

  // METHODS FOR SAVE MODAL
  showNewClassModal = () => {
    this.setState({ show: true });
  }

  hideNewClassModal = () => {
    this.setState({ show: false });
  }

  addNewClassName = (newClassName) => {
    const { allClasses } = this.state;
    MixedApiService.insertNewClass(newClassName)
      .then((newClass) => {
        this.setState({
          allClasses: [...allClasses, newClass],
          currentClass: newClass,
          currentClassGroupings: [],
          currentGrouping: {},
          currentGroupingCategoryNames: [],
          currentGroupingGroupNumbers: [],
        })
      })
      .catch((error) => {
        this.setState({ error });
      })
  }

  // METHODS FOR UPDATING CLASS NAME OR DELETING
  deleteClass = (classId) => {
    // this should also delete any classes within the group
    console.log(`deleting class ${classId}`);
    // if currentClassGroupings is not empty, for each in currentClassGroupings, delete
    // then also delete the class id
    // TODO: put some logic here that will render the most recent class
    // for now change allClasses to exclude the deleted class
    // remove all groupings with current classId from allGroupings
    // currentClassGroupings will correspond to the first index in 
  }

  editClassName = (classId, className) => {
    console.log('editClassName');
  }

  render() {
    const {
      allClasses,
      currentGrouping,
      currentGroupingGroupNumbers,
      currentGroupingCategoryNames,
      currentClass,
      currentClassGroupings,
      groupingUpdated,
      show
    } = this.state;

    const groupingUpdatedMessage = !!groupingUpdated ? 'Changes saved.' : '';

    // TO RENDER A GROUPING
    const currentStudents = currentGrouping.groupings || '';
    const currentGroupingName = currentGrouping.grouping_name || '';
    const currentClassName = currentClass.class_name || '';

    const showGroupings = (
      currentGroupingGroupNumbers.map((groupNumber) => (
        <div
          key={groupNumber}
          className="saved-groups-page__group"
          onDragOver={(event) => this.onDragOver(event)}
          onDrop={(event) => { this.handleDrop(event, groupNumber) }}
        >
          Group {groupNumber}
          {currentStudents.map((student, idx) => {
            if (student.groupNum === groupNumber) {
              return (
                <div
                  key={idx + 1}
                  className="saved-groups-page__student"
                  onDragStart={(event) => { this.handleDragStart(event, student.alias) }}
                  draggable
                >
                  {student.alias}
                  <div className="saved-groups-page__tooltip">
                    {currentGroupingCategoryNames.map((category, index) => (
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
        <button
          type="button"
          onClick={() => this.editClassName(classObj.id)}
        >
          <FontAwesomeIcon icon="edit" />
        </button>
        <button
          type="button"
          onClick={() => this.deleteClass(classObj.id)}
        >
          <FontAwesomeIcon icon="trash-alt" />
        </button>
      </li>
    ))

    // TO RENDER GROUPINGS ON LEFT SIDE
    const groupingNames = currentClassGroupings.map((grouping) => (
      <li
        key={`grouping-${grouping.id}`}
        className={grouping.id === currentGrouping.id ? 'saved-groups-page__groupings-list--selected' : ''}
      >
        <button
          type="button"
          onClick={() => this.seeSelectedGrouping(grouping.id)}
        >
          {grouping.grouping_name}
        </button>
      </li>
    ))

    // HIDES BUTTONS USING CLASSNAME IF THERE ARE NO GROUPINGS
    const groupingButtonDisplay = !!this.state.currentClassGroupings.length
      ? 'saved-groups-page__show'
      : 'saved-groups-page__hide';

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
            {!!this.state.currentClassGroupings.length
              ? <div>
                <h1>{`${currentGroupingName} - ${currentClassName}`}</h1>
                <p>Drag and drop students to edit groups.</p>
              </div>
              : <div>
                <h1>{currentClassName}</h1>
                <p>No groups found for this class. <span onClick={this.createNewGroup}><Link to='/make-groups'>Add a new group?</Link></span></p>
              </div>}
            <form>
              <div className="saved-groups-page__groupings">
                {showGroupings}
              </div>
              <div className={groupingButtonDisplay}>
                {/* TODO */}
                <p>{groupingUpdatedMessage}</p>
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
                  Delete Grouping <FontAwesomeIcon icon="trash-alt" />
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
          handleNewClass={this.addNewClassName}
        />
      </main>
    )
  }
}

export default SavedGroupsPage;

SavedGroupsPage.contextType = MixEdContext;