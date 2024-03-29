// The program for the frontend of the landing page of CUthere
// PROGRAMMER: Bryan Wilson Kheng
// The program is called when the user routes to /
// Revised on 5/5/2022


import React from "react";
import { Button, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./LandingStyles.css";

function LandingPage() {
                              /*
        This is a functional component which renders the landing page when the user opens the web app
    */
  return (
    <div className="main">
      <Container>
        <Row>
          <div className="intro-text">
            <div>
              <h1 className="title">Welcome to CUthere</h1>
              <p className="subtitle">CUHK's #1 activity hub.</p>
            </div>
            <div className="buttonContainer">
              <Link to="/Login">
                <Button size="lg" className="landingbutton" variant="success">
                  Login
                </Button>
              </Link>
              <Link to="/SignUp">
                <Button
                  variant="primary"
                  size="lg"
                  className="landingbutton"
                >
                  Signup
                </Button>
              </Link>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;