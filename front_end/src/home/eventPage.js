import React from "react";
import { Container } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import AuthService from "../services/auth.service";

const API = 'http://localhost:8080/allevents'

class OneEvent extends React.Component {

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
        fetch(API, {
          method: "GET",
          headers: new Headers({
            "x-access-token": currentUser.accessToken
          })
        })
            .then(res => res.json())
            .then(data => {
                this.setState( {events: Object.entries(data)} )
            });
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

export {Event}