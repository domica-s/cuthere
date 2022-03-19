import React from "react";
import logo from '../logo.jfif';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel'


class SignUp extends React.Component {
    render() {
        return(
            <Container>
                <Row xs="auto" className="justify-content-sm-center">
                    <Col>
                        <img className="mt-4" src={logo} alt="" width="100px"/>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Form className="signin-form" action="../../signup" method="POST">
                        <h1 class="h3 mb-3 ">Sign in</h1>

                        <Col className="form-floating">
                            <FloatingLabel controlId="floatingUsername" label="Username">
                                <Form.Control name="username" type="text" placeholder="Username" required/>
                            </FloatingLabel>                                
                        </Col>

                        <Col className="form-floating">
                            <FloatingLabel controlId="floatingInput" label="SID">
                                <Form.Control name="sid" type="number" placeholder="SID" required/>
                            </FloatingLabel>                                
                        </Col>

                        <Col className="form-floating">
                            <FloatingLabel controlId="floatingPassword" label="Password">
                                <Form.Control name="password" type="password" placeholder="Password" required/>
                            </FloatingLabel>
                        </Col>             

                        <Col className="mb-3 form-floating">
                            <FloatingLabel controlId="floatingRepassword" label="RePassword">
                                <Form.Control name="repassword" type="password" placeholder="Re-enter Password" required/>
                            </FloatingLabel>
                        </Col>  

                        <Button variant="outline-warning" type="submit">
                            Sign Up
                        </Button>
                        
                    </Form>
                </Row>
            </Container>
        )
    }
}

export {SignUp}