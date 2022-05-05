// The program for the frontend of password reset of user
// PROGRAMMER: Pierson and Domica
// The program is called when the user clicks on reset password
// Revised on 5/5/2022

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Logo, Form, Button, FloatingLabel } from "react-bootstrap";
import logo from '../images/logo.jfif';
import AuthService from "../services/auth.service";

function PasswordReset() {
                                    /*
        This is a functional component related to the rendering and functionalities of resetting the password
    */
    const [userRequest, setUserRequest] = useState({
        successful: false,
        message: "",
    });

    const [newPassword, setNewPassword] = useState("");
    const [newRePassword, setNewRePassword] = useState("");

    const handleResetPassword = (e, sid, token) => {
            /*
      This function is called to handle the reset password and sending the functionalities to be handled in the back-end
      Requirement(params): sid of the user who wants the password changed is passed as sid, token for auth is passed as token in the params 
      Requirement (body): The new password of the user is to be passed in the body
      This function is called directly when the user presses the reset password button
    */
        e.preventDefault()
        let newPW = {newPassword};
        let newRePW = {newRePassword}
        AuthService.resetPassword(sid, token, newPW, newRePW)
        .then(response => {
            setUserRequest({ successful: true, message: response.data.message });
        },
        error => {
            setUserRequest({ successful: false, message: error.response.data.message });
        })
    }

    const { successful, message } = userRequest;
    const { sid, token } = useParams();

    return (
        <>
        <Container>
            <Row className="justify-content-sm-center">
            <Col>
                <img className="mt-4" src={logo} alt="" width="100px"/>
            </Col>
            </Row>
            <Row className="justify-content-center">
            <Form className="signin-form" onSubmit={(e) => handleResetPassword(e, sid, token)}>
                <h1 className="h3 mb-3 ">Reset your password</h1>

                <Col className="form-floating">
                    <FloatingLabel controlId="floatingPassword" label="Password">
                        <Form.Control name="password" type="password" placeholder="Password" required
                        value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
                    </FloatingLabel>
                </Col>             

                <Col className="mb-3 form-floating">
                    <FloatingLabel controlId="floatingRepassword" label="RePassword">
                        <Form.Control name="repassword" type="password" placeholder="Re-enter Password" required
                        value={newRePassword} onChange={e => setNewRePassword(e.target.value)}/>
                    </FloatingLabel>
                </Col>  
            
                <Button className="mb-3 m-2" variant="outline-warning" type="submit">
                    Reset
                </Button>
                {message && (
                    <div className="form-group">
                        <div
                        className={
                            successful? "alert alert-success": "alert alert-danger"
                        }
                        role="alert"
                        >
                        {message}
                        </div>
                    </div>
                )}
            </Form>
            </Row>
        </Container>
        </>
    );
}

export {PasswordReset}