import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../logo.jfif';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';



// class Login extends React.Component {   
function Login() {
    let navigate = useNavigate(); 

    const signUpChange = () =>{ 
      let path = '/signup'; 
      navigate(path);
    }

    const forgotPwChange = () => {
        let path = '/forgotpw';
        navigate(path)
    } 

    // render() {
        return(
            <Container>
                <Row xs="auto" className="justify-content-sm-center">
                    <Col>
                        <img className="mt-4" src={logo} alt="" width="100px"/>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Form className="signin-form" action="../../login" method="POST">
                        <h1 class="h3 mb-3 ">Sign in</h1>

                        <Col className="form-floating">
                            <FloatingLabel controlId="floatingInput" label="SID">
                                <Form.Control name="sid" type="number" placeholder="SID" required/>
                            </FloatingLabel>                                
                        </Col>

                        <Col className="mb-3 form-floating">
                            <FloatingLabel controlId="floatingPassword" label="Password">
                                <Form.Control name="password" type="password" placeholder="Password" required/>
                            </FloatingLabel>
                        </Col>           

                        <Button className="mb-3 m-2" variant="outline-warning" type="submit">
                            Sign In
                        </Button>

                        <Button className="mb-3 m-2" variant="outline-warning" onClick={signUpChange}>
                            Sign Up
                        </Button>

                        <Button className="mb-3 m-2" variant="outline-warning" onClick={forgotPwChange}>
                            Forgot Password?
                        </Button>                        
                        
                    </Form>
                </Row>
            </Container>
        )
    // }
}

export {Login}