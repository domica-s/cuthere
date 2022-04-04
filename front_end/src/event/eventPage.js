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
const APIgetFile = params.baseBackURL + "/file/";

class OneEvent extends React.Component {
    // render one event
    render() {
        let data = this.props.data[1];
        let link_detail = "/event/" + data.eventID;
        // console.log(link_detail);
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
                    <Button href={link_detail} variant="outline-primary" type="button">Click to see the details!</Button>
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
            currentUser: AuthService.getCurrentUser(),
            searchTerm: ""
        };

        this.onChangeSearch = this.onChangeSearch.bind(this);
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

    onChangeSearch(e) {
      this.setState({
        searchTerm: e.target.value
      });
    }

    render() {
        let e = this.state.events;
        
        return(
          <Container className="my-5">
            {/* add search bar */}
            <div className="search form-outline">
              <input type="search" placeholder="Type query" className="form-control" aria-label="Search"
                value={this.state.searchTerm} onChange={this.onChangeSearch}
              />
            </div>
            <h2>Here are the events</h2>
            <hr></hr>
            {e.length > 0 && 
              (e.filter((val) => {
                
                if (this.state.searchTerm == "") {
                  return val
                }
                else {
                  if (val[1].title.toLowerCase().includes(this.state.searchTerm.toLowerCase())) {
                    return val
                  }
                  if (val[1].activityCategory.toLowerCase().includes(this.state.searchTerm.toLowerCase())) {
                    return val
                  }
                  if (val[1].venue.toLowerCase().includes(this.state.searchTerm.toLowerCase())) {
                    return val
                  }
                }
              })).map((data, index) => 
              <OneEvent data={data} key={index}/>
            )}
          </Container>
        );
    }
}

class EventWidget extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          title: "",
          type: "",
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
              type: data.type,
              events: data.event_dic
            });
          });
      }
    }
    render(){
      let events = (this.state.events)? Object.entries(this.state.events): null;
      let disp_events =  (this.state.events)? Object.entries(this.state.events).slice(0,5): null;
      
      let title = this.state.title
      let path = "featured" + this.state.type
        return (
          <Card style={{maxHeight: "22rem", marginBottom: "0px"}}>
            <Card.Header style={{ textAlign: "left" }}>
              <a href={path}>
                <b>{title}</b>
              </a>
              <a href={path} style={{ float: "right" }}>
                See all
              </a>
            </Card.Header>
            <Card.Body style={{ overflowY: "hidden" }}>
              <Row className="widget g-4">
                {events &&
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
  /*
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: ""
    };
  }
  componentDidMount() {
    let currentUser = AuthService.getCurrentUser();
    if (currentUser === null) {
    }
    {
      currentUser !== null &&
        fetch(APIgetFile + data.filename, {
          method: "GET",
          headers: new Headers({
            "x-access-token": currentUser.accessToken,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            this.setState({
              fileUrl: data.fileUrl,
            });
          });
    }
  }*/
  render() {
    let data = this.props.data[1];
    let date = new Date(data.start).toDateString();
    let time = new Date(data.date).toString().slice(16, 21);
    let avail = data.numberOfParticipants + "/" + data.quota;
    let link_detail = "/event/" + data.eventID;
    let quota;
    if (data.quota - data.numberOfParticipants > 3) {
      quota = (
        <Badge pill bg="success">
          {avail}
        </Badge>
      );
    } else {
      quota = (
        <Badge pill bg="warning">
          {avail}
        </Badge>
      );
    }
    return (
      <Card class="link" style={{ width: "12rem", height: "17.25rem" }}>
        <a href={link_detail}>
          <Card.Img
            variant="top"
            style={{ maxHeight: "200px" }}
            src={require("../images/basket.jpeg")}
          />
        </a>
        <Card.Body>
          <a href={link_detail}>
            <Card.Title
              style={{
                color: "black",
                whiteSpace: "nowrap",
                textAlign: "left",
                width: "10rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "125%",
              }}
            >
              <b>{data.title}</b>
            </Card.Title>
            <div style={{ color: "black", height: "2.75rem" }}>
              <p className="text">
                {date}
                <span style={{ float: "right" }}>
                  <Badge bg="dark">{time}</Badge>
                </span>
              </p>
              <p className="text">{data.venue}</p>
            </div>
          </a>
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