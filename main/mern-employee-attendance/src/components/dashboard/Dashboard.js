import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from "axios";

class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  constructor(props) {
    super(props);
    this.state = {
      attend: []
    }
  }

  componentWillMount() {
    // console.log(this.props)
    axios.get(`/api/users/getattendance/${this.props.auth.user.id}`).then(resp => {
      let userData = resp.data
      this.setState({ attend: userData })
    });
    // this.forceUpdate()

  }
  async getArray() {
    return await axios.get(`/api/users/getattendance/${this.props.auth.user.id}`);
  }

  render() {
    const { user } = this.props.auth;
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4><b>Hello</b> {user.name.split()[0]}!</h4>
            <table style={{ width: "100%" }}>
              <tr>
                <th>Date</th>
                <th>Attendance</th>
              </tr>
              {this.state.attend.map(elem => <tr><td>{elem["date"]}</td><td>{elem["marking"]}</td></tr>)}
            </table>
            {/* <TableView data={this.state.attend} columns={COLUMNS} /> */}
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );

  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);