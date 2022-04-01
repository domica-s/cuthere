import React, { useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import Axios from 'axios' 
import { Row, Col } from 'antd';
import AuthService from "../services/auth.service";
import history from "../history";

// import smaller components related to the events 
import EventImage from './eventDetailsComponent/EventImage'
import EventInfo from './eventDetailsComponent/EventInfo'


export default function (props) { 

    // WORKSTREAM / STATUS:
    // --> DONE: Functions 
    // --> To be fixed: Authorization using AuthJWT + Can't read properties of content-type (HTTP headers)
    // --> To do: Fix UI
    const [Event, setEvent] = useState([])
    const location = useLocation();

    const currentUser = AuthService.getCurrentUser();
    
    const config = { // Figure out how to address the TypeError: Can't read properties of undefined / not allowed to access function with VerifyJWT
        headers: new Headers({
            "x-access-token": currentUser.accessToken,
            "content-type": 'application/json'
        })
    }

    // STATUS: HOW TO GET THE :id from the params?
    const eventId = location.pathname.split('/event/')[1]

    // STATUS: WORKING
    useEffect(() => {
        Axios.get(`http://localhost:8080/api/calendar/route-event/${eventId}`).then(response => { 
        console.log(response.data)    
        setEvent(response.data)
            
        })
    }, [location])


    async function joinTheEvent(eventID){
        let body = {
            _id: currentUser

        }
        const request = await Axios.post(`http://localhost:8080/event/register/${eventID}`,body, config.headers)
        // Finish this --> Return the payload
        console.log(request)
    }

    async function unregister(eventID){
        let body = { 
            _id: currentUser
        }
        const request = await Axios.post(`http://localhost:8080/event/delete/${eventID}`, body, config.headers)
        // Finish this --> Return request? 
        console.log(request)
    }

    async function deleteEvent(eventID){
        let body = { 
            _id: currentUser
        }
        const request = await Axios.get(`http://localhost:8080/event/delete/${eventID}`, body, config.headers)
        
        // Reroute to main page
        
        history.push({
            state: request,
            pathname: '/event',
        });
        history.go();
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
                        <EventImage detail ={Event} />
                    </Col> 

                    <Col lg={12} xs={24}>
                    <EventInfo 
                        unjoinEvent = {unregister}
                        joinEvent = {joinTheEvent}
                        deleteEvent = {deleteEvent}
                        detail = {Event}/>
                    </Col>
                    
                </Row>
            </div>
        </React.Fragment>

    )








}