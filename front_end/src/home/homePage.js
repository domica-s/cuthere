import React from "react";
import Button from "react-bootstrap/Button";
import {Feed} from "./feeds";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {EventWidget} from "../event/eventPage";
import AuthService from "../services/auth.service";

var params = require("../params/params");

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            APIintEvents: params.baseBackURL + "/featured/interest",
            APIdiscEvents: params.baseBackURL + "/featured/discover",
            APInewEvents: params.baseBackURL + "/featured/new",
            APIsortEvents: params.baseBackURL + "/featured/upcoming",
        }
    }
    render() {
        return (
          <div>
            <Row className="m-0">
              <Col md={9} xs={12}>
                <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                  <EventWidget api={this.state.APInewEvents} type={"get"} />
                </div>
                <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                  <EventWidget api={this.state.APIintEvents} type={"post"} />
                </div>
                <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                  <EventWidget api={this.state.APIsortEvents} type={"get"} />
                </div>
                <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                  <EventWidget api={this.state.APIdiscEvents} type={"post"} />
                </div>
              </Col>
              <Col md={3} xs={0}>
                <h2>Feeds</h2>
                <Feed/>
              </Col>
            </Row>
          </div>
        );
    }
}

class About extends React.Component {
    render() {
        return (
            <div className="container"> 
                About Page 
            </div>
        )
    }
}

export {Home, About}