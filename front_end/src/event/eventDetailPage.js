import React from "react";
import Container from "react-bootstrap/Container";
import {useParams} from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AuthService from "../services/auth.service";

var params = require("../params/params");
var currentUser = AuthService.getCurrentUser();
const API = params.baseBackURL + "/event/";


function EventDetail() {
    let { id } = useParams();
    return (
        <OneEvent eventId={id}/>
    )
}

class OneEvent extends React.Component {
    constructor(props) {
        super(props);

        this.onRegister = this.onRegister.bind(this);
        this.onUnregister = this.onUnregister.bind(this);
        this.onSend = this.onSend.bind(this);

        this.state = {
            title: "",
            status: "",
            venue: "",
            start: "",
            end: "",
            numberOfParticipants: 0,
            quota: 0,
            activityCategory: "",
            chatHistory: [],
            createdAt: "",
        };
    }

    onRegister(e) {
        let API_register = API + 'register/' + this.props.eventId;
        let data = { _id: currentUser._id };
        fetch(API_register, {
            method: "POST",
            headers: new Headers({
                "x-access-token": currentUser.accessToken,
                "content-type": 'application/json'
              }),
            body: JSON.stringify(data)     
        })
        .then(res => res.json())
        .then(data => window.alert(data.message))
    }

    onUnregister(e) {
        let API_register = API + 'register/' + this.props.eventId;
        let data = { _id: currentUser._id };
        fetch(API_register, {
            method: "POST",
            headers: new Headers({
                "x-access-token": currentUser.accessToken,
              }),
            body: JSON.stringify(data)             
        })
        .then(res => res.json())
        .then(data => window.alert(data.message))
    }
    
    onSend(e) {
        let API_register = API + 'register/' + this.props.eventId;
        let data = { _id: currentUser._id };
        fetch(API_register, {
            method: "POST",
            headers: new Headers({
                "x-access-token": currentUser.accessToken,
              }),
            body: JSON.stringify(data)             
        })
        .then(res => res.json())
        .then(data => window.alert(data.message))
    }

    componentDidMount() {
        let API_event = API + this.props.eventId;
        if (currentUser !== null){
            fetch(API_event, {
                method: "GET",
                headers: new Headers({
                    "x-access-token": currentUser.accessToken,
                  }),
            })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    title: data.title,
                    status: data.status,
                    venue: data.venue,
                    start: data.start,
                    end: data.end,
                    numberOfParticipants: data.numberOfParticipants,
                    quota: data.quota,
                    activityCategory: data.activityCategory,
                    chatHistory: data.chatHistory,
                    createdAt: data.createdAt
                });
            })            
        }
    }
    render() {
        return (
            <Container>
                <h2>Title: {this.state.title}</h2>
                <Button className="mb-2 mx-2" variant="outline-success" type="button" onClick={this.onRegister}>Register</Button>
                <Button className="mb-2 mx-2" variant="outline-danger" type="button">Unregister</Button>
                <p>Status: {this.state.status}</p>
                <p>Start time: {this.state.start}</p>
                <p>End time: {this.state.end}</p>
                <p>Number of participants: {this.state.numberOfParticipants}</p>
                <p>Quota: {this.state.quota}</p>
                <p>Activity Category: {this.state.activityCategory}</p>
                <p>Chat History: {this.state.chatHistory}</p> 
                <Form>
                    <Form.Group className="mb-3" controlId="chat-area">
                        <Form.Label>Chat</Form.Label>
                        <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                    <Button className="mb-5" variant="outline-warning" type="submit">
                        Send
                    </Button>                                    
                </Form>          
            </Container>
        )
    }
}


export {EventDetail}