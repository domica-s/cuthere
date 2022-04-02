import React, { useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import Axios from 'axios' 
import { Row, Col } from 'antd';
import AuthService from "../services/auth.service";
import history from "../history";

// import smaller components related to the events 
import EventImage from './eventDetailsComponent/EventImage'
import EventInfo from './eventDetailsComponent/EventInfo'


export default function (props) { 

    // WORKSTREAM / STATUS:
    // --> DONE: Functions 
    // --> To be fixed: Authorization using AuthJWT + Can't read properties of content-type (HTTP headers)
    // --> To do: Fix UI
    const [Event, setEvent] = useState([])
    const location = useLocation();

    // Defining Configuration and Parameters
    const currentUser = AuthService.getCurrentUser();
    const eventId = location.pathname.split('/event/')[1]
    const userID = currentUser._id

    // STATUS: WORKING
    useEffect(() => {
        Axios.get(`http://localhost:8080/api/calendar/route-event/${eventId}`).then(response => {    
        setEvent(response.data)
            
        })
    }, [location])

    // Register Event Front-end --> WORKING
    async function joinTheEvent(eventID){
        const request = await Axios.post(`http://localhost:8080/event/register/${eventID}`,{id: userID}, {"x-access-token": currentUser.accessToken, "content-type": 'application/json'})
        console.log(request)
    }

    // Unregister Event Front-End --> WORKING
    async function unregister(eventID){
        const request = await Axios.post(`http://localhost:8080/event/unregister/${eventID}`, {id: userID}, {"x-access-token": currentUser.accessToken, "content-type": 'application/json'})
        console.log(request)
    }

    // Delete Event Front-End --> WORKING
    async function deleteEvent(eventID){
        const request = await Axios.get(`http://localhost:8080/event/delete/${eventID}`,{id: userID}, {"x-access-token": currentUser.accessToken, "content-type": 'application/json'})
        // Re-routing to all events page
        if (request.status = 'SUCCESS'){
            history.push({
                state: request,
                pathname: '/event',
            });
            history.go();
        }
        else console.log(request.message)
    }
    
    // Add comments Front-End --> TESTING
    async function addComment(eventID, comment){
        const request = await Axios.post(`http://localhost:8080/event/addcomment/${eventID}`,{id: userID, comment: comment},{"x-access-token": currentUser.accessToken, "content-type": 'application/json'})
        console.log(request)
    }

    // Update Event Front-end --> TESTING
    async function updateEvent(eventID){
        const content = "Hello World!" // Change this to updated content
        const request = await Axios.post(`http://localhost:8080/event/update/${eventID}`,{id:userID, update:content}, {"x-access-token": currentUser.accessToken, "content-type": 'application/json'})
        console.log(request)
    }

    return (
        <React.Fragment>
            <div className="postPage" style={{
                width: '100%',
                padding: '3 rem 4 rem'
            }}>

                <div style = {{
                    display: 'flex',
                    justifyContent: "center"
                }}>
                    <h1> {Event.title} </h1>
                </div>

                <br/> 

                <Row gutter = {[16,16]}>

                    <Col lg={12} xs={24}>
                        <EventImage detail ={Event} />
                    </Col> 

                    <Col lg={12} xs={24}>
                    <EventInfo 
                        unjoinEvent = {unregister}
                        joinEvent = {joinTheEvent}
                        deleteEvent = {deleteEvent}
                        updateEvent = {updateEvent}
                        addComment = {addComment}
                        detail = {Event}/>
                    </Col>
                    
                </Row>
            </div>
        </React.Fragment>

    )








}