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
        await axios.post("http://localhost:8080/api/calendar/create-event", data.event, config);
    }


    async function handleDatesSet(data, yourCalendar = false, sid = 0){

        // To get all the events to the calendar --> WORKING
        if (!yourCalendar){
        const response = await axios.get('http://localhost:8080/api/calendar/get-event?start='+moment(data.start).toISOString() +'&end='+moment(data.end).toISOString())
        setEvents(response.data)
        }

        // To get only your events to the calendar --> WORKING
        else {
        const response = await axios.post("http://localhost:8080/api/calendar/my-event?start="+moment(data.start).toISOString()+'&end='+moment(data.end).toISOString(),{createdBy: currentUser._id},config)
        setEvents(response.data)
        }
        
    }


    // To route to a specific event detail page --> WORKING

    async function handleEventClick(event){

        const id = event.event._def.extendedProps.eventID
        const response = await axios.get("http://localhost:8080/api/calendar/route-event/"+id);

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
                                handleDatesSet(calendarApi.currentDataManager.data.dateProfile.currentRange, true, 0)

                            }
                        },
                        allEventButton: {   
                            text: 'All Events',
                            click:() => {
                                setYourCalendar(false)
                                const calendarApi = calendarRef.current.getApi()
                                handleDatesSet(calendarApi.currentDataManager.data.dateProfile.currentRange, false)
                            }
                        }
                    }}
                    headerToolbar = {{
                        right: 'prev,next today',
                        left:'title',
                        center:'yourEventButton allEventButton'

                    }}
                    datesSet= {(date) => handleDatesSet(date)}
                    
                    
                />
            </div>
            

            <AddEventModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onEventAdded ={event => onEventAdded(event)} />
        </React.Fragment>

    )
}