import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";

const Attendance = props => (
    
    <tr>
        <td> {props.attendance.email} </td>
        <td> 
            <input type="checkbox" defaultChecked={props.attendance.marking} onChange={() => {props.changeAttendance(props.attendance._id)}} />
         </td>
    </tr>
)


class Admin extends Component {
  constructor(props) {
    super(props);

    this.changeAttendance = this.changeAttendance.bind(this);

    this.state = {
        attendance: []
    };

  }

  componentWillMount() {
    axios.post('/api/users/attendancebydateid/' + this.props.match.params.id)
      .then(response => {
          console.log(response)
        this.setState({ 
            attendance: response.data.attendance
         });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  setAttendance(att) {
    this.setState({
        attendance: att
    })
  }

  changeAttendance(id) {
    let attendance1 = this.state.attendance;
    attendance1.forEach(ele => {
        if(ele["_id"] === id) {
            if(ele["marking"] === true){
                ele["marking"] = false
            } else {
                ele["marking"] = true
            }
        }
    })

    this.setAttendance(attendance1)

  }

  attendanceList() {
      return this.state.attendance.map(el => {
        return <Attendance attendance={el} changeAttendance={this.changeAttendance} key={el._id}/>;
      })
  }

  onSubmitClick() {
      let attendance = this.state.attendance
    axios.post('/api/users/update/' + this.props.match.params.id, { attendance })
    .then(response => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render() {    
    return (
      <React.Fragment>
        <div className="col s12 center-align">
            <h4 >Attendance Edit</h4>
        </div>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Email</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
              { this.attendanceList() }
          </tbody>
        </table>
        <div className="col s12 center-align">
        <button
              style={{
                  width: "150px",
                  height: "50px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem",
                }}
              onClick={this.onSubmitClick()}
              className="btn waves-effect waves-light hoverable blue accent-3"
            >
              Submit
            </button>
            </div>
            <div className="col s12 center-align">
            <button
              style={{
                  width: "150px",
                  height: "50px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem",
                }}
              onClick={this.onLogoutClick}
              className="btn waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
            </div>
      </React.Fragment>
    )
  }
}
Admin.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth
  });
  export default connect(
    mapStateToProps,
    { logoutUser }
  )(Admin);
