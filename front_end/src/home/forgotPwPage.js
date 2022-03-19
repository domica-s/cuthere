import React from "react";
import { Container } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
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

function Desciption() {
    return (
        <Container>
            <h2>Password Recovery</h2>
            <p>
                Forgot your password? No worries, please input your Student ID or Staff ID below. 
                <br/>
                A new password will be sent to your CUHK email.
            </p>
        </Container>
    )
}

function ForgotPw() {

    return(
        <Container>
            <Logo/>
            <Desciption/>
            <Row>
                <Form className="signin-form" action="" method="POST">
                    <Col className="form-floating">
                            <FloatingLabel controlId="floatingInput" label="SID">
                                <Form.Control name="sid" type="number" placeholder="SID" required/>
                            </FloatingLabel>                               
                    </Col>
                    <Button className="mb-3 m-2" variant="outline-success" type="submit">
                            Confirm
                    </Button>
                </Form>

            </Row>
        </Container>
    )
}

export {ForgotPw};