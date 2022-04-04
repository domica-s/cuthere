import React, {useState} from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";
import AuthService from "../services/auth.service";
import logo from '../images/logo.jfif';
import moment from 'moment';


var params = require("../params/params");

const API = params.baseBackURL + "/event";

const quotaInvalidMsg = "Quota is invalid, please input a positive integer";

const currentUser = AuthService.getCurrentUser();
if (currentUser) {
    var _id = currentUser._id;
}

function Logo() {
    return(
        <Row xs="auto" className="justify-content-sm-center">
            <Col>
                <img className="mt-4" src={logo} alt="" width="100px"/>
            </Col>
        </Row>
    )
}

function Description() {
    return (
        <Container>
            <h2>Create Your Own Events</h2>
            <p>
                Remember to ask your friends to join!
            </p>
        </Container>
    )
}


class CreateEvent extends React.Component {

    constructor(props) {
        super(props);
        this.handleCreate = this.handleCreate.bind(this);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        this.onChangeStart = this.onChangeStart.bind(this);
        this.onChangeEnd = this.onChangeEnd.bind(this);
        this.onChangeQuota = this.onChangeQuota.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);

        this.state = {
            title: "",
            location: "",
            start: "",
            end: "",
            quota: 1,
            category: "Outdoor",
            quotaValidate: true,
        }
    }

    handleCreate(e) {
        e.preventDefault();
        if (!this.state.quotaValidate) {
            window.alert('Quota input is invalid');
        }
        else {
            let data = {
                title: this.state.title,
                location: this.state.location,
                start: this.state.start,
                end: this.state.end,
                quota: this.state.quota,
                category: this.state.category,
                _id: currentUser._id,
                sid: currentUser.sid,
            }
            fetch(API, {
                method: "POST",
                headers: new Headers({
                    "x-access-token": currentUser.accessToken,
                    "content-type": 'application/json'
                  }),
                body: JSON.stringify(data)                             
            })
            .then(res => {
                if (res.status === 200) {
                    window.alert("Event created successfully!");
                    document.getElementById("createEvent").reset();
                }
            })
        }
    }
    

    onChangeQuota(e) {
        let quotaInput = e.target.value;
        if (quotaInput < 0) {
            this.setState({
                quotaValidate: false
            });
        }
        else {
            this.setState({
                quota: quotaInput,
                quotaValidate: true
            });
        }
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onChangeLocation(e) {
        this.setState({
            location: e.target.value
        });
    }

    onChangeCategory(e) {
        this.setState({
            category: e.target.value
        });
    }

    onChangeStart(e) {
        this.setState({
            start: moment(e.target.value).toDate()
        });
    }

    onChangeEnd(e) {
        this.setState({
            end: moment(e.target.value).toDate()
        });
    }

    render() {
        return (
            <Container>
                <Logo/>
                <Description/>
    
                <Form id="createEvent" className="signin-form" onSubmit={this.handleCreate}>
    
                    <Form.Group className="mb-3" controlId="floatingInput">
                        <Form.Label>Title of your event</Form.Label>
                        <Form.Control name="title" type="text" placeholder="title" onChange={this.onChangeTitle} required/>
                    </Form.Group>
    
                    <Form.Group className="mb-3" controlId="floatingInput">
                        <Form.Label>Location</Form.Label>
                        <Form.Control name="location" type="text" placeholder="location" onChange={this.onChangeLocation} required/>
                    </Form.Group>
    
                    <Form.Group className="mb-3" controlId="floatingDate">
                        <Form.Label>Start Datetime</Form.Label>
                        <Form.Control name="start" type="datetime-local" placeholder="" onChange={this.onChangeStart} required/>
                    </Form.Group>     
    
                    <Form.Group className="mb-3" controlId="floatingDate">
                        <Form.Label>End Datetime</Form.Label>
                        <Form.Control name="end" type="datetime-local" placeholder="" onChange={this.onChangeEnd} required/>
                    </Form.Group>
    
                    <Form.Group className="mb-3" controlId="floatingInput">
                        <Form.Label>Quota {(!this.state.quotaValidate) && <p className="text-danger text-left">{quotaInvalidMsg}</p>}</Form.Label>
                        <Form.Control name="quota" type="number" placeholder="quota" onChange={this.onChangeQuota} required/>
                    </Form.Group>
    
                    <Form.Group className="mb-3" controlId="floatingInput">
                        <Form.Label>Category of your event</Form.Label>
                        <Form.Select name="category" onChange={this.onChangeCategory}>
                            <option value="Outdoor">Outdoor</option>
                            <option value="Indoor">Indoor</option>
                            <option value="Offline">Offline</option>
                            <option value="Online">Online</option>
                        </Form.Select>
                    </Form.Group>
    
                    <Form.Group className="mb3">
                        <Form.Control name="_id" value={_id} type="hidden"/>
                    </Form.Group>
    
                    <Button className="mb-5" variant="outline-warning" type="submit">
                        Create Event! 
                    </Button>
    
                </Form>
    
            </Container>
        )
    }
}

export {CreateEvent};