// The program for the frontend of forget password page
// PROGRAMMER: Ethan Lee
// The program is called when the user clicks on forget password
// Revised on 5/5/2022

import React from "react";
import { Container } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import logo from '../images/logo.jfif';
import AuthService from "../services/auth.service";


function Logo() {
    return(
        <Row className="justify-content-sm-center">
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
                A password reset link will be sent to your email.
            </p>
        </Container>
    )
}

class ForgotPw extends React.Component {
    constructor(props) {
        super(props);
        this.handleForgetPw = this.handleForgetPw.bind(this);
        this.onChangeSID = this.onChangeSID.bind(this);

        this.state = {
          sid: "",
          message: "",
        };
    }

    onChangeSID(e) {
        this.setState({
          sid: e.target.value
        });
    }

    handleForgetPw(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true,
            successful: false,
        });

        AuthService.forgotPassword(this.state.sid).then(
            response => {
                this.setState({
                    message: response.data.message,
                    successful: true
                });
            },
            error => {
                const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
                this.setState({
                    loading: false,
                    message: resMessage,
                    successful: false
                });
            }
        );
    }

    render() {

        return (
            <Container>
                <Logo/>
                <Desciption/>
                <Row>
                    <Form className="signin-form" onSubmit={this.handleForgetPw} ref={c => {this.form = c;}}>
                        <Col className="form-floating">
                            <FloatingLabel controlId="floatingInput" label="SID">
                                <Form.Control name="sid" type="number" placeholder="SID" required
                                value={this.state.sid} onChange={this.onChangeSID} />
                            </FloatingLabel>                               
                        </Col>
                        {this.state.message && (
                            <div className="form-group mt-3">
                                <div
                                className={
                                    this.state.successful
                                    ? "alert alert-success"
                                    : "alert alert-danger"
                                }
                                role="alert"
                                >
                                {this.state.message}
                                </div>
                            </div>
                        )}
                        <Button className="mb-3 m-2" variant="outline-success" type="submit">
                            Confirm
                        </Button>
                    </Form>

                </Row>
            </Container>
        )
    }
}

export {ForgotPw};