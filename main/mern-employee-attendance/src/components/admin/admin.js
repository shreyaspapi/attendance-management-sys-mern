import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";


const Attendance = props => (
    <tr>
        <td> {props.dates.date} </td>
        <td> 
            <Link to={"/edit/"+props.dates._id}>edit</Link> | <a href="#" onClick={() => {props.deleteAttendance(props.dates._id)}}>delete</a>
         </td>
    </tr>
)


class Admin extends Component {
  constructor(props) {
    super(props);

    this.deleteAttendance = this.deleteAttendance.bind(this);

    this.state = {
        dates: [],
        attendance_id: ''
    };

  }

  componentWillMount() {
    axios.get('/api/users/getdates')
      .then(response => {
        this.setState({ dates: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  deleteAttendance(id) {
    axios.delete("/api/users/" + id)
         .then(res => console.log(res.data));
         this.setState({
             dates: this.state.dates.filter(el => el._id !== id)
         })

  }

  attendanceList() {
      return this.state.dates.map(el => {
        return <Attendance dates={el} deleteAttendance={this.deleteAttendance} key={el._id}/>;
      })
  }

  render() {
    return (
      <React.Fragment>
        <div className="col s12 center-align">
            <h4 >Attendance</h4>
        </div>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
              { this.attendanceList() }
          {/* {this.state.dates.map(elem => <tr><td>{elem["date"]}</td><td>{elem["_id"]}</td></tr>)} */}
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
