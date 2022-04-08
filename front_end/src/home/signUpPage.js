import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../images/logo.jfif';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import AuthService from "../services/auth.service";
import Select from "react-select";
import {interestOptions} from './data';

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
      this.onChangeCollege = this.onChangeCollege.bind(this);
      this.onChangePassword = this.onChangePassword.bind(this);
      this.onChangeRepassword = this.onChangeRepassword.bind(this);
      this.onChangeInterests = this.onChangeInterests.bind(this);
      this.state = {
        username: "",
        sid: "",
        password: "",
        repassword: "",
        college: "",
        successful: false,
        message: "",
        interests: [],
      };
  }

  onChangeInterests(e) {
    const value = e.map(x => x.value);
    console.log(value);
    this.setState({
      interests : value,
    })
    console.log(this.state.interests)
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

  onChangeCollege(e) {
    this.setState({
      college: e.target.value
    });
  }

  onChangeRepassword(e) {
    this.setState({
      repassword: e.target.value
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
    console.log(this.state.interests);
    this.setState({
      message: "",
      successful: false
    });

    AuthService.register(
      this.state.username,
      this.state.sid,
      this.state.password,
      this.state.repassword,
      this.state.college,
      this.state.interests,
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
        <Row className="justify-content-sm-center">
          <Col>
            <img className="mt-4" src={logo} alt="" width="100px"/>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Form className="signin-form" 
            onSubmit={this.handleRegister}
            ref={c => {this.form = c;}}
          >
            <h1 className="h3 mb-3">Sign Up</h1>
            <div className="tab-content">
              <div className="tab-pane fade active show" id="account-change-password">
          
            
                <div className="card-body">
                    <div className="form-group">
                      <FloatingLabel className="form-label" controlId="floatingInput" label="Username">
                      <Form.Control
                      type="text"
                      name="username"
                      value={this.state.username}
                      placeholder="Username"
                      onChange={this.onChangeUsername} 
                      required
                      />
                      </FloatingLabel>
                    </div>
                    <div className="form-group">
                      <FloatingLabel className="form-label" controlId="floatingInput" label="SID">
                      <Form.Control
                      type="number"
                      name="SID"
                      value={this.state.SID}
                      placeholder="SID"
                      onChange={this.onChangeSID} 
                      required
                      />
                      </FloatingLabel>
                    </div>
                    <div className="form-group">
                      <FloatingLabel className="form-label" controlId="floatingInput" label="College">
                      <Form.Control
                      as="select"
                      className="select-style"
                      name="college"
                      value={this.state.college}
                      placeholder="College"
                      onChange={this.onChangeCollege} 
                      required
                      >
                        <option value="-">-</option>
                        <option value="Lee Woo Sing">Lee Woo Sing</option>
                        <option value="Morningside">Morningside</option>
                        <option value="Wu Yee Sun">Wu Yee Sun</option>
                        <option value="Chung Chi">Chung Chi</option>
                        <option value="New Asia">New Asia</option>
                        <option value="Shaw">Shaw</option>
                        <option value="SH Ho">SH Ho</option>
                        <option value="CW Chu">CW Chu</option>
                        <option value="United College">United College</option>
                        </Form.Control>
                      </FloatingLabel>
                    </div>
                    <div className="form-group">
                      <FloatingLabel className="form-label" controlId="floatingInput" label="Password">
                      <Form.Control
                      type="password"
                      name="password"
                      value={this.state.password}
                      placeholder="Password"
                      onChange={this.onChangePassword} 
                      required
                      />
                      </FloatingLabel>
                    </div>
                    <div className="form-group">
                      <FloatingLabel className="form-label" controlId="floatingInput" label="RePassword">
                      <Form.Control
                      type="password"
                      name="repassword"
                      value={this.state.repassword}
                      placeholder="Re-enter password.."
                      onChange={this.onChangeRepassword} 
                      required
                      />
                      </FloatingLabel>
                    </div>
                    <div className="form-group mb-3">
                    <br />
                    <hr class="border-light m-0" />
                    <br />
                    <div className="text-light small mt-1">Consider adding an interest before signing in!</div>
                
                    <Select
                      options={interestOptions}
                      isMulti
                      closeMenuOnSelect={false}
                      name="interests"
                      allowSelectAll={true} 
                      onChange={this.onChangeInterests}
                      placeholder="Interests.."
                      
                      />
                      
                  </div>
                  </div>
                </div>
              </div>
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