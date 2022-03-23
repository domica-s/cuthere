import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../logo.jfif';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel'

import AuthService from "../services/auth.service";

function SignUpWithNavigate() {
  let navigate = useNavigate();
  return <SignUp navigate={navigate} />
}

class SignUp extends React.Component {
  
  constructor(props) {
      super(props);
      this.handleRegister = this.handleRegister.bind(this);
      this.handleSignIn = this.handleSignIn.bind(this);
      this.onChangeUsername = this.onChangeUsername.bind(this);
      this.onChangeSID = this.onChangeSID.bind(this);
      this.onChangePassword = this.onChangePassword.bind(this);

      this.state = {
        username: "",
        sid: "",
        password: "",
        successful: false,
        message: ""
      };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
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

  handleSignIn(e) {
    e.preventDefault();
    this.setState({
      message: "",
      successful: false
    });

    this.props.navigate('/login');
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    AuthService.register(
      this.state.username,
      this.state.sid,
      this.state.password
    ).then(
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
          successful: false,
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
          <Form className="signin-form" onSubmit={this.handleRegister}
                                        ref={c => {
                                        this.form = c;
                                        }}
                                        >
            <h1 className="h3 mb-3 ">Sign Up</h1>

            <Col className="form-floating">
                <FloatingLabel controlId="floatingUsername" label="Username">
                    <Form.Control name="username" type="text" placeholder="Username" required
                    value={this.state.username}
                    onChange={this.onChangeUsername}/>
                </FloatingLabel>                                
            </Col>

            <Col className="form-floating">
                <FloatingLabel controlId="floatingInput" label="SID">
                    <Form.Control name="sid" type="number" placeholder="SID" required
                    value={this.state.sid}
                    onChange={this.onChangeSID}/>
                </FloatingLabel>                                
            </Col>

            <Col className="form-floating">
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control name="password" type="password" placeholder="Password" required
                    value={this.state.password}
                    onChange={this.onChangePassword}/>
                </FloatingLabel>
            </Col>             

            <Col className="mb-3 form-floating">
                <FloatingLabel controlId="floatingRepassword" label="RePassword">
                    <Form.Control name="repassword" type="password" placeholder="Re-enter Password" required/>
                </FloatingLabel>
            </Col>  
            <Button className="mb-3 m-2" variant="outline-warning" onClick={this.handleSignIn}>
                Already have an account? Sign in instead.
            </Button>    
            <Button className="mb-3 m-2" variant="outline-warning" type="submit">
                Sign Up
            </Button>
            {this.state.message && (
                <div className="form-group">
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
          </Form>
        </Row>
      </Container>
    );
  }
}

export {SignUpWithNavigate}