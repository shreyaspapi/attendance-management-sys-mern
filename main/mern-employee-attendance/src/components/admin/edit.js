import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { logoutUser } from "../../actions/authActions";


class Admin extends Component {

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  constructor(props) {
    super(props);

    this.onSubmitClick = this.onSubmitClick.bind(this);

    this.state = {
      attendance: [],
      emp_ids: []
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

clickChange(el){
  if(el.marking===true){
    el.marking=false;
  }
  else el.marking=true
  
  this.setState({
    emp_ids: this.state.emp_ids.concat(el._id)
  })
  this.forceUpdate()

}
  attendanceList() {
    return this.state.attendance.map((el, i) => <tr>
      <td> {el.email} </td>
      <td>
        <button onClick={()=>{this.clickChange(el)}} key={i} style={!el.marking ? {background:'red'}:{background:'green'}}>-</button>
      </td>
    </tr>
    )
  }

  onSubmitClick() {
    console.log(this.state.emp_ids)
    let attendance = this.state.emp_ids;
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
        <Link to="/admin" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> admin
            </Link>
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
            {this.attendanceList()}
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
            onClick={this.onSubmitClick}
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
