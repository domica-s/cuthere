import React from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {EventWidget} from "../event/eventPage"
import AuthService from "../services/auth.service";

var params = require("../params/params");

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            APIintEvents: params.baseBackURL + "/intevents",
            APIdiscEvents: params.baseBackURL + "/discoverevents",
            APInewEvents: params.baseBackURL + "/featured/new",
            APIsortEvents: params.baseBackURL + "/eventssortdate",
        }
    }
    render() {
        return (
          <div>
            {/* {this.state.currentUser ? ( */}
              <Row className="m-0">
                <Col md={10} xs={12}>
                  <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <EventWidget api={this.state.APInewEvents} />
                  </div>
                  {/* <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <EventWidget api={this.state.APInewEvents} />
                  </div>
                  <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <EventWidget api={this.state.APInewEvents} />
                  </div>
                  <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <EventWidget api={this.state.APInewEvents} />
                  </div> */}
                </Col>
                <Col md={2} xs={0}>
                  <h2>Feeds</h2>
                </Col>
              </Row>
            {/* ) : (
              <Row className="m-0">
                <Col md={6}>
                  <img src={require("./cuth.png")} />
                </Col>
                <Col
                  md={6}
                  xs={12}
                  style={{
                    height: "85vh",
                    backgroundColor: "beige",
                    paddingLeft: "30px",
                    textAlign: "left",
                  }}
                >
                  <div style={{ paddingTop: "6rem", paddingBottom: "2rem" }}>
                    <h2>Host or Attend Exciting Events!</h2>
                    <h5>Exclusive to CUHK Students</h5>
                  </div>
                  <div>
                    <h4>Join CUThere today.</h4>
                    <Button
                      href="/signup"
                      className="mb-3 m-2"
                      variant="warning"
                      onClick={this.handleSignUp}
                    >
                      Sign Up
                    </Button>
                    <h5>Already have an account?</h5>
                    <Button
                      href="/login"
                      className="mb-3 m-2"
                      variant="primary"
                      onClick={this.handleSignUp}
                    >
                      Login
                    </Button>
                  </div>
                </Col>
              </Row> */}
            {/* )} */}
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