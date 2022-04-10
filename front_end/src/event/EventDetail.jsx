import React, { useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import {useParams} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Axios from 'axios' 
import { Row, Col } from 'antd';
import AuthService from "../services/auth.service";
import history from "../history";
import moment from 'moment';

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
    const navigation = useNavigate();

    const [chatHistory, setChatHistory] = useState([]);
    const [pinnedComment, setPinnedComment] = useState([]);
    const [fectched, setFetched] = useState(false);
    const [eventDone, setEventDone] = useState(false)

    // Defining Configuration and Parameters
    const currentUser = AuthService.getCurrentUser();
    const eventId = location.pathname.split('/event/')[1]
    const userID = currentUser._id
    const sid = currentUser.sid
    // STATUS: WORKING
    useEffect(() => {
        const fetchData = async () => {
            const response = await Axios.get(`http://localhost:8080/api/calendar/route-event/${eventId}`,
            {
                headers: {
                    "x-access-token": currentUser.accessToken
                }
            });
            const responseData = await response.data;
            await setEvent(responseData);
            await setChatHistory(responseData.chatHistory);
            await setPinnedComment(responseData.pinnedComment);
            if (responseData) setFetched(true);           

            var now = moment().toDate().getTime();
            var event = await moment(responseData.end).toDate().getTime();
            if (event && now > event) setEventDone(true);
        }
        if (!fectched) {
            fetchData();
        }

        const refreshInterval = setInterval(() => {setFetched(false)}, 2000);

        return () => {
            console.log('clearing interval...');
            clearInterval(refreshInterval);
        };

    }, [chatHistory, pinnedComment])
    
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
            name: currentUser.name,
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

    // Update Event Front-end --> WORKING
    async function updateEvent(eventID, updatedContent){
        const request = await Axios.post(`http://localhost:8080/event/update/${eventID}`,{id:userID, update: updatedContent}, 
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
        console.log(request)
    }
    
    // Function to add to favorites --> WORKING
    async function addToFav(eventID){
        const request = await Axios.post(`http://localhost:8080/event/fav/${eventID}`, {id: userID},         {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
        console.log(request)
    }

    // Function to unadd from favorites --> WORKING
    async function unaddToFav(eventID){
        const request = await Axios.post(`http://localhost:8080/event/noFav/${eventID}`, {id: userID},         {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
        console.log(request)
    }

    // Function to pin comment --> TESTING
    async function pinComment(eventID, comment){
        console.log(eventID, comment)
        const request = await Axios.post(`http://localhost:8080/event/pin/${eventID}`,{comment: comment},
            {
                headers: {
                    "x-access-token": currentUser.accessToken
                }
            } 
        )
        console.log(request)
        setPinnedComment(request.data.response.pinnedComment)
        setChatHistory(request.data.response.chatHistory)
    }
    
    // Function to unpin comment --> TESTING
    async function unPinComment(eventID, comment){
        
        const request = await Axios.post(`http://localhost:8080/event/unpin/${eventID}`, {comment: comment}, 
            {
                headers: {
                    "x-access-token": currentUser.accessToken
                }
            }
        )
        console.log(request)
        setPinnedComment(request.data.response.pinnedComment)
        setChatHistory(request.data.response.chatHistory)
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
                        addToFav = {addToFav}
                        unaddToFav = {unaddToFav}
                        detail = {Event}/>
                    </Col>

                    <CommentForm 
                        detail={Event} 
                        addComment={addComment} 
                        chatHistory={chatHistory}
                        pinnedComment = {pinnedComment}
                        pinComment = {pinComment}
                        unPinComment = {unPinComment} navigation={navigation}/>
                </Row>
            </div>
        </React.Fragment>

    )








}