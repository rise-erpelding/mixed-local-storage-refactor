import React, { Component } from 'react';
import SaveGroups from '../../components/SaveGroups/SaveGroups';
import MixEdContext from '../../context/MixEdContext';
import ls from 'local-storage';
import './GroupsMadePage.css';

class GroupsMadePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      students: [],
      groups: [],
      groupingName: '',
      className: '',
    }
  }

  componentDidMount() {
    const students = ls.get('studentArr');
    console.log(students);
    this.setState({ students: students });
    this.getGroups(students);
  }


  getGroups = (studentsArr) => {
    const groupNums = [];
    // get all the group numbers for all the students and push into arr
    studentsArr.forEach((student) => {
      groupNums.push(student.groupNum);
    })
    // create array with a set containing only unique items
    const groups = Array.from(new Set(groupNums));
    groups.sort((a, b) => a - b);
    this.setState({ groups: groups });
    console.log(groups);
  }

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
  
  showSaveModal = () => {
    this.setState({ show: true });
  }

  hideSaveModal = () => {
    this.setState({ show: false });
  }

  saveGroups = (groupingName, className) => {
    // currently this isn't really functional but we do update the students in local storage at this point
    this.setState({ groupingName, className });
    const { students } = this.state;
    const { addStudentArr } = this.context;
    addStudentArr(students);
    console.log(`saving groups to database under name ${groupingName} and class ${className}`);
  }

  handleDragStart = (event, student) => {
    event.dataTransfer.setData("student", student);
  }

  onDragOver = (event) => {
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
    const { show, groups, students } = this.state;
    const primaryCat = ls.get('primaryCat');
    const secondaryCat = ls.get('secondaryCat');
    const showGroupings = (
      groups.map((group) => (
        <div
          key={group}
          className="groups-made-page__group"
          onDragOver={(event) => this.onDragOver(event)}
          onDrop={(event) => {this.handleDrop(event, group)}}
        >
          Group {group}
          {students.map((student, idx) => {
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
                  <p>{`${primaryCat}: ${student[primaryCat]}`}</p>
                  <p>{`${secondaryCat}: ${student[secondaryCat]}`}</p>
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
