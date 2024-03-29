// The program for the frontend of events
// PROGRAMMER: Bryan, Domica, and Philip
// The program is called when the user routes to /event
// Revised on 5/5/2022

import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import "./eventPage.css";
import Axios from "axios"; 
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import AuthService from "../services/auth.service";


var params = require("../params/params");

const APIallEvents = params.baseBackURL + "/allevents";
const API_Query = params.baseBackURL + "/file/";
const currentUser = AuthService.getCurrentUser();
const eventAPI = params.baseBackURL + "/event/";



class OneEvent extends React.Component {
                                /*
      This component is to render the details of the event in the event widget
    */
    render() {
        let data = this.props.data[1];
        let link_detail = "/event/" + data.eventID;
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
                               /*
      This component is a the backbone for the all events page
    */
    constructor(props) {
        super(props);
        this.state = {
            events: {},
            currentUser: AuthService.getCurrentUser(),
            searchTerm: "",
            filterTerm:""
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
                          /*
      This function is used to called to change the input to the search bar so the events can be filtered
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called after the user changes any input in the search bar 
    */
      this.setState({
        searchTerm: e.target.value
      });
    }

    onChangeFilter = (e) => {
                                /*
      This function is used to called to filter based on the searched input in the search bar
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called simultaneously after the user changes any input in the search bar 
    */
      this.setState({
        filterTerm: e.target.value
      });
    }

    matchCategory(event){
      return this.state.filterTerm === event.activityCategory
    }

    submitFilter = (e) => {
                                /*
      This function is used to submit the filtering request
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called simultaneously after the user changes any input in the search bar 
    */
      e.preventDefault()

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
            <p>Filter by interest:</p>
            {/* Add Filtering options by interest*/}
              <Form.Select name="activityCategory" type="text" value = {this.state.filterTerm} onChange={this.onChangeFilter}>
                  <option value="">None</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Soccer">Soccer</option>
                  <option value="Hiking">Hiking</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Boardgame">Board Games</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Running">Running</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Drinking">Drinking</option>
                  <option value="Study">Study</option>
                  <option value="Movies">Movies</option>
                  <option value="FratParty">Frat Parties</option>
                  <option value="Athletics">Athletics</option>
                  <option value="Arts">Arts</option>
                  <option value="Cooking">Cooking</option>
              </Form.Select>
            <div className="filter options-outline">
                
            </div>
            <h2>Here are the events</h2>
            <hr></hr>
            {e.length > 0 && 
              (e.filter((val) => {
                if (this.state.filterTerm == "") {
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
                }
                else  {
                  if (this.state.filterTerm.toLowerCase() == val[1].activityCategory.toLowerCase()) {
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
                  }
                }
              })).map((data, index) => <OneEvent data={data} key={index}/>)}
          </Container>
        );
    }
}

class EventWidget extends React.Component{
                            /*
      This component is a specific event widget displayed in vertical fashion in the all events page
    */
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
      let currentUser = AuthService.getCurrentUser();
      if (currentUser !== null) {
        fetch(this.props.api, {
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
      let events = (this.state.events)? Object.entries(this.state.events): {};
      let disp_events =  (this.state.events)? Object.entries(this.state.events).slice(0,5): null;
      let title = this.state.title;
      //let type = this.state.type;
      let path = "featured" + this.state.type;
      let nullevents;

      if (this.state.type == "/interest") {
        nullevents = (
          <h6>
            State your interests <a href="/accountSetting">here!</a>
          </h6>
        );
      } else if (this.state.type == "/upcoming") {
        nullevents = (
          <h6>
            Create your own events <a href="/createevent">here!</a>
          </h6>
        );
      } else if (this.state.type == "/starred") {
        nullevents = (
          <h6>
            You have not favorited any events
          </h6>
        );
      }
      return (
        <Card style={{ maxHeight: "22rem", marginBottom: "0px" }}>
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
              {events.length>0 ? (
                disp_events.map((data) => (
                  <Col
                    style={{ justifyContent: "center", display: "flex" }}
                  >
                    <EventCard data={data} />
                  </Col>
                ))
              ) : (
                <div>
                  <h5>Sorry, we currently have no events for you</h5>
                  {nullevents}
                </div>
              )}
            </Row>
          </Card.Body>
        </Card>
      );
    }
}

function EventCard(props){
                              /*
      This is a functional component related to the event card which can be seen in the landing page of the app
    */
  let data = props.data[1];
  let eventId = data.eventID;
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

  async function joinTheEvent() {
                    /*
      This function is used to register the specific user to the event in the back-end
      This function will be called when the user clicks on the register event on the event card
    */
    const request = await Axios.post(
      `${params.baseBackURL}/event/register/${eventId}`,
      { id: currentUser._id },
      {
        headers: {
          "x-access-token": currentUser.accessToken,
        },
      }
    );
    if (request.status == 202) {
      alert("You have already registered for this event");
    } else if (request.status == 200) {
      alert("Succesfully registered for this event");
    }
  }

  const onLoadPic = async (e) => {
                        /*
      This function is used to show the picture in the event card
      This function will be called directly on rendering of the card
    */
    const img = document.querySelector("#event-pic");
    let api = API_Query + "event-" + eventId;
    const loadResult = await fetch(api, {
      method: "GET",
      headers: new Headers({
        "x-access-token": currentUser.accessToken,
      }),
    });
    const resultStatus = await loadResult.clone().status;
    const resultBlob = await loadResult.blob();
    if (resultStatus === 200) {
      img.crossOrigin = "anonymous";
      img.src = await URL.createObjectURL(resultBlob);
    }
  };

  return (
    <Card class="link" style={{ width: "12rem", height: "17.25rem" }}>
      <a href={link_detail}>
        <Card.Img
          id="event-pic"
          variant="top"
          style={{ height: "125px", objectFit: "cover" }}
          src={"/image/" + data.activityCategory + ".jpeg"}
          onLoad={onLoadPic}
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
              <Button variant="primary" className="mt-2" onClick={joinTheEvent}>
                Join
              </Button>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );

}
export {Event, EventWidget}
export default EventCard