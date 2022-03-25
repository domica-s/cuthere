import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {EventWidget} from "./eventPage"

var params = require("../params/params");

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            APIintEvents: params.baseBackURL + "/intevents",
            APIdiscEvents: params.baseBackURL + "/discoverevents",
            APInewEvents: params.baseBackURL + "/newestevents",
            APIsortEvents: params.baseBackURL + "/eventssortdate",
        }
    }
    render() {
        return (
          <div className="container">
            Home Page of CUthere
            <Container>
              <Row>
                <Col xs={9}>
                  <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <EventWidget api={this.state.APInewEvents} />
                  </div>
                  <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <EventWidget api={this.state.APInewEvents} />
                  </div>
                  <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <EventWidget api={this.state.APInewEvents} />
                  </div>
                  <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <EventWidget api={this.state.APInewEvents} />
                  </div>
                </Col>
                <Col xs={3}>
                  <h2>Feeds</h2>
                </Col>
              </Row>
            </Container>
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