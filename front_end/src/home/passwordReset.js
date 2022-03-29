import React, { useEffect, useState } from "react";
import { baseBackURL } from "../params/params";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Logo, Form, Button, FloatingLabel } from "react-bootstrap";
import logo from '../images/logo.jfif';
import AuthService from "../services/auth.service";

function PasswordReset() {
    const [userRequest, setUserRequest] = useState({
        successful: false,
        message: "",
    });

    const [newPassword, setNewPassword] = useState("");
    const [newRePassword, setNewRePassword] = useState("");

    const handleResetPassword = (e, sid, token) => {
        // send POST request to http://localhost:8080/api/auth/passwordreset/:sid/:token
        // with newPassword in body
        // const { sid, token } = useParams();
        // const { successful, message, newPassword } = userRequest;
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
            <Row xs="auto" className="justify-content-sm-center">
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