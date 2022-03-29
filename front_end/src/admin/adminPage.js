// Dashboard
// show total number of events and registered users
// show recent events and registered users
// form (field) prompting user id --> redirect to their profile
// form (field) prompting event id --> redirect to event detail page 

import React, { useEffect, useState } from "react";
import { baseBackURL } from "../params/params";
import {Form, Col, Row, Button, Container, Table} from "react-bootstrap";
import AdminService from '../services/admin.service';
import AuthService from '../services/auth.service';

export function AdminDashboard() {

    const [adminRequest, setAdminRequest] = useState({
        querySID: 0,
        queryEventId: 0,
    });

    const [sidData, setSidData] = useState({
        successfulSID: false,
        messageSID: "",
        user: "",
    })

    const [eventIdData, setEventIdData] = useState({
        successfulEventId: false,
        messageEventId: "",
        event: "",
    })

    useEffect(() => {

    }, []);

    const handleInput = (e) => {
        setAdminRequest({ ...adminRequest, [e.target.name]: e.target.value });
    };

    const handleSubmitSID = (e) => {
        e.preventDefault();
        
        const currentUser = AuthService.getCurrentUser();
        let sid = adminRequest.querySID;

        AdminService.querySID(currentUser, sid)
        .then(response => {
            setSidData({ successfulSID: true, messageSID: response.data.message, user: response.data.user });
        },
        error => {
            setSidData({ successfulSID: false, messageSID: error.response.data.message, user: error.response.data.user });
        })
    }

    const handleSubmitEventID = (e) => {
    
        e.preventDefault();
        
        const currentUser = AuthService.getCurrentUser();
        let eid = adminRequest.queryEventId;

        AdminService.queryEventId(currentUser, eid)
        .then(response => {
            setEventIdData({ successfulEventId: true, messageEventId: response.data.message, event: response.data.event });
        },
        error => {
            setEventIdData({ successfulEventId: false, messageEventId: error.response.data.message, event: error.response.data.event });
        })
    }

    const { successfulSID, messageSID, user } = sidData;
    const { successfulEventId, messageEventId, event} = eventIdData;

    return (
        <>
        <Container>
            <Row>
                <Col>
                    <h1>Recently created events</h1>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>SID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col>
                    <h1>Recently registered users</h1>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Event Title</th>
                            <th>Event ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
        <div>
            <Container>
                <Form onSubmit={handleSubmitSID}>
                    <div className="form-group">
                        <label className="form-label">Enter SID to query:</label>
                        <Form.Control 
                            name="querySID"
                            type="number" 
                            value={adminRequest.querySID || ""}
                            placeholder={"Type in an SID"}
                            onChange={handleInput} 
                        />
                    </div>
                    <Button type="submit" variant="outline-dark" value="Query SID">Query SID</Button>
                </Form>
                {messageSID && (
                <div className="form-group">
                    <div
                    className={
                        successfulSID? "alert alert-success": "alert alert-danger"
                    }
                    role="alert"
                    >
                    {messageSID}
                    </div>
                </div>
                )}
                {user && (
                    <div>
                        <p>Username: <a href="">{user.username}</a></p>
                        <p>SID: <strong>{user.sid}</strong></p>
                        <p>Email: <strong>{user.email}</strong></p>
                        <p>Mobile Number: <strong>{user.mobileNumber}</strong></p>
                        <p>Interests: <strong>{user.interests}</strong></p>
                        <p>College: <strong>{user.college}</strong></p>
                        <p>About: <strong>{user.about}</strong></p>
                        <p>Registered Events: <strong>{user.registeredEvents}</strong></p>
                        <p>Starred Events: <strong>{user.starredEvents}</strong></p>
                        <p>Created at: <strong>{user.createdAt}</strong></p>
                    </div>
                )}
            </Container>

            <Container>
                <Form onSubmit={handleSubmitEventID}>
                    <div className="form-group">
                        <label className="form-label">Enter Event ID to query:</label>
                        <Form.Control 
                            name="queryEventId"
                            type="number" 
                            value={adminRequest.queryEventId || ""}
                            placeholder={"Type in an Event ID"}
                            onChange={handleInput} 
                        />
                    </div>
                    <Button type="submit" variant="outline-dark" value="Query Event ID">Query Event ID</Button>
                </Form>
                {messageEventId && (
                    <div className="form-group">
                        <div
                        className={
                            successfulEventId? "alert alert-success": "alert alert-danger"
                        }
                        role="alert"
                        >
                        {messageEventId}
                        </div>
                    </div>
                )}
                {event && (
                    <div>
                        <p>Title: <a href="/event/">{event.title}</a></p>
                        <p>Event ID: <strong>{event.eventID}</strong></p>
                        <p>Status: <strong>{event.status}</strong></p>
                        <p>Venue: <strong>{event.venue}</strong></p>
                        <p>Start: <strong>{event.start}</strong></p>
                        <p>End: <strong>{event.end}</strong></p>
                        <p>Activity Category: <strong>{event.activityCategory}</strong></p>
                        <p>Chat History: <strong>{event.chatHistory}</strong></p>
                        <p>Number of Participants: <strong>{event.numberOfParticipants}</strong></p>
                        <p>Participants: <strong>{event.participants}</strong></p>
                        <p>Created At: <strong>{event.createdAt}</strong></p>
                        <p>Created By: <strong>{event.createdBy}</strong></p>
                        
                    </div>
                )}
            </Container>
        </div>
        </>
    );

}