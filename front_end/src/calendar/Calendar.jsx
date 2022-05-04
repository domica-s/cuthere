// The program for the frontend of the Calendar 
// Programmer: Philip Tarrantino Limas
// The program is called when the user clicks on the calendar
// Revised on 5/5/2022

import React, {useState, useRef, useEffect} from 'react';
import FullCalendar, { preventSelection } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import AddEventModal from './AddEventModal';
import axios from 'axios';
import moment from 'moment';
import "react-datetime/css/react-datetime.css";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import history from "../history";
import AuthService from "../services/auth.service";

export default function () {
    var params = require("../params/params");
    const [modalOpen, setModalOpen] = useState(false)
    const [events, setEvents] = useState([])
    const [yourCalendar, setYourCalendar] = useState(false);

    const [, updateState] = React.useState()
    const forceUpdate = React.useCallback(()=> updateState({}), []);

    const calendarRef = useRef(null)
    const currentUser = AuthService.getCurrentUser();

    const config = { 
        headers: {
            "x-access-token": currentUser.accessToken,
        }
    }

    const onEventAdded = (event) => {
        let calendarApi = calendarRef.current.getApi() 

        calendarApi.addEvent({
            start: moment(event.start).toDate(),
            end: moment(event.end).toDate(),
            venue: event.venue,
            title: event.title,
            quota: event.quota,
            activityCategory: event.activityCategory,
            createdBy: currentUser._id
        });

    }

    
    // To handle Event Add --> WORKING
    async function handleEventAdd(data){
        /*
      This function is triggered when the user pressed the submit button
      Requirement(parameters): The data is object containing data about the event
    */
        await axios.post(params.baseBackURL+"/api/calendar/create-event", data.event,         {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        });
    }


    async function handleDatesSet(data, yourCalendar = false, favorite = false){
                /*
      This function is triggered when the a calendar view is set (i.e., Dates are set)
      Requirement(parameters): 1) Data is object containing the data about the event, 2) yourCalendar is to mark whether to filter based on 'my events', 3) Favorite is to mark whether to filter based on 'favorited-events'
    */

        // To get all the events to the calendar
        if (!yourCalendar){
            const response = await axios.get(params.baseBackURL+'/api/calendar/get-event?start='+moment(data.start).toISOString() +'&end='+moment(data.end).toISOString(),        {
                headers: {
                    "x-access-token": currentUser.accessToken
                }
            })
            setEvents(response.data)
        }

        // To get only your events to the calendar 
        else if (!favorite){
            const response = await axios.post(params.baseBackURL+"/api/calendar/my-event?start="+moment(data.start).toISOString()+'&end='+moment(data.end).toISOString(),{user: currentUser},        {
                headers: {
                    "x-access-token": currentUser.accessToken
                }
            })
            setEvents(response.data)
        }
        
        // Get your favorite events
        else {
            const response = await axios.post(params.baseBackURL+"/api/calendar/fav-event?start="+moment(data.start).toISOString()+'&end='+moment(data.end).toISOString(), {user: currentUser}, {
                headers: {
                    "x-access-token": currentUser.accessToken
                }
            })
            setEvents(response.data)
        }
        
    
    }



    async function handleEventClick(event){
        /*
      This function is triggered when a specific event in the calendar is clicked
      Requirement(parameters): 1) Event is the object containing data about the event
    */

        const id = event.event._def.extendedProps.eventID
        const response = await axios.get(params.baseBackURL+"/api/calendar/route-event/"+id,        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        });

        history.push({
            state: response.data,
            pathname: '/event/'+id,
        });
        history.go();
        
        
    }

    return(
        <React.Fragment> 
            <Container>
                <Col> 
                    <Button className="mb-3 m-2" variant="outline-warning" onClick ={() => setModalOpen(true)}> Add Event </Button>
                </Col>
                
            </Container>

                <div style ={{position: "relative", zIndex: 0}}>
                    <FullCalendar 
                        ref ={calendarRef}
                        events = {events}
                        plugins = {[dayGridPlugin]}
                        initialView = "dayGridMonth"
                        eventClick = {(event) => handleEventClick(event)}
                        eventAdd = {(event) => handleEventAdd(event)}
                        customButtons={{
                            yourEventButton: {
                                text: 'Your Events',
                                click: () => {
                                    setYourCalendar(true)
                                    const calendarApi = calendarRef.current.getApi()
                                    handleDatesSet(calendarApi.currentDataManager.data.dateProfile.activeRange, true)

                                }
                            },
                            allEventButton: {   
                                text: 'All Events',
                                click:() => {
                                    setYourCalendar(false)
                                    const calendarApi = calendarRef.current.getApi()
                                    handleDatesSet(calendarApi.currentDataManager.data.dateProfile.activeRange, false)
                                }
                            },
                            favEventButton: {
                                text: 'Favourite Events',
                                click: () => {
                                    setYourCalendar(true)
                                    const calendarApi = calendarRef.current.getApi()
                                    handleDatesSet(calendarApi.currentDataManager.data.dateProfile.activeRange, true, true)

                                }
                            }
                        }}
                        headerToolbar = {{
                            right: 'prev,next today',
                            left:'title',
                            center:'favEventButton yourEventButton allEventButton'

                        }}
                        datesSet= {(date) => handleDatesSet(date)}
                        
                        
                    />
                </div>


            <AddEventModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onEventAdded ={event => onEventAdded(event)} />
        </React.Fragment>

    )
}