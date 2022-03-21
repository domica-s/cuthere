import React from "react";
import { Container } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import "./eventPage.css";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

const API = '../../allevents'

class OneEvent extends React.Component {

    render() {
        let data = this.props.data[1];
        console.log(data[1]);
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
        };
    }

    componentDidMount() {
        fetch(API)
            .then(res => res.json())
            .then(data => {
                console.log('Received events: ', Object.entries(data));
                this.setState( {events: Object.entries(data)} )
            });
    }

    render() {
        let e = this.state.events
        return(
            <Container>
                <EventCard />
                <h2>Here are the events</h2>
                {e.length > 0 && e.map((data, index) => <OneEvent data={data}/>)}
            </Container>
        );
    }
}

class EventCard extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
          <Card
            style={{width: "12rem", height: "17.5rem",display: "block",overflow: "hidden",whiteSpace: "nowrap",
            }}
          >
            <Card.Img variant="top" src={require("./basket.jpeg")} />
            <Card.Body>
              <Card.Title
                style={{textAlign: "left",width: "10rem",textOverflow: "ellipsis",overflow: "hidden",}}
              >
                CUHK ID
              </Card.Title>
              <div style={{ height: "2rem" }} className="row">
                <div
                  className="column text">
                  <p style ={{textOverflow: "ellipsis",overflow: "hidden",textAlign: "left"}}>New Asia</p>
                </div>
                <div className="column text" style={{textAlign: "right",}}>
                  09.00 21/02
                </div>
              </div>
              <h6 style={{ textAlign: "left" }}>
                {" "}
                <Badge bg="secondary">Basketball</Badge>
              </h6>
              <p style={{ textAlign: "left", fontSize: "15px" }}>
                Quota:{" "}
                <Badge pill bg="dark">
                  8/111
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