import React, {useState, useRef} from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import AddEventModal from './AddEventModal';
import axios from 'axios';
import moment from 'moment';
import "react-datetime/css/react-datetime.css";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";

export default function () {
    const [modalOpen, setModalOpen] = useState(false)
    const [events, setEvents] = useState([])
    const calendarRef = useRef(null)

    const onEventAdded = (event) => {
        let calendarApi = calendarRef.current.getApi() 
        console.log(event.venue, event.quota, event.activityCategory)
        calendarApi.addEvent({
            start: moment(event.start).toDate(),
            end: moment(event.end).toDate(),
            venue: event.venue,
            title: event.title,
            quota: event.quota,
            activityCategory: event.activityCategory
        });

    }
    
    async function handleEventAdd(data){
        await axios.post("http://localhost:8080/api/calendar/create-event", data.event);
    }

    async function handleDatesSet(data){
        const response = await axios.get('http://localhost:8080/api/calendar/get-event?start='+moment(data.start).toISOString() +'&end='+moment(data.end).toISOString())
        setEvents(response.data)
    }

    async function handleEventClick(data){

        // Route to the corresponding event page
        const response = await axios.get("http.//localhost:8080/api/calendar/myevents", data.event);


    }

    console.log(events)


    return(
        <React.Fragment> 
            <Container>
                <Col> 
                    <Button className="mb-3 m-2" variant="outline-warning" onClick ={() => setModalOpen(true)}> Add Event </Button>
                </Col>

                <Row> 
                    <p> Labels for filtering here </p>
                </Row>
            </Container>

            <div style ={{position: "relative", zIndex: 0}}>
                <FullCalendar 
                    ref ={calendarRef}
                    events = {events}
                    plugins = {[dayGridPlugin]}
                    initialView = "dayGridMonth"
                    eventClick = {(event) => handleEventClick(event)}
                    eventAdd = {(event) => handleEventAdd(event)}
                    datesSet= {(date) => handleDatesSet(date)}
                />
            </div>
            

            <AddEventModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onEventAdded ={event => onEventAdded(event)} />
        </React.Fragment>

    )
}