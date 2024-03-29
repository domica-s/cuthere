// The program for the frontend create event page
// PROGRAMMER: ETHAN LEE
// The program is called when the user routes to /createEvent
// Revised on 5/5/2022


import React from "react";
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

const quotaInvalidMsg = "Quota is invalid, it should be at least 1";

const currentUser = AuthService.getCurrentUser();
if (currentUser) {
    var _id = currentUser._id;
}

function Logo() {
        /*
      This function is used to render the logo of our project 
      The function is called upon rendering the create event page
    */ 
    return(
        <Row className="justify-content-sm-center">
            <Col>
                <img className="mt-4" src={logo} alt="" width="100px"/>
            </Col>
        </Row>
    )
}

function Description() {
            /*
      This function is used to render the description of our project
      The function is called upon rendering the create event page
    */ 
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
            category: "",
            quotaValidate: true,
        }
    }

    handleCreate(e) {
            /*
      This function is used to handle the creation of the event --> Passing the data to the back-end and send the necessary response
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called after the user submit the data for the event creation
    */
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
                    /*
      This function is used to called to call the setState to change this component's quota variable
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called after the user changes any input related to the quota data field
    */
        let quotaInput = e.target.value;
        if (quotaInput < 1) {
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
                            /*
      This function is used to called to call the setState to change this component's title variable
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called after the user changes any input related to the title data field
    */
        this.setState({
            title: e.target.value
        });
    }

    onChangeLocation(e) {
            /*
      This function is used to called to call the setState to change this component's location variable
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called after the user changes any input related to the location data field
    */
        this.setState({
            location: e.target.value
        });
    }

    onChangeCategory(e) {
            /*
      This function is used to called to call the setState to change this component's category variable
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called after the user changes any input related to the category data field
    */
        this.setState({
            category: e.target.value
        });
    }

    onChangeStart(e) {
            /*
      This function is used to called to call the setState to change this component's start date variable
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called after the user changes any input related to the start date data field
    */
        this.setState({
            start: moment(e.target.value).toDate()
        });
    }

    onChangeEnd(e) {
        /*
      This function is used to called to call the setState to change this component's end date variable
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called after the user changes any input related to the end date data field
    */
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
                        <Form.Select name="category" onChange={this.onChangeCategory} required>
                            <option value="">None</option>
                            <option value="Basketball">Basketball</option>
                            <option value="Badminton">Badminton</option>
                            <option value="Soccer">Soccer</option>
                            <option value="Football">Football</option>
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