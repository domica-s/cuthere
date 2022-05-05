// The program for the frontend of event details
// PROGRAMMER: PHILIP TARARANTINO LIMAS
// This program is called when the user clicks into the event, and the details of the event will be shown
// Revised on 5/5/2022
import React, { useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import {useParams} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Axios from 'axios' 
import { Row, Col } from 'antd';
import AuthService from "../services/auth.service";
import history from "../history";
import moment from 'moment';
import EventImage from './eventDetailsComponent/EventImage'
import EventInfo from './eventDetailsComponent/EventInfo'
import CommentForm from './eventDetailsComponent/CommentForm';
import { DayTableSlicer } from '@fullcalendar/daygrid';
import { isDateSelectionValid } from '@fullcalendar/react';
import './EventDetail.css'
import { Card } from 'react-bootstrap';
export default function (props) { 
    const [Event, setEvent] = useState([])
    const location = useLocation();
    const navigation = useNavigate();

    const [chatHistory, setChatHistory] = useState([]);
    const [pinnedComment, setPinnedComment] = useState([]);
    const [fectched, setFetched] = useState(false);
    const [eventDone, setEventDone] = useState(false)

    const currentUser = AuthService.getCurrentUser();
    const eventId = location.pathname.split('/event/')[1]
    const userID = currentUser._id
    const sid = currentUser.sid

    var params = require("../params/params");

    useEffect(() => {
                /*
      This function is used to fetch the data related to the specific event and also re-renders whenever there is a change in the pinnedComment / chatHistory data
      This function will be called immediately when the specific page related to the event is rendered
    */
        const fetchData = async () => {
            const response = await Axios.get(`${params.baseBackURL}/api/calendar/route-event/${eventId}`,
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
            clearInterval(refreshInterval);
        };

    }, [chatHistory, pinnedComment])
    
    async function joinTheEvent(eventID){
        /*
      This function is used to called to register the event for the specific user in the back-end
      Requirements (parameter): The event id of the event is passed as eventID
      This function will be called after the user clicks the register event in the specific event details page
    */
        const request = await Axios.post(`${params.baseBackURL}/event/register/${eventID}`,{id: userID},         
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }

    async function unregister(eventID){
                /*
      This function is used to called to un-register from the event for the specific user in the back-end
      Requirements (parameter): The event id of the event is passed as eventID
      This function will be called after the user clicks the un-register event in the specific event details page
    */
        const request = await Axios.post(`${params.baseBackURL}/event/unregister/${eventID}`, {id: userID},         
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }

    async function deleteEvent(eventID){
        /*
      This function is used to called to register the delete the event in the back-end and re-route the user to the all events page in the user journey
      Requirements (parameter): The event id of the event is passed as eventID
      This function will be called after the user clicks the delete event in the specific event details page
    */
        const request = await Axios.post(`${params.baseBackURL}/event/delete/${eventID}`,{id: userID},
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
 
        if (request.status = 'SUCCESS'){
            history.push({
                state: request,
                pathname: '/event',
            });
            history.go();
        }
        else console.log(request.message)
    }
    

    async function addComment(eventID, comment){
                /*
      This function is used to called to store the added comment in the back-end and re-render the page with the added comment
      Requirements (parameter): The event id of the event is passed as eventID, comment data is passed as comment
      This function will be called after the user clicks the add comment button
    */
        const updatedComment = { 
            user: sid,
            name: currentUser.name,
            content: comment,
            chatAt: Date.now(),
            userDetails: currentUser
        }
        const request = await Axios.post(`${params.baseBackURL}/event/addcomment/${eventID}`,{comment: updatedComment},
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
        setChatHistory(request.data.response.chatHistory)
    }

    async function updateEvent(eventID, updatedContent){
                /*
      This function is used to called to update the database with any updated content
      Requirements (parameter): The event id of the event is passed as eventID and the content to update is passed as updatedContent
      This function will be called after the user clicks the update button on a specific element / variable
    */
        const request = await Axios.post(`${params.baseBackURL}/event/update/${eventID}`,{id:userID, update: updatedContent}, 
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }
    
    async function addToFav(eventID){
            /*
      This function is used to called to add the event to the user's favorite in the back-end
      Requirements (parameter): The event id of the event is passed as eventID
      This function will be called after the user clicks the favorite event button in the event detail page
    */
        const request = await Axios.post(`${params.baseBackURL}/event/fav/${eventID}`, {id: userID},         {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }

    async function unaddToFav(eventID){
                    /*
      This function is used to called to remove the event from the user's favorite in the back-end
      Requirements (parameter): The event id of the event is passed as eventID
      This function will be called after the user clicks the unfavorite event button in the event detail page
    */
        const request = await Axios.post(`${params.baseBackURL}/event/noFav/${eventID}`, {id: userID},         {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }

    async function pinComment(eventID, comment){
            /*
      This function is used to called to add a specific comment into the list of pinned comments in the back-end
      Requirements (parameter): The event id of the event is passed as eventID, the comment card will be passed as comment
      This function will be called after the user clicks on the pin button on a specific comment card
    */
        const request = await Axios.post(`${params.baseBackURL}/event/pin/${eventID}`,{comment: comment},
            {
                headers: {
                    "x-access-token": currentUser.accessToken
                }
            } 
        )
        setPinnedComment(request.data.response.pinnedComment)
        setChatHistory(request.data.response.chatHistory)
    }

    async function unPinComment(eventID, comment){
                    /*
      This function is used to called to remove a specific comment from the list of pinned comments in the back-end
      Requirements (parameter): The event id of the event is passed as eventID, the comment card will be passed as comment
      This function will be called after the user clicks on the unpin button on a specific comment card
    */
        const request = await Axios.post(`${params.baseBackURL}/event/unpin/${eventID}`, {comment: comment}, 
            {
                headers: {
                    "x-access-token": currentUser.accessToken
                }
            }
        )
        setPinnedComment(request.data.response.pinnedComment)
        setChatHistory(request.data.response.chatHistory)
    }

    return (
        <React.Fragment>
                   <Card><Card.Header style={{padding:'1rem',fontSize:'2rem'}}>{Event.title}</Card.Header></Card>

               

                <Row gutter = {[16,16]}>

                    
                        <EventImage detail={Event} eventID={eventId} category={Event.activityCategory}/>
                  
                    <div>
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
                    </div>
                    <div>
                        <CommentForm 
                            detail={Event} 
                            addComment={addComment} 
                            chatHistory={chatHistory}
                            pinnedComment = {pinnedComment}
                            pinComment = {pinComment}
                            unPinComment = {unPinComment} navigation={navigation}
                            createdBy = {Event.createdBy}/>
                            
                    </div>
                </Row>
        </React.Fragment>

    )








}