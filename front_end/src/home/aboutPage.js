// The program for the frontend of the about page of CUthere
// PROGRAMMER: Ethan Lee
// The program is called when the user clicks on the About page
// Revised on 5/5/2022

import React from "react";
import {Button, Container} from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import './aboutPage.css';


function AboutUs() {
    return (
        <Container>
            <h2>About CUthere</h2>
            <Row className="align-items-center">
            <Col className="col">
                <img  src="/CUthere.png" alt="" style={{width: "50%"}}/>
            </Col>
            <Col className="col">
                <p style={{ fontStyle: 'italic', fontSize: 20, fontFamily: 'sans-serif-thin' }}> 
                <span style={{fontWeight: "bold"}} >CUthere</span> is a platform that facilitates people of The Chinese University of Hong Kong to connect with each other for events such as, but not limited to sports, parties and societies.
                </p>
            </Col>
            </Row>
            <h2>Our Founders</h2>
            <hr/>
            
            <Row className="align-items-center">
                <Col className="col-4">
                    <img id="founder-pic" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" className="d-block ui-w-80"/>
                </Col>
                <Col className="col-8">
                    <p style={{ fontWeight: "bold", fontSize: 22, fontFamily: 'sans-serif-thin' }}>Bryan Wilson Kheng</p>
                    <p style={{ fontStyle: 'italic', fontSize: 20, fontFamily: 'sans-serif-thin' }}> 
                        "We want to improve the cohesion of CUHK, which is very important for students"
                    </p>
                </Col>                   
            </Row>

            <Row className="align-items-center my-5">
                <Col className="col-4">
                    <img id="founder-pic" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" className="d-block ui-w-80"/>
                </Col>
                <Col className="col-8">
                    <p style={{ fontWeight: "bold", fontSize: 22, fontFamily: 'sans-serif-thin' }}>Domica Santoso</p>
                    <p style={{ fontStyle: 'italic', fontSize: 20, fontFamily: 'sans-serif-thin' }}> 
                        "This project is so cool!"
                    </p>
                </Col>                   
            </Row>

            <Row className="align-items-center my-5">
                <Col className="col-4">
                    <img id="founder-pic" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" className="d-block ui-w-80"/>
                </Col>
                <Col className="col-8">
                    <p style={{ fontWeight: "bold", fontSize: 22, fontFamily: 'sans-serif-thin' }}>Philip Tarrantino Limas</p>
                    <p style={{ fontStyle: 'italic', fontSize: 20, fontFamily: 'sans-serif-thin' }}> 
                        "My birthday is on 9th of June, please join my party using CUthere"
                    </p>
                </Col>                   
            </Row>

            <Row className="align-items-center my-5">
                <Col className="col-4">
                    <img id="founder-pic" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" className="d-block ui-w-80"/>
                </Col>
                <Col className="col-8">
                    <p style={{ fontWeight: "bold", fontSize: 22, fontFamily: 'sans-serif-thin' }}>Pierson Tarrantino Limas </p>
                    <p style={{ fontStyle: 'italic', fontSize: 20, fontFamily: 'sans-serif-thin' }}> 
                        "Hello Guys"
                    </p>
                </Col>                   
            </Row>

            <Row className="align-items-center my-5">
                <Col className="col-4">
                    <img id="founder-pic" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" className="d-block ui-w-80"/>
                </Col>
                <Col className="col-8">
                    <p style={{ fontWeight: "bold", fontSize: 22, fontFamily: 'sans-serif-thin' }}>Lee Sheung Chit Ethan</p>
                    <p style={{ fontStyle: 'italic', fontSize: 20, fontFamily: 'sans-serif-thin' }}> 
                        "Nicee"
                    </p>
                </Col>                   
            </Row>

            
        </Container>
    )
}

export default AboutUs;