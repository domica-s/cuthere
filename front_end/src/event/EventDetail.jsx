import React, { useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import Axios from 'axios' 
import { Row, Col } from 'antd';


// import smaller components related to the events 
import EventImage from './eventDetailsComponent/EventImage'
import EventInfo from './eventDetailsComponent/EventInfo'


export default function (props) { 

    const [Event, setEvent] = useState([])
    const location = useLocation();

    // STATUS: HOW TO GET THE :id from the params?
    const eventId = location.pathname.split('/event/')[1]

    // STATUS: WORKING
    useEffect(() => {
        Axios.get(`http://localhost:8080/api/calendar/route-event/${eventId}`).then(response => { 
            setEvent(response.data)
            
        })
    }, [location])

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

                <br /> 

                <Row gutter = {[16,16]}>

                    <Col lg={12} xs={24}>
                        <EventImage detail ={Event} />
                    </Col> 

                    <Col lg={12} xs={24}>
                        <EventInfo 
                            detail = {Event}/>
                    </Col>
                    
                </Row>
            </div>
        </React.Fragment>

    )








}