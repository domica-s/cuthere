import React from "react";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import "./eventPage.css";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import AuthService from "../services/auth.service";


var params = require("../params/params");

// const API = 'http://localhost:8080/allevents'
const APIallEvents = params.baseBackURL + "/allevents";
const APInewEvents = params.baseBackURL + "/newestevents";

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
                    <p>Date: {data.date}</p>
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
                <EventWidget />
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
        currentUser !== null && fetch(APInewEvents, {
            method: "GET",
            headers: new Headers({
              "x-access-token": currentUser.accessToken,
            }),
          })
          .then((res) => res.json())
          .then((data) => {
            this.setState({
              title: data.title,
              events: Object.entries(data.event_dic)
            });
          });
      }
    }
    render(){
      let events = this.state.events
      let title = this.state.title
        return (
          <Card>
            <Card.Header style={{ textAlign: "left" }}>
              {title}
              <a href="/event" style={{ float: "right" }}>
                See all
              </a>
            </Card.Header>
            <Card.Body>
              <Row className="widget g-4">
                {events.length > 0 &&
                  events.map((data, index) => (
                    <Col>
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
        return (
          <Card 
            style={{width: "12rem", height: "17.5rem",display: "block",overflow: "hidden",whiteSpace: "nowrap"}}>
            <Card.Img variant="top" style={{maxHeight: "200px"}} src={require("./basket.jpeg")} />
            <Card.Body>
              <Card.Title
                style={{textAlign: "left",width: "10rem",textOverflow: "ellipsis",overflow: "hidden",}}>
                {data.title}
              </Card.Title>
              <div style={{ height: "2rem" }} className="row">
                <div
                  className="column text">
                  <p style ={{textOverflow: "ellipsis",overflow: "hidden",textAlign: "left"}}>{data.venue}</p>
                </div>
                <div className="column text" style={{textAlign: "right",}}>
                  {data.date}
                </div>
              </div>
              <h6 style={{ textAlign: "left" }}>
                {" "}
                <Badge bg="secondary">{data.activityCategory}</Badge>
              </h6>
              <p style={{ textAlign: "left", fontSize: "15px" }}>
                Quota:{" "}
                <Badge pill bg="dark">
                  {data.numberOfParticipants}
                </Badge>
                <span style={{ float: "right" }}>
                  <Button variant="primary" size="sm">
                    Join
                  </Button>
                </span>
              </p>
            </Card.Body>
          </Card>
        );  
    }
}

export {Event}