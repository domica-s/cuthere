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
        this.onChangeChat = this.onChangeChat.bind(this);

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
            chatInput: ""
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
        .then(data => {
            window.alert(data.message);
            window.location.reload(false);
        })
    }

    onUnregister(e) {
        let API_register = API + 'unregister/' + this.props.eventId;
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
        .then(data => {
            window.alert(data.message);
            window.location.reload(false);
        })
    }

    onChangeChat(e) {
        this.setState({
            chatInput: e.target.value
        });
    }
    
    onSend(e) {
        e.preventDefault();
        let API_register = API + 'chat/' + this.props.eventId;
        let data = { 
            sid: currentUser.sid,
            content: this.state.chatInput
        };
        fetch(API_register, {
            method: "POST",
            headers: new Headers({
                "x-access-token": currentUser.accessToken,
                "content-type": 'application/json'
              }),
            body: JSON.stringify(data)             
        })
        .then(res => res.json())
        .then(data => {
            window.alert(data.message);
            window.location.reload(false);
        })
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
                <Button className="mb-2 mx-2" variant="outline-danger" type="button" onClick={this.onUnregister}>Unregister</Button>
                <p>Status: {this.state.status}</p>
                <p>Start time: {this.state.start}</p>
                <p>End time: {this.state.end}</p>
                <p>Number of participants: {this.state.numberOfParticipants}</p>
                <p>Quota: {this.state.quota}</p>
                <p>Activity Category: {this.state.activityCategory}</p>
                <div className="overflow-auto bg-dark" style={{ maxHeight: "260px", textAlign: "left" }}>
                    {this.state.chatHistory.length > 0 && this.state.chatHistory.map((chat, i) => <OneChat chat={chat} key={i}/>)}
                </div>
                <Form  onSubmit={this.onSend}>
                    <Form.Group className="mb-3" controlId="chat-area">
                        <Form.Label>Chat</Form.Label>
                        <Form.Control as="textarea" rows={3} onChange={this.onChangeChat}/>
                    </Form.Group>
                    <Button className="mb-5" variant="outline-warning" type="submit">
                        Send
                    </Button>                                    
                </Form>          
            </Container>
        )
    }
}

class OneChat extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let chat = this.props.chat;
        let content = chat.content;
        let username = chat.user.username;
        let chatAt = chat.chatAt;
        return (
            <div className="bg-dark text-warning">
                <p>Time posted: {chatAt}</p>
                <p>user: {username}</p>
                <p>content: {content}</p>
                <hr/>
            </div>
        );
    }

}


export {EventDetail}