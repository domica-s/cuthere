import React, {useEffect, useState} from 'react'
import {Button, Descriptions} from 'antd';
import AuthService from '../../services/auth.service';
import UpdateForm from './UpdateBox';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";


function EventInfo(props) { 

    const [Event, setEvent] = useState({})
    const [comment,setComment] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const currentUser = AuthService.getCurrentUser();
    const isHost = Event.createdBy === currentUser._id

    useEffect(() => {
        setEvent(props.detail)
    }, [props.detail])


    // function to join the event
    const joinEvent = () => {
        props.joinEvent(props.detail.eventID)
    }

    // function to unregisger from event
    const unjoinEvent = () => {
        props.unjoinEvent(props.detail.eventID)
    }

    // Function to delete the event
    const deleteEvent = () => {
        props.deleteEvent(props.detail.eventID)
    }

    const updateEvent = (content) => {
        const updatedContent = JSON.parse(content)
        // Add moment to dates

        // Send to backend
        props.updateEvent(props.detail.eventID, updatedContent)
    }
  return (
    <React.Fragment>
        <div> 
            {isHost?
            // View for Host
            <React.Fragment>
             <Container> 
                    <Row> <Col><p>Event Status: {Event.status}</p></Col></Row>
                    <Row> <Col><p>Event ID: {Event.eventID}</p></Col></Row>
                    <Row><Col><p># of Participants: {Event.numberOfParticipants}</p></Col></Row>
                    <Row>
                        <Col>
                            <p>Location: {Event.venue}</p>
                        </Col>

                        <Col>
                            <UpdateForm type={"text"} label={"venue"} value={Event.venue} updateEvent={updateEvent}/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <p>Max Participants for this event: {Event.quota}</p>
                        </Col>
                        <Col>
                            <UpdateForm type={"number"} label={"quota"} value={Event.quota} updateEvent={updateEvent}/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <p>Event Category: {Event.activityCategory}</p>
                        </Col>

                        <Col>
                            <UpdateForm type={"text"} label={"activityCategory"} value={Event.activityCategory} updateEvent={updateEvent}/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <p>Starting Date: {Event.start}</p>
                        </Col>
                        <Col>
                            <UpdateForm type={"date"} label={"start"} value={Event.start} updateEvent={updateEvent}/>    
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <p>Ending Date: {Event.end}</p>
                        </Col>

                        <Col>
                            <UpdateForm type={"date"} label={"end"} value={Event.end} updateEvent={updateEvent}/>
                        </Col>
                    </Row>

                    <Row><Col><p>The host of this event is: {Event.createdBy}</p></Col></Row>
                    <Row><Col><p>The list of participants for this event is: {Event.participants}</p></Col></Row>
                </Container>
            </React.Fragment>
            :
            // For other users 
            <React.Fragment>
            <Container> 
                   <Row> <Col><p>Event Status: {Event.status}</p></Col></Row>
                   <Row> <Col><p>Event ID: {Event.eventID}</p></Col></Row>
                   <Row><Col><p># of Participants: {Event.numberOfParticipants}</p></Col></Row>
                   <Row> <Col> <p>Location: {Event.venue}</p> </Col></Row>
                   <Row><Col><p>Max Participants for this event: {Event.quota}</p></Col></Row>
                   <Row><Col><p>Event Category: {Event.activityCategory}</p></Col></Row>
                   <Row><Col><p>Starting Date: {Event.start}</p></Col></Row>
                   <Row><Col><p>Ending Date: {Event.end}</p></Col></Row>
                   <Row><Col><p>The host of this event is: {Event.createdBy}</p></Col></Row>
                   <Row><Col><p>The list of participants for this event is: {Event.participants}</p></Col></Row>
               </Container>
           </React.Fragment>
            }
            <br/>
            <br/>
            <br/>
            <div style = {{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Button size="large" shape="round" type="danger" onClick={joinEvent}>
                    Join Event
                </Button>

                <Button size="large" shape="round" type="danger" onClick={unjoinEvent}>
                    Unregister
                </Button>
            </div>
            <br/>
            <br/>
            <br/>
            <div style = {{
                display: 'flex',
                justifyContent: 'center'
            }}>
                {isHost? <Button size="large" shape="round" type="danger" onClick={deleteEvent} isHost>
                    Delete Event
                </Button>:(null)}
            </div>

        </div>


    </React.Fragment>
  )
}

export default EventInfo