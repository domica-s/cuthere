import React from "react";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import "./eventPage.css";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import AuthService from "../services/auth.service";
import { auto } from "@popperjs/core";


var params = require("../params/params");

// const API = 'http://localhost:8080/allevents'
const APIallEvents = params.baseBackURL + "/allevents";

class OneEvent extends React.Component {
    // render one event
    render() {
        let data = this.props.data[1];
        return (
            <Container>
                <Row className="justify-content-sm-center">
                    <h3>{data.title}</h3>
                    <br/>
                    <p>Location: {data.venue}</p>
                    <br/>
                    <p>Date: {data.start}</p>
                    <br/>
                    <p>No. of participants: {data.numberOfParticipants} Quota: {data.quota}</p>
                    <br/> 
                    <p>Category: {data.activityCategory}</p>
                </Row>
                <hr/>
            </Container>
        );
    }
}

class Event extends React.Component {
   
    constructor(props) {
        super(props);
        this.state = {
            events: {},
            currentUser: AuthService.getCurrentUser()
        };
    }

    componentDidMount() {
      let currentUser = AuthService.getCurrentUser()
      if (currentUser === null) {
        
      }
      {currentUser !== null && fetch(APIallEvents, {
        method: "GET",
        headers: new Headers({
          "x-access-token": currentUser.accessToken
        })
      })
          .then(res => res.json())
          .then(data => {
              this.setState( {events: Object.entries(data)} )
          });}
    }
    render() {
        let e = this.state.events
        return(
            <Container>
                <h2>Here are the events</h2>
                {e.length > 0 && e.map((data, index) => <OneEvent data={data}/>)}
            </Container>
        );
    }
}

class EventWidget extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          title: "",
          events: {},
          currentUser: AuthService.getCurrentUser(),
        };
    }
    componentDidMount(){
      let currentUser = AuthService.getCurrentUser()
      if (currentUser === null) {
      }
      {
        currentUser !== null && fetch(this.props.api, {
            method: "GET",
            headers: new Headers({
              "x-access-token": currentUser.accessToken,
            }),
          })
          .then((res) => res.json())
          .then((data) => {
            this.setState({
              title: data.title,
              events: data.event_dic
            });
          });
      }
    }
    render(){
      let events = Object.entries(this.state.events)
      let disp_events =  Object.entries(this.state.events).slice(0,5)
      
      let title = this.state.title
        return (
          <Card style={{ maxHeight: "22rem" }}>
            <Card.Header style={{ textAlign: "left" }}>
              <a href="featured/new">
                <b>{title}</b>
              </a>
              <a href="featured/new" style={{ float: "right" }}>
                See all
              </a>
            </Card.Header>
            <Card.Body style={{ overflowY: "hidden" }}>
              <Row className="widget g-4">
                {events.length > 0 &&
                  disp_events.map((data) => (
                    <Col style={{ justifyContent: "center", display: "flex" }}>
                      <EventCard data={data} />
                    </Col>
                  ))}
              </Row>
            </Card.Body>
          </Card>
        );
    }
}

class EventCard extends React.Component {
    render(){
        let data = this.props.data[1];
        let date = new Date(data.date).toDateString()
        let time = new Date(data.date).toString().slice(16,21)
        let avail = data.numberOfParticipants + "/" + data.quota
        let quota;
        if(data.quota-data.numberOfParticipants>3){
          quota = <Badge pill bg="success">{avail}</Badge>;
        }
        else{
          quota = <Badge pill bg="warning">{avail}</Badge>;
        }
        return (
          <Card style={{ width: "12rem", height: "17.25rem" }}>
            <Card.Img
              variant="top"
              style={{ maxHeight: "200px" }}
              src={require("./basket.jpeg")}
            />
            <Card.Body>
              <Card.Title
                style={{
                  whiteSpace: "nowrap",
                  textAlign: "left",
                  width: "10rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                {data.title}
              </Card.Title>
              <div style={{ height: "2.75rem" }}>
                <p className="text">
                  {date}
                  <span style={{ float: "right" }}>
                    <Badge bg="dark">{time}</Badge>
                  </span>
                </p>
                <p className="text">{data.venue}</p>
              </div>
              <Container style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                <Row>
                  <Col xs={8}>
                    <h6 style={{ height: "1.2rem", textAlign: "left" }}>
                      {" "}
                      <Badge bg="secondary">{data.activityCategory}</Badge>
                    </h6>
                    <p className="text">Quota: {quota}</p>
                  </Col>
                  <Col style={{ paddingLeft: "0" }} xs={4}>
                    <Button variant="primary" className="mt-2">
                      Join
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
        );  
    }
}

export {Event, EventWidget, EventCard}