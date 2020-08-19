import React, { Component } from 'react';
import SaveGroups from '../../components/SaveGroups/SaveGroups';
import MixEdContext from '../../context/MixEdContext';
import MixedApiService from '../../services/mixed-api-service';
import ls from 'local-storage';
import './GroupsMadePage.css';

class GroupsMadePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      students: [],
      groupNumbers: [],
      allClasses: [],
      error: null,
    }
  }

  componentDidMount() {
    const students = ls.get('studentArr');
    this.setState({ students: students });
    this.getGroupNumbers(students);
    MixedApiService.getClassesForTeacher()
      .then((classes) => {
        this.setState({ allClasses: classes })
      })
      .catch((error) => {
        this.setState({ error });
      });

  }


  getGroupNumbers = (studentsArr) => {
    const groupNums = [];
    // get all the group numbers for all the students and push into arr
    studentsArr.forEach((student) => {
      groupNums.push(student.groupNum);
    })
    // create array with a set containing only unique items
    const groupNumbers = Array.from(new Set(groupNums));
    groupNumbers.sort((a, b) => a - b);
    this.setState({ groupNumbers });
  }

  // METHODS FOR BUTTONS

  handleSubmit = (e) => {
    e.preventDefault();
    this.showSaveModal();
  }

  handleClickCancel = () => {
    const { history } = this.props;
    history.push('/');
  }

  handleClickBack = () => {
    const { history } = this.props;
    history.goBack();
  }

  // METHODS FOR SAVE MODAL
  
  showSaveModal = () => {
    this.setState({ show: true });
  }

  hideSaveModal = () => {
    this.setState({ show: false });
  }

  saveGroups = (groupingName, className) => {
    const { students, allClasses } = this.state;
    const data = ls.get('data');
    const selectedClassIndex = allClasses.findIndex((classObj) => classObj.class_name === className);
    let newGrouping = {
      grouping_name: groupingName,
      groupings: students,
      data: data,
    }
    let classId;
    if (selectedClassIndex === -1) {
      MixedApiService.insertNewClass(className)
        .then((res) => {
          classId = res.id;
        })
        .catch((error) => {
          this.setState({ error });
        })
    }
    else {
      classId = allClasses[selectedClassIndex].id;
    }
    newGrouping = {
      ...newGrouping,
      class_id: classId,
    }
    MixedApiService.insertNewGrouping(newGrouping)
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        this.setState({ error });
      })

    const { addStudentArr } = this.context;
    const { history } = this.props;
    addStudentArr(students);
    history.push('/my-groups');
  }

  // METHODS FOR DRAG AND DROP NAMES

  handleDragStart = (event, student) => {
    event.dataTransfer.setData("student", student);
  }

  handleDragOver = (event) => {
    event.preventDefault();
  }

  handleDrop = (event, newGroup) => {
    const { students } = this.state;
    const draggedStudent = event.dataTransfer.getData("student");
    // then set state for students
    let updatedStudent = students.filter((student) => {
      if (draggedStudent === student.alias) {
        student.groupNum = newGroup;
      }
      return student;
    })
    this.setState({ ...this.state, updatedStudent });
  }

  render() {
    const { show, groupNumbers, students, allClasses } = this.state;
    const categoryNames = ls.get('categoryNames')

    const showGroupings = (
      groupNumbers.map((groupNumber) => (
        <div
          key={groupNumber}
          className="groups-made-page__group"
          onDragOver={(event) => this.handleDragOver(event)}
          onDrop={(event) => {this.handleDrop(event, groupNumber)}}
        >
          Group {groupNumber}
          {students.map((student, idx) => {
            if (student.groupNum === groupNumber) {
              return (
                <div 
                  key={idx + 1}
                  className="groups-made-page__student"
                  onDragStart={(event) => {this.handleDragStart(event, student.alias)}}
                  draggable
                >
                  {student.alias}
                <div className="groups-made-page__tooltip">
                  {categoryNames.map((category, index) => (
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

    return (
      <main className="groups-made-page">
        <h1>Groupings</h1>
        <p>Drag and drop students to rearrange groups.</p>
        <form className="groups-made-page__form" onSubmit={this.handleSubmit}>
          <div className="groups-made-page__groupings">
          {showGroupings}
          </div>
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
        <SaveGroups
          classes={allClasses}
          show={show}
          handleClose={this.hideSaveModal}
          handleSave={this.saveGroups}
        />
      </main>
    )
  }
}

export default GroupsMadePage;

GroupsMadePage.contextType = MixEdContext;
