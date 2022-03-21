import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../logo.jfif';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';

// import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeSID = this.onChangeSID.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.state = {
          sid: "",
          password: "",
          loading: false,
          message: "",
        };
    }

    onChangeSID(e) {
        this.setState({
          sid: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    handleLogin(e) {
        // console.log("Handle login called");
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });
        
        AuthService.login(this.state.sid, this.state.password).then(
            () => {
                // this.props.history.push("/profile");
                window.location.reload();
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
                message: resMessage
                });
            }
        );
    }

    render() {
        return (
            <Container>
                <Row xs="auto" className="justify-content-sm-center">
                    <Col>
                        <img className="mt-4" src={logo} alt="" width="100px"/>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Form className="signin-form" onSubmit={this.handleLogin}
                                                    ref={c => {
                                                        this.form = c;
                                                    }}>
                        <h1 class="h3 mb-3 ">Sign in</h1>

                        <Col className="form-floating">
                            <FloatingLabel controlId="floatingInput" label="SID">
                                <Form.Control name="sid" type="number" placeholder="SID" required 
                                value={this.state.sid} onChange={this.onChangeSID}/>
                            </FloatingLabel>                                
                        </Col>

                        <Col className="mb-3 form-floating">
                            <FloatingLabel controlId="floatingPassword" label="Password">
                                <Form.Control name="password" type="password" placeholder="Password" required
                                value={this.state.password} onChange={this.onChangePassword}/>
                            </FloatingLabel>
                        </Col>           

                        {/* <Button className="mb-3 m-2" variant="outline-warning" type="submit" disabled={this.state.loading}>
                            Sign In
                        </Button> */}
                    <div className="form-group">
                <button
                    className="btn btn-primary btn-block"
                    disabled={this.state.loading}
                >
                    {this.state.loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Login</span>
                </button>
                </div>
                {this.state.message && (
                <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                    {this.state.message}
                    </div>
                </div>
                )}

                        <Button className="mb-3 m-2" variant="outline-warning">
                            Sign Up
                        </Button>

                        <Button className="mb-3 m-2" variant="outline-warning">
                            Forgot Password?
                        </Button>                        
                        {/* <CheckButton
                            style={{ display: "none" }}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        /> */}
                    </Form>
                </Row>
            </Container>
        );
    }
}

export {Login}