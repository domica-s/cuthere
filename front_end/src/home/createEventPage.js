import React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";
import logo from '../logo.jfif';

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

            <Form className="signin-form" action="../../event" method="POST">

                <Form.Group className="mb-3" controlId="floatingInput">
                    <Form.Label>Title of your event</Form.Label>
                    <Form.Control name="title" type="text" placeholder="title" required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="floatingInput">
                    <Form.Label>Location</Form.Label>
                    <Form.Control name="location" type="text" placeholder="location" required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="floatingDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control name="date" type="date" placeholder="" required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="floatingInput">
                    <Form.Label>Quota</Form.Label>
                    <Form.Control name="quota" type="number" placeholder="quota" required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="floatingInput">
                    <Form.Label>Category of your event</Form.Label>
                    <Form.Control name="category" type="text" placeholder="category" required/>
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload a photo for your event?</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>

                <Button className="mb-3 m-2" variant="outline-warning" type="submit">
                    Create Event! 
                </Button>

            </Form>

        </Container>
    )


}

export {CreateEvent}