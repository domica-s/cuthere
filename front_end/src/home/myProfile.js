import React, { Component } from "react";
import AuthService from "../services/auth.service";
import { Navigate } from "react-router-dom";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: AuthService.getCurrentUser()
    };
  }
  render() {
    const { currentUser } = this.state;
    if (currentUser) {
      return (
        <div className="container">
          <header className="jumbotron">
            <h3>
              <strong>{currentUser.username}</strong> Profile
            </h3>
          </header>
          <p>
            <strong>Token:</strong>{" "}
            {currentUser.accessToken.substring(0, 20)} ...{" "}
            {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
          </p>
          <p>
            <strong>Id:</strong>{" "}
            {currentUser.id}
          </p>
          <p>
            <strong>SID:</strong>{" "}
            {currentUser.sid}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            {currentUser.role}
          </p>
        </div>
      );
    }
    else {
      return <Navigate to="/login" />;
    }
  }
}