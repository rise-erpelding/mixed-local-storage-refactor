import React, { Component } from 'react';
import './SavedGroupsPage.css';
// import store from '../../services/store';
import ls from 'local-storage';

class SavedGroupsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      students: [],
    }
  }

  componentDidMount() {
    const students = ls.get('studentArr');
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
    const { groups, students } = this.state;
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
      <main>
      <ul className="class-tab">
        <li className="class__selected">1st Period</li>
        <li>2nd Period</li>
        <li>3rd Period</li>
        <li>4th Period</li>
        <li>5th Period</li>
        <li className="class__new">+ New Class</li>
      </ul>
      <div className="class-groupings">
        <div className="groupings-list">
          <ul className="groupings-list__ul">
            <li><button>Pair work</button></li>
            <li><button>Threes</button></li>
            <li><button className="grouping__selected">Writing Groups</button></li>
            <li><button>Book Study</button></li>
            <li><button className="grouping__new">+ New Group</button></li>
          </ul>
        </div>
        <section className="groupings">
          <h1>Groupings</h1>
          <p>Click on a student to edit the group</p>
        <form>
        <div className="groupings__groups">
            {showGroupings}
        </div>
        <div>
          <button>View Data</button>
          <button>Delete Grouping</button>
          <button>Save Changes</button>
        </div>
      </form>
      </section>
      </div>
    </main>
    )
  }
}

export default SavedGroupsPage;