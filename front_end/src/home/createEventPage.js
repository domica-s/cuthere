import React from "react";
import Datetime from 'react-datetime';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";
import AuthService from "../services/auth.service";
import logo from '../logo.jfif';


var params = require("../params/params");

const API = params.baseBackURL + "/event";

const currentUser = AuthService.getCurrentUser();
const _id = currentUser.user._id;

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

function CreateEvent() {

    return (
        <Container>
            <Logo/>
            <Description/>

            <Form className="signin-form" action={API} method="POST">

                <Form.Group className="mb-3" controlId="floatingInput">
                    <Form.Label>Title of your event</Form.Label>
                    <Form.Control name="title" type="text" placeholder="title" required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="floatingInput">
                    <Form.Label>Location</Form.Label>
                    <Form.Control name="location" type="text" placeholder="location" required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="floatingDate">
                    <Form.Label>Start Datetime</Form.Label>
                    <Form.Control name="start" type="datetime-local" placeholder="" required/>
                </Form.Group>     

                <Form.Group className="mb-3" controlId="floatingDate">
                    <Form.Label>End Datetime</Form.Label>
                    <Form.Control name="end" type="datetime-local" placeholder="" required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="floatingInput">
                    <Form.Label>Quota</Form.Label>
                    <Form.Control name="quota" type="number" placeholder="quota" required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="floatingInput">
                    <Form.Label>Category of your event</Form.Label>
                    <Form.Select name="category">
                        <option value="Outdoor">Outdoor</option>
                        <option value="Indoor">Indoor</option>
                        <option value="Offline">Offline</option>
                        <option value="Online">Online</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload a photo for your event?</Form.Label>
                    <Form.Control type="file" />
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

export {CreateEvent};