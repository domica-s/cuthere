import React, { useEffect, useState } from 'react'
import Axios from 'axios' 
import { Row, Col } from 'antd';


// import smaller components related to the events 
import EventImage from './eventDetailsComponent/EventImage'
import EventInfo from './eventDetailsComponent/EventInfo'


export default function (props) { 

    const [Event, setEvent] = useState([])

    
    // Add EventId through Params --> To make the eventId not hardcode, how to pass the :id to props.
    console.log(props)
    const eventId = '623e14fae7ecc307f28f300d' // This one is still hardcoded, need to make this not hardcode

    // Axios get the following event by event ID 
    // Change use effect to normal function 
    useEffect(() => {
        Axios.get(`http://localhost:8080/api/calendar/get-event/${eventId}`).then(response => { 
            setEvent(response.data)
            
        })
    }, [])

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