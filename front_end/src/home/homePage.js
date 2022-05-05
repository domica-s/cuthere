// The program for the frontend of home page after user login successfully
// PROGRAMMER: Bryan Wilson Kheng && Domica Santoso
// The program is called when the user routes to / after login successfully
// Revised on 5/5/2022

import React from "react";
import Button from "react-bootstrap/Button";
import {Feed} from "./feeds";
import Banner from "./banner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {EventWidget} from "../event/eventPage";
import AuthService from "../services/auth.service";

var params = require("../params/params");

class Home extends React.Component {
                              /*
        This is a class component to render when the client / user goes to the home page
    */
    constructor(props){
        super(props);
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            APIintEvents: params.baseBackURL + "/featured/interest",
            APIdiscEvents: params.baseBackURL + "/featured/discover",
            APInewEvents: params.baseBackURL + "/featured/new",
            APIsortEvents: params.baseBackURL + "/featured/upcoming",
            APIstarredEvents: params.baseBackURL + "/featured/starred",
        }
    }
    render() {
      var currentUser = AuthService.getCurrentUser();
      var sid = currentUser.sid
      return (
        <div>
          <Row className="mt-2 m-0" style={{ paddingTop: "20px" }}>
            <Col xl={9} lg={12}>
              <div style={{ paddingTop: "20px" }}>
                <Banner />
              </div>
              <div style={{ paddingBottom: "20px" }}>
                <EventWidget api={this.state.APInewEvents} />
              </div>
              <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                <EventWidget api={this.state.APIintEvents + "/" + sid} />
              </div>
              <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                <EventWidget api={this.state.APIstarredEvents + "/" + sid} />
              </div>
              <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                <EventWidget api={this.state.APIsortEvents} />
              </div>
              <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                <EventWidget api={this.state.APIdiscEvents + "/" + sid} />
              </div>
            </Col>
            <Col xl={3} lg={0}>
              <Feed />
            </Col>
          </Row>
        </div>
      );
    }
}

export {Home};