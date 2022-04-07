import React, { useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import {useParams} from "react-router-dom";
import Axios from 'axios' 
import { Row, Col } from 'antd';
import AuthService from "../services/auth.service";
import history from "../history";
import moment from 'moment';
import { OneChat } from './eventDetailPage';

// import smaller components related to the events 
import EventImage from './eventDetailsComponent/EventImage'
import EventInfo from './eventDetailsComponent/EventInfo'
import CommentForm from './eventDetailsComponent/CommentForm';
import { DayTableSlicer } from '@fullcalendar/daygrid';
import { isDateSelectionValid } from '@fullcalendar/react';

export default function (props) { 

    // WORKSTREAM / STATUS:
    // --> DONE: Functions 
    // --> To be fixed: Authorization using AuthJWT + Can't read properties of content-type (HTTP headers)
    // --> To do: Fix UI
    const [Event, setEvent] = useState([])
    const location = useLocation();
    const [chatHistory, setChatHistory] = useState([]);
    const [eventDone, setEventDone] = useState(false)

    // Defining Configuration and Parameters
    const currentUser = AuthService.getCurrentUser();
    const eventId = location.pathname.split('/event/')[1]
    const userID = currentUser._id
    const sid = currentUser.sid

    // STATUS: WORKING
    useEffect(() => {
        Axios.get(`http://localhost:8080/api/calendar/route-event/${eventId}`,         
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        }).then(response => {    
        setEvent(response.data);
        setChatHistory([response.data.chatHistory])

        // Set Event Done if > ending date: 
        var now = moment().toDate().getTime()
        var event = moment(response.data.end).toDate().getTime()
        if (now > event)  setEventDone(true)
        })
    }, [location])
    
    // Register Event Front-end --> WORKING
    async function joinTheEvent(eventID){
        const request = await Axios.post(`http://localhost:8080/event/register/${eventID}`,{id: userID},         
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
        console.log(request)
    }

    // Unregister Event Front-End --> WORKING
    async function unregister(eventID){
        const request = await Axios.post(`http://localhost:8080/event/unregister/${eventID}`, {id: userID},         
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
        console.log(request)
    }

    // Delete Event Front-End --> WORKING
    async function deleteEvent(eventID){
        const request = await Axios.post(`http://localhost:8080/event/delete/${eventID}`,{id: userID},
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
        // Re-routing to all events page
        console.log(request);
        if (request.status = 'SUCCESS'){
            console.log(request);
            history.push({
                state: request,
                pathname: '/event',
            });
            history.go();
        }
        else console.log(request.message)
    }
    
    // Add comments Front-End --> WORKING
    async function addComment(eventID, comment){
        const updatedComment = { 
            user: sid,
            content: comment,
            chatAt: Date.now(),
            userDetails: currentUser
        }
        const request = await Axios.post(`http://localhost:8080/event/addcomment/${eventID}`,{comment: updatedComment},
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
        // store chatHistory
        setChatHistory(request.data.response.chatHistory)
    }

    // Update Event Front-end --> TESTING
    async function updateEvent(eventID, updatedContent){
        const request = await Axios.post(`http://localhost:8080/event/update/${eventID}`,{id:userID, update: updatedContent}, 
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
        console.log(request)
    }
    
    console.log(Event)
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
                        <EventImage detail={Event} eventID={eventId} category={Event.activityCategory}/>
                    </Col> 

                    <Col lg={12} xs={24}>
                    <EventInfo 
                        eventDone ={eventDone}
                        unjoinEvent = {unregister}
                        joinEvent = {joinTheEvent}
                        deleteEvent = {deleteEvent}
                        updateEvent = {updateEvent}
                        addComment = {addComment}
                        detail = {Event}/>
                    </Col>
                    <CommentForm detail={Event} addComment={addComment} chatHistory={chatHistory}/>
                </Row>
            </div>
        </React.Fragment>

    )








}