import React, {useState, useRef} from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import AddEventModal from './AddEventModal';
import axios from 'axios';
import moment from 'moment';
import "react-datetime/css/react-datetime.css";

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

    console.log(events)


    return(
        <section>
            <button onClick ={() => setModalOpen(true)}> Add Event </button>

            <div style ={{position: "relative", zIndex: 0}}>
                <FullCalendar 
                    ref ={calendarRef}
                    events = {events}
                    plugins = {[dayGridPlugin]}
                    initialView = "dayGridMonth"
                    eventAdd = {(event) => handleEventAdd(event)}
                    datesSet= {(date) => handleDatesSet(date)}
                />
            </div>
            

            <AddEventModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onEventAdded ={event => onEventAdded(event)} />
        </section>

    )
}