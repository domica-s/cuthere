import React, { useEffect, useState } from "react";
import { baseBackURL } from "../params/params";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Logo, Form, Button, FloatingLabel } from "react-bootstrap";
import logo from '../logo.jfif';
import AuthService from "../services/auth.service";


function PasswordReset() {

    const [userRequest, setUserRequest] = useState({
        successful: false,
        message: "",
    });

    const [newPassword, setNewPassword] = useState("");

    const handleResetPassword = (sid, token, newPassword) => {
        // send POST request to http://localhost:8080/api/auth/passwordreset/:sid/:token
        // with newPassword in body
        // alert("submitting " + sid + token + newPassword);
        console.log(sid);
        console.log(token);
        console.log(newPassword);
        AuthService.resetPassword(sid, token, newPassword)
        .then(response => {
            response.json().then(data => {
                if(response.status === 200) {
                    setUserRequest({ successful: true, message: data.message });
                }
                else {
                    setUserRequest({ successful: false, message: data.message });
                }
            })
        });

    }

    // useEffect(() => {
    //     let FULL_URL = baseBackURL +  "/api/auth/paswordreset/" + sid + "/" + token;
    //     fetch(FULL_URL)
    //     .then(response => {
    //         response.json().then(data => {
    //             if(response.status === 200) {
    //                 setUserRequest({ successful: true, message: data.message });
    //             }
    //             else {
    //                 setUserRequest({ successful: false, message: data.message });
    //             }
    //         })
    //     })
    // }, []);

    const { sid, token } = useParams();
    const { successful, message } = userRequest;

    return (
        <>
            <Container>
                <Row xs="auto" className="justify-content-sm-center">
                <Col>
                    <img className="mt-4" src={logo} alt="" width="100px"/>
                </Col>
                </Row>
                <Row className="justify-content-center">
                <Form className="signin-form" onSubmit={handleResetPassword(sid, token, newPassword)}>
                    <h1 className="h3 mb-3 ">Reset your password</h1>

                    <Col className="form-floating">
                        <FloatingLabel controlId="floatingPassword" label="Password">
                            <Form.Control name="password" type="password" placeholder="Password" required
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}/>
                        </FloatingLabel>
                    </Col>             

                    <Col className="mb-3 form-floating">
                        <FloatingLabel controlId="floatingRepassword" label="RePassword">
                            <Form.Control name="repassword" type="password" placeholder="Re-enter Password" required/>
                        </FloatingLabel>
                    </Col>  
                
                    <Button className="mb-3 m-2" variant="outline-warning" type="submit">
                        Reset
                    </Button>
                    {message && (
                    <div className="form-group">
                        <div
                            className={successful
                                ? "alert alert-success"
                                : "alert alert-danger"
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