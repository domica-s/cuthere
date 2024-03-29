// The program for the frontend of the admin dashboard
// PROGRAMMER: Domica Santoso
// Dashboard
// show total number of events and registered users
// show recent events and registered users
// form (field) prompting user id --> redirect to their profile
// form (field) prompting event id --> redirect to event detail page 
// Revised on 5/5/2022

import React, { useEffect, useState, useRef } from "react";
import {Form, Col, Row, Button, Container, Table} from "react-bootstrap";
import AdminService from '../services/admin.service';
import AuthService from '../services/auth.service';

export function AdminDashboard() {
                    /*
      This function is a functional component related to the rendering and functionality / implementation of the Admin Dashboard
      This codes will be rendered immediately when the admin opens the admin dashboard
    */

    const myChatHistory = useRef(null);
    const myPinnedComment = useRef(null);
    const myCommenters = useRef(null);

    const [adminRequest, setAdminRequest] = useState({
        querySID: 0,
        queryEventId: 0,
        adminPasswordEvent: "",
        adminPasswordUser: "",
        newUserPassword: "",
        deleteRating: "",
        deleteComment: "",
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

    const [recentData, setRecentData] = useState({
        recentUsers: "",
        recentUsersArray: "",
        recentEvents: "",
        recentEventsArray: "",
        totalUsers: "",
        totalEvents: "",
        successful: false,
        message: "",
    })

    const [deleteEvent, setDeleteEvent] = useState({
        eid: eventIdData.event? eventIdData.event.eventID: "",
        successfulDeleteEvent: false,
        messageDeleteEvent: "",
    })

    const [deleteUser, setDeleteUser] = useState({
        sid: sidData.user? sidData.user.sid: "",
        successfulDeleteUser: false,
        messageDeleteUser: "",
    })
    
    const [deleteRating, setDeleteRating] = useState({
        sid: sidData.user? sidData.user.sid: "",
        successfulDeleteRating: false,
        messageDeleteRating: "",
    })

    const { successfulSID, messageSID, user } = sidData;
    const { successfulEventId, messageEventId, event} = eventIdData;
    const { successful, message, recentUsers, recentEvents, totalUsers, totalEvents } = recentData;

    useEffect(() => {
        
        loadRecentData();

        return () => {
            setRecentData({});
        };

    }, []);

    let loadedUsers = 0;
    let loadedEvents = 0;
    let userData = 0;
    let eventData = 0;

    const loadRecentData = () => {
                            /*
      This function aims to load all the recent data to populate the admin dashboard
      This function will be called as soon as the admin opens the admin dashboard
    */
        const currentUser = AuthService.getCurrentUser();

        AdminService.loadRecentUsersAndEvents(currentUser)
        .then(response => {
            setRecentData({ successful: true, message: response.data.message, totalUsers: response.data.userCount, totalEvents: response.data.eventCount, recentUsers: response.data.users, recentEvents: response.data.events });
            [userData, eventData] = convertToArrayObject(recentUsers, recentEvents);
        },
        error => {
            setRecentData({ successful: false, message: "Failed to fetch user and events data "});
        })
    }

    const handleInput = (e) => {
                                    /*
      This function aims to set the admin request to whatever is being typed by the admin
      Requirement (parameter): the parameter e passed is the whole data related to the form
      This function will be called as soon as the user types in anything related in the request part of admin dashboard
    */
        setAdminRequest({ ...adminRequest, [e.target.name]: e.target.value });
    };

    const handleSubmitSID = (e) => {
                    /*
      This function aims to send the request for getting the user based on SID to the back-end for processing
      Requirement (parameter): the parameter e passed is the whole data related to the form
      This function will be called as soon as the admin presses the query user by SID button
    */
        e.preventDefault();
        
        const currentUser = AuthService.getCurrentUser();
        let sid = adminRequest.querySID;

        AdminService.querySID(currentUser, sid)
        .then(response => {
            setSidData({ successfulSID: true, messageSID: response.data.message, user: response.data.user });
            setDeleteUser({ sid: response.data.user.sid});
        },
        error => {
            setSidData({ successfulSID: false, messageSID: error.response.data.message });
        })
    }

    const handleSubmitEventID = (e) => {
                        /*
      This function aims to send the request for getting the event based on event id to the back-end for processing
      Requirement (parameter): the parameter e passed is the whole data related to the form
      This function will be called as soon as the admin presses the query event by ID
    */
        e.preventDefault();
        
        const currentUser = AuthService.getCurrentUser();
        let eid = adminRequest.queryEventId;

        AdminService.queryEventId(currentUser, eid)
        .then(response => {
            setEventIdData({ successfulEventId: true, messageEventId: response.data.message, event: response.data.event });
            setDeleteEvent({ eid: response.data.event.eventID});
        },
        error => {
            setEventIdData({ successfulEventId: false, messageEventId: error.response.data.message, event: error.response.data.event });
        })
    }

    const handleDeleteEvent = (e) => {
                            /*
      This function aims to send the request for deleting a specific event to the back-end 
      Requirement (parameter): the parameter e passed is the whole data related to the form
      This function will be called as soon as the admin presses the delete event button
    */
        e.preventDefault();

        const currentUser = AuthService.getCurrentUser();
        let eid = deleteEvent.eid;

        AdminService.deleteSelectedEvent(currentUser, eid, adminRequest.adminPasswordEvent)
        .then(response => {
            setEventIdData({ event: "" });
            setAdminRequest({ queryEventId: "" });
            loadRecentData();
            setDeleteEvent({ successfulDeleteEvent: true, messageDeleteEvent: response.data.message });
        },
        error => {
            setDeleteEvent({ successfulDeleteEvent: false, messageDeleteEvent: error.response.data.message });
        })
    }

    const handleDeleteComment = (e) => {
                                    /*
      This function aims to delete all the comment related to a deleted event
      Requirement (parameter): the parameter e passed is the whole data related to the form
      This function will be called as soon as the admin presses the delete comment button
    */
        e.preventDefault();

        const currentUser = AuthService.getCurrentUser();
        let eid = deleteEvent.eid;

        if (!myChatHistory.current.outerHTML.includes(eid) && !myPinnedComment.current.outerHTML.includes(eid)) {
            setDeleteEvent({ successfulDeleteEvent: false, messageDeleteEvent: "Invalid comment _id" });
        }
        else {

            AdminService.deleteEventComment(currentUser, eid, adminRequest.adminPasswordEvent, adminRequest.deleteComment)
            .then(response => {
                setEventIdData({ event: "" });
                setAdminRequest({ queryEventId: eid });
                loadRecentData();
                setDeleteEvent({ successfulDeleteEvent: true, messageDeleteEvent: response.data.message });
            },
            error => {
                setDeleteEvent({ successfulDeleteEvent: false, messageDeleteEvent: error.response.data.message });
            })
        }
    }
    
    const handleDeleteUser = (e) => {
                                            /*
      This function aims to delete a specific user and sending this request to the back-end for processing
      Requirement (parameter): the parameter e passed is the whole data related to the form
      This function will be called as soon as the admin presses the delete user button
    */
        e.preventDefault();

        const currentUser = AuthService.getCurrentUser();
        let sid = deleteUser.sid;

        AdminService.deleteSelectedUser(currentUser, sid, adminRequest.adminPasswordUser, adminRequest.newUserPassword)
        .then(response => {
            setSidData({ user: "" });
            setAdminRequest({ querySID: "" });
            loadRecentData();
            setDeleteUser({ successfulDeleteUser: true, messageDeleteUser: response.data.message });
        },
        error => {
            setDeleteUser({ successfulDeleteUser: false, messageDeleteUser: error.response.data.message });
        })
    }

    const handleChangeUserPass = (e) => {
                                            /*
      This function aims to change a user's password and sending this request to the back-end for processing
      Requirement (parameter): the parameter e passed is the whole data related to the form
      This function will be called as soon as the admin presses the change user password button
    */
        e.preventDefault();

        const currentUser = AuthService.getCurrentUser();
        let sid = deleteUser.sid;

        AdminService.changeUserPass(currentUser, sid, adminRequest.adminPasswordUser, adminRequest.newUserPassword)
        .then(response => {
            setSidData({ user: "" });
            setAdminRequest({ querySID: sid });
            setDeleteUser({ successfulDeleteUser: true, messageDeleteUser: response.data.message });
            loadRecentData();
        },
        error => {
            setDeleteUser({ successfulDeleteUser: false, messageDeleteUser: error.response.data.message });
        })
    }


    const handleDeleteRating = (e) => {
                    /*
      This function aims to delete a specific user rating and sending this request to the back-end for processing
      Requirement (parameter): the parameter e passed is the whole data related to the form
      This function will be called as soon as the admin presses the delete user rating button
    */
        e.preventDefault();

        const currentUser = AuthService.getCurrentUser();
        let sid = deleteUser.sid;


        if (!myCommenters.current.outerHTML.includes(parseInt(adminRequest.deleteRating))) {
            setDeleteUser({ successfulDeleteUser: false, messageDeleteUser: "Invalid sid" });
        }
        else {
            AdminService.deleteRating(currentUser, sid, adminRequest.adminPasswordUser, adminRequest.deleteRating)
            .then(response => {
                setSidData({ user: "" });
                setAdminRequest({ querySID: sid });
                setDeleteUser({ successfulDeleteUser: true, messageDeleteUser: response.data.message });
                loadRecentData();
            },
            error => {
                setDeleteUser({ successfulDeleteUser: false, messageDeleteUser: error.response.data.message });
            })
        }
    }

    function convertToArrayObject (recentUsers, recentEvents) {
                                            /*
      This function aims to 
      Requirement (parameter): the parameter is the recentUsers and recentEvents loaded from the previously called functions
      This function will be called as soon as the admin open the admin dashboard.
    */
        if (recentUsers && recentEvents) {
            let loadedUsers = Object.keys(recentUsers).map((key) => (
                {"sid": recentUsers[key]["sid"], "username": recentUsers[key]["username"]}
            ));

            let loadedEvents = Object.keys(recentEvents).map((key) => (
                {"eventID": recentEvents[key]["eventID"], "title": recentEvents[key]["title"]}
            ));

            return [loadedUsers, loadedEvents];
        }
        else {
            return [];
        }
    }


    [userData, eventData] = convertToArrayObject(recentUsers, recentEvents);

    return (
        <div style={{ marginBottom: 50 }}>
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
                            required
                        />
                    </div>
                    <Button type="submit" variant="outline-dark" value="Query SID">Query SID</Button>
                </Form>
                {messageSID && (
                <div className="form-group">
                    <div
                    className={
                        successfulSID? "d-none": "alert alert-danger"
                    }
                    role="alert"
                    >
                    {messageSID}
                    </div>
                </div>
                )}
                {user && (
                    <div>

                        <p>Username: <a href={"/user/" + user.sid}>{user.username}</a></p>
                        <p>SID: <strong>{user.sid}</strong></p>
                        <p>Email: <strong>{user.email}</strong></p>
                        <p>Mobile Number: <strong>{user.mobileNumber}</strong></p>
                        <p>Interests: <strong>{user.interests}</strong></p>
                        <p>College: <strong>{user.college}</strong></p>
                        <p>About: <strong>{user.about}</strong></p>
                        <p>Positive Ratings: <strong>{user.posRating}</strong></p>
                        <p>Negative Ratings: <strong>{user.negRating}</strong></p>
                        <pre>Following: <strong>{JSON.stringify(user.following, null, 2)}</strong></pre>
                        <pre>Followers: <strong>{JSON.stringify(user.followers, null, 2)}</strong></pre>
                        <pre>Registered Events: <strong>{JSON.stringify(user.registeredEvents, null, 2)}</strong></pre>
                        <pre>Starred Events: <strong>{JSON.stringify(user.starredEvents, null, 2)}</strong></pre>
                        <pre>Feed Activities: <strong>{JSON.stringify(user.feedActivities, null, 2)}</strong></pre>
                        <p>Role: <strong>{user.role}</strong></p>
                        <p>Active: <strong>{user.active}</strong></p>
                        <pre ref={myCommenters}>Review History: <strong>{JSON.stringify(user.reviewHistory, null, 2)}</strong></pre>
                        <p>Created at: <strong>{user.createdAt}</strong></p>
                        <Row>
                            <Col>
                                <div id="deleteUserForm">
                                <Form onSubmit={handleDeleteUser}>
                                    <div className="form-group">
                                        <label className="form-label">Enter your (ADMIN) password to confirm user deletion:</label>
                                        <Form.Control 
                                            name="adminPasswordUser"
                                            type="password" 
                                            value={adminRequest.adminPasswordUser || ""}
                                            placeholder={"Type in your password"}
                                            onChange={handleInput} 
                                            required
                                        />
                                    </div>
                                    <Button type="submit" variant="danger" value="Delete this user">Delete this user</Button>
                                </Form>
                                </div>
                            </Col>
                            <Col>
                                <div id="changeUserPassForm">
                                <Form onSubmit={handleChangeUserPass}>
                                    <div className="form-group">
                                        <label className="form-label">Enter your (ADMIN) password to confirm change password:</label>
                                        <Form.Control 
                                            name="adminPasswordUser"
                                            type="password" 
                                            value={adminRequest.adminPasswordUser || ""}
                                            placeholder={"Type in your password"}
                                            onChange={handleInput} 
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Enter new user password:</label>
                                        <Form.Control 
                                            name="newUserPassword"
                                            type="text" 
                                            value={adminRequest.newUserPassword || ""}
                                            placeholder={"Type in new user password"}
                                            onChange={handleInput} 
                                            required
                                        />
                                    </div>
                                    <Button type="submit" variant="danger" value="Change this user's password">Change this user's password</Button>
                                </Form>
                                </div>
                            </Col>
                            <Col>
                                <div id="deleteUserRating">
                                <Form onSubmit={handleDeleteRating}>
                                    <div className="form-group">
                                        <label className="form-label">Enter your (ADMIN) password to confirm deletion:</label>
                                        <Form.Control 
                                            name="adminPasswordUser"
                                            type="password" 
                                            value={adminRequest.adminPasswordUser || ""}
                                            placeholder={"Type in your password"}
                                            onChange={handleInput} 
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Enter rater's SID:</label>
                                        <Form.Control 
                                            name="deleteRating"
                                            type="number" 
                                            value={adminRequest.deleteRating || ""}
                                            placeholder={"Type in rater's sid"}
                                            onChange={handleInput} 
                                            required
                                        />
                                    </div>
                                    <Button type="submit" variant="danger" value="Delete this user">Delete this user's rating</Button>
                                </Form>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}

                {deleteUser.messageDeleteUser && (
                    <div className="form-group">
                        <div
                        className={
                            deleteUser.successfulDeleteUser? "alert alert-success": "alert alert-danger"
                        }
                        role="alert"
                        >
                        {deleteUser.messageDeleteUser}
                        </div>
                    </div>
                )}

            </Container>
            <hr></hr>
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
                            required
                        />
                    </div>
                    <Button type="submit" variant="outline-dark" value="Query Event ID">Query Event ID</Button>
                </Form>
                {messageEventId && (
                    <div className="form-group">
                        <div
                        className={
                            successfulEventId? "d-none": "alert alert-danger"
                        }
                        role="alert"
                        >
                        {messageEventId}
                        </div>
                    </div>
                )}
                {event && (
                    <div>
                        {/* {console.log(event)} */}
                        <p>Title: <a href={"/event/" + event.eventID}>{event.title}</a></p>
                        <p>Event ID: <strong>{event.eventID}</strong></p>
                        <p>Status: <strong>{event.status}</strong></p>
                        <p>Venue: <strong>{event.venue}</strong></p>
                        <p>Start: <strong>{event.start}</strong></p>
                        <p>End: <strong>{event.end}</strong></p>
                        <p>Activity Category: <strong>{event.activityCategory}</strong></p>
                        <p>Quota: <strong>{event.quota}</strong></p>
                        <p>Number of Participants: <strong>{event.numberOfParticipants}</strong></p>
                        <pre>Participants: <strong>{JSON.stringify(event.participants, null, 4)}</strong></pre>
                        <pre ref={myChatHistory}>Chat History: <strong>{JSON.stringify(event.chatHistory, null, 4)}</strong></pre>
                        <pre ref={myPinnedComment}>Pinned Comments: <strong>{JSON.stringify(event.pinnedComment, null, 4)}</strong></pre>
                        <p>Created by: <strong>{String(event.createdBy)}</strong></p>
                        <p>Created At: <strong>{event.createdAt}</strong></p>
                        
                        <Row>
                            <Col>
                                <div>
                                <Form onSubmit={handleDeleteEvent}>
                                    <div className="form-group">
                                        <label className="form-label">Enter password to confirm deletion:</label>
                                        <Form.Control 
                                            name="adminPasswordEvent"
                                            type="password" 
                                            value={adminRequest.adminPasswordEvent || ""}
                                            placeholder={"Type in your password"}
                                            onChange={handleInput} 
                                        />
                                    </div>
                                    <Button type="submit" variant="danger" value="Delete this event">Delete this event</Button>
                                </Form>
                                </div>
                            </Col>

                            <Col>
                                <div>
                                <Form onSubmit={handleDeleteComment}>
                                    <div className="form-group">
                                        <label className="form-label">Enter password to confirm deletion:</label>
                                        <Form.Control 
                                            name="adminPasswordEvent"
                                            type="password" 
                                            value={adminRequest.adminPasswordEvent || ""}
                                            placeholder={"Type in your password"}
                                            onChange={handleInput} 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Enter comment._id to delete:</label>
                                        <Form.Control 
                                            name="deleteComment"
                                            type="text" 
                                            value={adminRequest.deleteComment || ""}
                                            placeholder={"Type in your target comment._id"}
                                            onChange={handleInput} 
                                        />
                                    </div>
                                    <Button type="submit" variant="danger" value="Delete this comment">Delete this comment</Button>
                                </Form>
                                </div>
                            </Col>
                        </Row>
                        
                    </div>
                )}
                {deleteEvent.messageDeleteEvent && (
                    <div className="form-group">
                        <div
                        className={
                            deleteEvent.successfulDeleteEvent? "alert alert-success": "alert alert-danger"
                        }
                        role="alert"
                        >
                        {deleteEvent.messageDeleteEvent}
                        </div>
                    </div>
                )}
            </Container>
            <hr></hr>
        </div>
        <Container>
            <Row>
                <Col>
                    <h2>Total user count: {totalUsers}</h2>
                    <h2>Recently registered users</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>SID</th>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                        {userData && (
                            <>
                            {userData.map((key) => (
                                <tr key={key.sid}>
                                    <td>{key.sid}</td>
                                    <td>{key.username}</td>
                                </tr>
                            ))}
                            </>
                        )}
                        </tbody>
                    </Table>
                </Col>
                <Col>
                    <h2>Total event count: {totalEvents}</h2>
                    <h2>Recently created events</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Event ID</th>
                                <th>Event Title</th>
                            </tr>
                        </thead>
                        <tbody>
                        {eventData && (
                            <>
                            {eventData.map((key) => (
                                <tr key={key.eventID}>
                                    <td>{key.eventID}</td>
                                    <td>{key.title}</td>
                                </tr>
                            ))}
                            </>
                        )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            {message && (
                <div className="form-group">
                    <div
                    className={
                        successful? "d-none": "alert alert-danger"
                    }
                    role="alert"
                    >
                    {message}
                    </div>
                </div>
            )}

        </Container>
        </div>
    );

}
