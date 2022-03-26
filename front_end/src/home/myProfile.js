import React, { useState, Component } from "react";
import AuthService from "../services/auth.service";
import TestPicture from "./images/logo.svg"
import {Form, Button, Row, Col, Container, Card, CardGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import "./myProfile.css"
import authService from "../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: AuthService.getCurrentUser(),
    };
  }

  render() {
    const { currentUser } = this.state;
    console.log({currentUser});

    const submitHandler = (e) => {
      e.preventDefault();
    }
    
    const USER_STATE = {
      username: currentUser.user.username,
      email: currentUser.user.email,
      about: currentUser.user.about,
      mobileNumber: currentUser.user.mobileNumber,
      interests: currentUser.user.interests,
      college: currentUser.user.college,
    }
    
    return (
      <Container className="myContainer">
        <Row>
        <Col className="imgCol"   
          ><img src={TestPicture} 
          style={{
                border: '3px solid rgba(0, 0, 0, 0.15)',
            }}/></Col>
        <Col className="rightCol" lg= {12} xl={9} >
        <div className="userInfo">
        {console.log(USER_STATE)}
          <h1><strong>{USER_STATE.username}</strong></h1>
          <p>{USER_STATE.email}</p>
          <p>{USER_STATE.about}</p>
          <p>{USER_STATE.mobileNumber}</p>
          <p>{USER_STATE.interests}</p>
          <p>{USER_STATE.college}</p>
        </div>
        </Col>
        <Row>
          <Col className="buttonCol">
          <p><Button variant="primary">Connect</Button></p>
          <p><Button variant="primary">Rating</Button></p>
          </Col>
          <Col className="rightCol" lg= {12} xl={9}> 
          <CardGroup>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={TestPicture} />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Friend 1.
                </Card.Text>
                <Button variant="primary">Connect</Button>
              </Card.Body>
            </Card>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={TestPicture} />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Friend 2.
                </Card.Text>
                <Button variant="primary">Connect</Button>
              </Card.Body>
            </Card>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={TestPicture} />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Friend 3.
                </Card.Text>
                <Button variant="primary">Connect</Button>
              </Card.Body>
            </Card>
          </CardGroup>
          </Col>
          </Row>
          <Row>
          
          <div className="buttonContainer">
              <Link to="/editProfile">
                <Button size="lg" className="landingbutton" variant="outline-dark">
                  Edit Profile
                </Button>
              </Link>
              </div>
          </Row>

        </Row>
      </Container>
    );
  }
}