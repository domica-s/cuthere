import React from "react";
import { Button, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./LandingStyles.css";

function LandingPage() {

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
                  variant="outline-primary"
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