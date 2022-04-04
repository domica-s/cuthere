import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../images/logo.jfif';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import AuthService from "../services/auth.service";

function LoginWithNavigate() {
    let navigate = useNavigate();
    return <Login navigate={navigate} />
}

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleForgetPw = this.handleForgetPw.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.onChangeSID = this.onChangeSID.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.handleReVerification = this.handleReVerification.bind(this);

        this.state = {
          sid: "",
          password: "",
          loading: false,
          message: "",
          resendMessage: "",
          isVerified: true,
          verificationSent: false,
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

        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });
        
        AuthService.login(this.state.sid, this.state.password).then(
            () => {
                this.props.navigate('/');
                // GoToProfile();
                window.location.reload();
            },
            error => {
                if (error.response.data.isVerified === false) {
                    const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                    this.setState({
                        loading: false,
                        message: resMessage,
                        isVerified: false
                    });
                }
                else {
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
            }
        );
    }

    handleForgetPw(e) {
        e.preventDefault();
        this.setState({
            message: "",
            loading: true
        })

        this.props.navigate('/forgotpw');
    }


    handleSignUp(e) {
        // e.preventDefault();
        this.setState({
            message: "",
            loading: true
        })

        this.props.navigate('/signup');
    }

    handleReVerification(e) {
        e.preventDefault();
        AuthService.resendVerification(this.state.sid).then(
            response => {
                this.setState({
                    resendMessage: response.data.message,
                    verificationSent: true
                });
            },
            error => {
                const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) || error.message || error.toString();
                this.setState({
                    loading: false,
                    resendMessage: resMessage
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
                    <Form className="signin-form" onSubmit={this.handleLogin} ref={c => {this.form = c;}}>
                        <h1 className="h3 mb-3 ">Sign in</h1>
                        <div className="tab-content">
                        <div className="tab-pane fade active show" id="account-change-password">

                       <div className="card-body">
                        <div className="form-group">
                            <FloatingLabel controlId="floatingInput" label="SID" className="form-label">
                                <Form.Control name="sid" type="number" placeholder="SID" required 
                                value={this.state.sid} onChange={this.onChangeSID}/>
                            </FloatingLabel>                                
                        </div>

                        <div className="mb-3 form-group">
                            <FloatingLabel controlId="floatingPassword" label="Password" className="form-label">
                                <Form.Control name="password" type="password" placeholder="Password" required
                                value={this.state.password} onChange={this.onChangePassword}/>
                            </FloatingLabel>
                        </div>           
                        <div className="form-group mt-3">
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
                            <div className="form-group mt-3">
                                <div className="alert alert-danger" role="alert">
                                {this.state.message}
                                </div>
                            </div>
                        )}
                        {!this.state.isVerified && (
                            <Button className="mb-3 m-2" variant="outline-success" onClick={this.handleReVerification}>
                                Resend Verification Link
                            </Button>
                        )}
                        {this.state.resendMessage && (
                            <div className="form-group mt-3">
                                <div className={
                                    this.state.verificationSent
                                    ? "alert alert-success"
                                    : "alert alert-danger"}
                                role="alert">
                                {this.state.resendMessage}
                                </div>
                            </div>
                        )}

                        <Button className="mb-3 m-2" variant="outline-warning" onClick={this.handleSignUp}>
                            Sign Up
                        </Button>

                        <Button className="mb-3 m-2" variant="outline-warning" onClick={this.handleForgetPw}>
                            Forgot Password?
                        </Button> 
                        </div>
                        </div>
                        </div>                       
                    </Form>
                </Row>
            </Container>
        );
    }
}

export {LoginWithNavigate}