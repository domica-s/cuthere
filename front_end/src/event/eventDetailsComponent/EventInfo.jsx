// This code is the front-end functionality and implementation a specific event detials page
// Programmer: Philip Tarrantino Limas
// The codes are rendered when the user opens a specific event
// Revised on 6/5/2022

import React, {useEffect, useState} from 'react'
import {Descriptions} from 'antd';
import AuthService from '../../services/auth.service';
import UpdateForm from './UpdateBox';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Card, Container, Button } from "react-bootstrap";
import './EventInfo.css'


function EventInfo(props) { 

    const [Event, setEvent] = useState({})
    const [comment,setComment] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const currentUser = AuthService.getCurrentUser();
    const isHost = Event.createdBy === currentUser._id
    const isEventDone = props.eventDone

    useEffect(() => {
        setEvent(props.detail)
    }, [props.detail])

    const joinEvent = () => {
          /*
      This function is called to register the user to the event in the back-end
      This function is called when the user clicks on the register event button in the specific event page
    */
        props.joinEvent(props.detail.eventID)
    }


    const unjoinEvent = () => {
                /*
      This function is called to unregister the user from the event in the back-end
      This function is called when the user clicks on the unregister event button in the specific event page
    */
        props.unjoinEvent(props.detail.eventID)
    }


    const deleteEvent = () => {
          /*
      This function is called to delete the specific event in the back-end 
      This function is called when the user clicks on the delete event button in the specific event page
    */
        props.deleteEvent(props.detail.eventID)
    }

    const updateEvent = (content) => {
          /*
      This function is called to update specific elements of an  event in the back-end
      Requirements (parameters): Content is the updated data to be changed in the back-end
      This function is called when the user clicks on the update button on a specific element in the specific event page
    */
        const updatedContent = JSON.parse(content)
        props.updateEvent(props.detail.eventID, updatedContent)
    }
    
    const addToFav = () => {
                /*
      This function is called to add the specific event to the user's favorite event
      This function is called when the user clicks on the favorite event button on a specific event page
    */
        props.addToFav(props.detail.eventID)
    }

    const unaddToFav = () => {
          /*
      This function is called to remove the specific event from the user's favorite event
      This function is called when the user clicks on the un-favorite event button on a specific event page
    */
        props.unaddToFav(props.detail.eventID)
    }

    const startString = String(Event.start);
    const endString = String (Event.end);
    const startDate = startString.slice(0,10);
    const endDate =endString.slice(0,10);
    const startTime = startString.slice(11,16);
    const endTime = endString.slice(11,16);

  return (
    <React.Fragment>
        <div> 
            {isEventDone 
            ? 
            <p> Sorry! This Event is Finished! </p>
            :
            isHost?
                // View for Host
                <React.Fragment>
                 <Container> 
                 <div className='row'>
                 <div className="col-lg-4">
					<div className="card mt-3">
						<div className="card-body">
							
							<ul className="list-group list-group-flush">
								<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 302 302"><path id="Imported Path" fill="black" fillOpacity="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M 242.21,82.23 C 239.59,78.71 239.62,73.99 242.28,70.79 256.48,53.83 271.09,39.92 284.88,28.82 297.03,19.04 281.18,11.91 277.63,10.41 205.28,-20.05 132.99,43.70 60.68,24.29 60.68,24.29 60.68,174.76 60.68,174.76 133.10,194.18 205.52,130.16 277.93,161.02 281.47,162.51 284.69,162.14 286.25,159.80 287.81,157.47 287.42,153.46 285.25,149.53 270.91,123.60 256.56,101.63 242.21,82.23 Z M 42.65,15.02 C 42.65,6.72 35.93,0.00 27.63,0.00 19.34,0.00 12.61,6.72 12.61,15.02 12.61,15.02 12.61,286.98 12.61,286.98 12.61,295.28 19.34,302.00 27.63,302.00 35.93,302.00 42.65,295.28 42.65,286.98 42.65,286.98 42.65,168.10 42.65,168.10 42.65,168.10 42.65,168.10 42.66,168.10 42.66,168.10 42.65,15.02 42.65,15.02 Z" /></svg> Status</h6>
									<span className="text-secondary">{Event.status || ""}</span>
								</li>
								
								<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 24 24"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d="M 7.20,12.00 C 9.52,12.00 11.40,10.12 11.40,7.80 11.40,5.48 9.52,3.60 7.20,3.60 4.88,3.60 3.00,5.48 3.00,7.80 3.00,10.12 4.88,12.00 7.20,12.00 Z M 10.08,13.20 C 10.08,13.20 9.77,13.20 9.77,13.20 8.99,13.57 8.12,13.80 7.20,13.80 6.28,13.80 5.42,13.57 4.63,13.20 4.63,13.20 4.32,13.20 4.32,13.20 1.94,13.20 0.00,15.14 0.00,17.52 0.00,17.52 0.00,18.60 0.00,18.60 0.00,19.59 0.81,20.40 1.80,20.40 1.80,20.40 12.60,20.40 12.60,20.40 13.59,20.40 14.40,19.59 14.40,18.60 14.40,18.60 14.40,17.52 14.40,17.52 14.40,15.13 12.46,13.20 10.08,13.20 Z M 18.00,12.00 C 19.99,12.00 21.60,10.39 21.60,8.40 21.60,6.41 19.99,4.80 18.00,4.80 16.01,4.80 14.40,6.41 14.40,8.40 14.40,10.39 16.01,12.00 18.00,12.00 Z M 19.80,13.20 C 19.80,13.20 19.66,13.20 19.66,13.20 19.14,13.38 18.59,13.50 18.00,13.50 17.42,13.50 16.86,13.38 16.34,13.20 16.34,13.20 16.20,13.20 16.20,13.20 15.44,13.20 14.73,13.42 14.11,13.78 15.03,14.76 15.60,16.07 15.60,17.52 15.60,17.52 15.60,18.96 15.60,18.96 15.60,19.04 15.58,19.12 15.58,19.20 15.58,19.20 22.20,19.20 22.20,19.20 23.19,19.20 24.00,18.39 24.00,17.40 24.00,15.08 22.12,13.20 19.80,13.20 19.80,13.20 19.80,13.20 19.80,13.20 Z" /></svg> Participants</h6>
									<span className="text-secondary">{Event.numberOfParticipants || ""} of {Event.quota || ""}</span>
								</li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 24 24"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                    d="M 18.00,21.00
           C 18.55,21.00 19.00,20.55 19.00,20.00
             19.00,16.13 15.87,13.00 12.00,13.00
             8.13,13.00 5.00,16.13 5.00,20.00
             5.00,20.55 5.45,21.00 6.00,21.00
             6.00,21.00 18.00,21.00 18.00,21.00 Z
           M 12.00,11.00
           C 14.21,11.00 16.00,9.21 16.00,7.00
             16.00,4.79 14.21,3.00 12.00,3.00
             9.79,3.00 8.00,4.79 8.00,7.00
             8.00,9.21 9.79,11.00 12.00,11.00
             12.00,11.00 12.00,11.00 12.00,11.00 Z
           M 24.00,0.00
           C 24.00,0.00 24.00,24.00 24.00,24.00
             24.00,24.00 0.00,24.00 0.00,24.00
             0.00,24.00 0.00,0.00 0.00,0.00
             0.00,0.00 24.00,0.00 24.00,0.00 Z" /></svg> Host</h6>
									<span className="text-secondary">{Event.createdBy || ""}</span>
                                    </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 28 28"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d="M 26.09,2.91
           C 26.09,2.91 20.62,2.91 20.62,2.91
             20.62,2.91 20.62,1.51 20.62,1.51
             20.62,0.67 19.95,0.00 19.11,0.00
             18.28,0.00 17.61,0.67 17.61,1.51
             17.61,1.51 17.61,2.91 17.61,2.91
             17.61,2.91 10.39,2.91 10.39,2.91
             10.39,2.91 10.39,1.51 10.39,1.51
             10.39,0.67 9.72,0.00 8.89,0.00
             8.05,0.00 7.38,0.67 7.38,1.51
             7.38,1.51 7.38,2.91 7.38,2.91
             7.38,2.91 1.91,2.91 1.91,2.91
             1.08,2.91 0.41,3.58 0.41,4.41
             0.41,4.41 0.41,26.49 0.41,26.49
             0.41,27.33 1.08,28.00 1.91,28.00
             1.91,28.00 26.09,28.00 26.09,28.00
             26.92,28.00 27.59,27.33 27.59,26.49
             27.59,26.49 27.59,4.41 27.59,4.41
             27.59,3.58 26.92,2.91 26.09,2.91 Z
           M 3.42,24.99
           C 3.42,24.99 3.42,9.66 3.42,9.66
             3.42,9.66 24.58,9.66 24.58,9.66
             24.58,9.66 24.58,24.99 24.58,24.99
             24.58,24.99 3.42,24.99 3.42,24.99
             3.42,24.99 3.42,24.99 3.42,24.99 Z" /></svg> Date</h6>
									<span className="text-secondary">{startDate || ""} ~ {endDate || ""}</span>
								</li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 466 466"><path id="Imported Path" fill="black" fillOpacity="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M 233.00,0.00
           C 104.22,0.00 0.00,104.21 0.00,233.00
             0.00,361.78 104.21,466.00 233.00,466.00
             361.78,466.00 466.00,361.79 466.00,233.00
             466.00,104.22 361.79,0.00 233.00,0.00 Z
           M 244.48,242.65
           C 244.48,242.65 180.97,318.16 180.97,318.16
             175.64,324.50 166.17,325.32 159.83,319.99
             153.49,314.66 152.68,305.19 158.01,298.85
             158.01,298.85 218.00,227.53 218.00,227.53
             218.00,227.53 218.00,58.03 218.00,58.03
             218.00,49.74 224.72,43.03 233.00,43.03
             241.28,43.03 248.00,49.74 248.00,58.03
             248.00,58.03 248.00,233.00 248.00,233.00
             248.00,233.00 248.00,233.00 248.00,233.00
             248.00,236.53 246.75,239.95 244.48,242.65 Z" /></svg> Time</h6>
									<span className="text-secondary">{startTime || ""} - {endTime || ""}</span>
								</li>

                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 264 264"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                    d="M 161.80,249.00
           C 161.80,249.00 102.20,249.00 102.20,249.00
             98.06,249.00 94.70,252.36 94.70,256.50
             94.70,260.64 98.06,264.00 102.20,264.00
             102.20,264.00 161.80,264.00 161.80,264.00
             165.94,264.00 169.30,260.64 169.30,256.50
             169.30,252.36 165.94,249.00 161.80,249.00 Z
           M 132.00,0.00
           C 89.34,0.00 54.64,34.70 54.64,77.36
             54.64,88.99 57.16,100.17 62.13,110.60
             62.23,110.82 62.33,111.04 62.44,111.26
             62.44,111.26 120.89,224.43 120.89,224.43
             123.04,228.58 127.32,231.19 132.00,231.19
             136.67,231.19 140.96,228.59 143.10,224.43
             143.10,224.43 201.54,111.29 201.54,111.29
             201.64,111.10 201.73,110.90 201.82,110.70
             206.82,100.25 209.36,89.03 209.36,77.36
             209.36,34.70 174.66,0.00 132.00,0.00 Z
           M 132.00,117.85
           C 109.67,117.85 91.51,99.69 91.51,77.36
             91.51,55.03 109.67,36.87 132.00,36.87
             154.33,36.87 172.49,55.03 172.49,77.36
             172.49,99.69 154.33,117.85 132.00,117.85 Z" /></svg> Location</h6>
									<span className="text-secondary">{Event.venue || ""}</span>
                                    
								</li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 24 24"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                    d="M 4.00,11.00
           C 4.00,11.00 10.00,11.00 10.00,11.00
             10.55,11.00 11.00,10.55 11.00,10.00
             11.00,10.00 11.00,4.00 11.00,4.00
             11.00,3.45 10.55,3.00 10.00,3.00
             10.00,3.00 4.00,3.00 4.00,3.00
             3.45,3.00 3.00,3.45 3.00,4.00
             3.00,4.00 3.00,10.00 3.00,10.00
             3.00,10.55 3.45,11.00 4.00,11.00
             4.00,11.00 4.00,11.00 4.00,11.00 Z
           M 14.00,11.00
           C 14.00,11.00 20.00,11.00 20.00,11.00
             20.55,11.00 21.00,10.55 21.00,10.00
             21.00,10.00 21.00,4.00 21.00,4.00
             21.00,3.45 20.55,3.00 20.00,3.00
             20.00,3.00 14.00,3.00 14.00,3.00
             13.45,3.00 13.00,3.45 13.00,4.00
             13.00,4.00 13.00,10.00 13.00,10.00
             13.00,10.55 13.45,11.00 14.00,11.00
             14.00,11.00 14.00,11.00 14.00,11.00 Z
           M 4.00,21.00
           C 4.00,21.00 10.00,21.00 10.00,21.00
             10.55,21.00 11.00,20.55 11.00,20.00
             11.00,20.00 11.00,14.00 11.00,14.00
             11.00,13.45 10.55,13.00 10.00,13.00
             10.00,13.00 4.00,13.00 4.00,13.00
             3.45,13.00 3.00,13.45 3.00,14.00
             3.00,14.00 3.00,20.00 3.00,20.00
             3.00,20.55 3.45,21.00 4.00,21.00
             4.00,21.00 4.00,21.00 4.00,21.00 Z
           M 17.00,21.00
           C 19.21,21.00 21.00,19.21 21.00,17.00
             21.00,14.79 19.21,13.00 17.00,13.00
             14.79,13.00 13.00,14.79 13.00,17.00
             13.00,19.21 14.79,21.00 17.00,21.00 Z" /></svg> Category</h6>
									<span className="text-secondary">{Event.activityCategory || ""}</span>
                                    </li>
							</ul>
						</div>
					</div>
				</div>
                <div className="col-lg-8">
					<div className="card mt-3">
						<div className="card-body">
            <Row>
              <Col>
                        <UpdateForm type={"number"} label={"quota"} value={Event.quota} updateEvent={updateEvent}/>
                        <UpdateForm type={"text"} label={"venue"} value={Event.venue} updateEvent={updateEvent}/>
                        <UpdateForm type={"text"} label={"activityCategory"} value={Event.activityCategory} updateEvent={updateEvent}/>
              </Col>
              <Col>
              <UpdateForm type={"date"} label={"start"} value={Event.start} updateEvent={updateEvent}/>    
                        <UpdateForm type={"date"} label={"end"} value={Event.end} updateEvent={updateEvent}/>
                        
                        </Col>
            </Row>            
						</div>
					</div>
				</div>	


                </div>

                    </Container>

                    <div style = {{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Button size="large" shape="round" type="danger" onClick={joinEvent} className="button-margin">
                            Join Event
                        </Button>

                        <Button size="large" shape="round" type="danger" onClick={unjoinEvent} className="button-margin">
                            Unregister
                        </Button>

                        <Button size="large" shape="round" type="success" className="button-margin" onClick={addToFav}>
                            Add to favorites
                    </Button>
                        
                    <Button size="large" shape="round" type="success" onClick={unaddToFav} className="button-margin">
                        Remove from favorites
                    </Button>

                        {isHost? <Button size="large" shape="round" type="danger" className="button-margin" onClick={deleteEvent} isHost>
                            Delete Event
                        </Button>:(null)}
                    </div>
                    <hr />
                    

                </React.Fragment>
                :
                // For other users 
                <React.Fragment>
                <Container> 
                    
                    <div className="col-lg-12">
					<div className="card mt-3">
						<div className="card-body">
							
							<ul className="list-group list-group-flush">
								<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 302 302"><path id="Imported Path" fill="black" fillOpacity="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M 242.21,82.23 C 239.59,78.71 239.62,73.99 242.28,70.79 256.48,53.83 271.09,39.92 284.88,28.82 297.03,19.04 281.18,11.91 277.63,10.41 205.28,-20.05 132.99,43.70 60.68,24.29 60.68,24.29 60.68,174.76 60.68,174.76 133.10,194.18 205.52,130.16 277.93,161.02 281.47,162.51 284.69,162.14 286.25,159.80 287.81,157.47 287.42,153.46 285.25,149.53 270.91,123.60 256.56,101.63 242.21,82.23 Z M 42.65,15.02 C 42.65,6.72 35.93,0.00 27.63,0.00 19.34,0.00 12.61,6.72 12.61,15.02 12.61,15.02 12.61,286.98 12.61,286.98 12.61,295.28 19.34,302.00 27.63,302.00 35.93,302.00 42.65,295.28 42.65,286.98 42.65,286.98 42.65,168.10 42.65,168.10 42.65,168.10 42.65,168.10 42.66,168.10 42.66,168.10 42.65,15.02 42.65,15.02 Z" /></svg> Status</h6>
									<span className="text-secondary">{Event.status || ""}</span>
								</li>
								
								<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 24 24"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d="M 7.20,12.00 C 9.52,12.00 11.40,10.12 11.40,7.80 11.40,5.48 9.52,3.60 7.20,3.60 4.88,3.60 3.00,5.48 3.00,7.80 3.00,10.12 4.88,12.00 7.20,12.00 Z M 10.08,13.20 C 10.08,13.20 9.77,13.20 9.77,13.20 8.99,13.57 8.12,13.80 7.20,13.80 6.28,13.80 5.42,13.57 4.63,13.20 4.63,13.20 4.32,13.20 4.32,13.20 1.94,13.20 0.00,15.14 0.00,17.52 0.00,17.52 0.00,18.60 0.00,18.60 0.00,19.59 0.81,20.40 1.80,20.40 1.80,20.40 12.60,20.40 12.60,20.40 13.59,20.40 14.40,19.59 14.40,18.60 14.40,18.60 14.40,17.52 14.40,17.52 14.40,15.13 12.46,13.20 10.08,13.20 Z M 18.00,12.00 C 19.99,12.00 21.60,10.39 21.60,8.40 21.60,6.41 19.99,4.80 18.00,4.80 16.01,4.80 14.40,6.41 14.40,8.40 14.40,10.39 16.01,12.00 18.00,12.00 Z M 19.80,13.20 C 19.80,13.20 19.66,13.20 19.66,13.20 19.14,13.38 18.59,13.50 18.00,13.50 17.42,13.50 16.86,13.38 16.34,13.20 16.34,13.20 16.20,13.20 16.20,13.20 15.44,13.20 14.73,13.42 14.11,13.78 15.03,14.76 15.60,16.07 15.60,17.52 15.60,17.52 15.60,18.96 15.60,18.96 15.60,19.04 15.58,19.12 15.58,19.20 15.58,19.20 22.20,19.20 22.20,19.20 23.19,19.20 24.00,18.39 24.00,17.40 24.00,15.08 22.12,13.20 19.80,13.20 19.80,13.20 19.80,13.20 19.80,13.20 Z" /></svg> Participants</h6>
									<span className="text-secondary">{Event.numberOfParticipants || ""} of {Event.quota || ""}</span>
								</li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 24 24"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                    d="M 18.00,21.00
           C 18.55,21.00 19.00,20.55 19.00,20.00
             19.00,16.13 15.87,13.00 12.00,13.00
             8.13,13.00 5.00,16.13 5.00,20.00
             5.00,20.55 5.45,21.00 6.00,21.00
             6.00,21.00 18.00,21.00 18.00,21.00 Z
           M 12.00,11.00
           C 14.21,11.00 16.00,9.21 16.00,7.00
             16.00,4.79 14.21,3.00 12.00,3.00
             9.79,3.00 8.00,4.79 8.00,7.00
             8.00,9.21 9.79,11.00 12.00,11.00
             12.00,11.00 12.00,11.00 12.00,11.00 Z
           M 24.00,0.00
           C 24.00,0.00 24.00,24.00 24.00,24.00
             24.00,24.00 0.00,24.00 0.00,24.00
             0.00,24.00 0.00,0.00 0.00,0.00
             0.00,0.00 24.00,0.00 24.00,0.00 Z" /></svg> Host</h6>
									<span className="text-secondary">{Event.createdBy || ""}</span>
                                    </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 28 28"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d="M 26.09,2.91
           C 26.09,2.91 20.62,2.91 20.62,2.91
             20.62,2.91 20.62,1.51 20.62,1.51
             20.62,0.67 19.95,0.00 19.11,0.00
             18.28,0.00 17.61,0.67 17.61,1.51
             17.61,1.51 17.61,2.91 17.61,2.91
             17.61,2.91 10.39,2.91 10.39,2.91
             10.39,2.91 10.39,1.51 10.39,1.51
             10.39,0.67 9.72,0.00 8.89,0.00
             8.05,0.00 7.38,0.67 7.38,1.51
             7.38,1.51 7.38,2.91 7.38,2.91
             7.38,2.91 1.91,2.91 1.91,2.91
             1.08,2.91 0.41,3.58 0.41,4.41
             0.41,4.41 0.41,26.49 0.41,26.49
             0.41,27.33 1.08,28.00 1.91,28.00
             1.91,28.00 26.09,28.00 26.09,28.00
             26.92,28.00 27.59,27.33 27.59,26.49
             27.59,26.49 27.59,4.41 27.59,4.41
             27.59,3.58 26.92,2.91 26.09,2.91 Z
           M 3.42,24.99
           C 3.42,24.99 3.42,9.66 3.42,9.66
             3.42,9.66 24.58,9.66 24.58,9.66
             24.58,9.66 24.58,24.99 24.58,24.99
             24.58,24.99 3.42,24.99 3.42,24.99
             3.42,24.99 3.42,24.99 3.42,24.99 Z" /></svg> Date</h6>
									<span className="text-secondary">{startDate || ""} ~ {endDate || ""}</span>
								</li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 466 466"><path id="Imported Path" fill="black" fillOpacity="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M 233.00,0.00
           C 104.22,0.00 0.00,104.21 0.00,233.00
             0.00,361.78 104.21,466.00 233.00,466.00
             361.78,466.00 466.00,361.79 466.00,233.00
             466.00,104.22 361.79,0.00 233.00,0.00 Z
           M 244.48,242.65
           C 244.48,242.65 180.97,318.16 180.97,318.16
             175.64,324.50 166.17,325.32 159.83,319.99
             153.49,314.66 152.68,305.19 158.01,298.85
             158.01,298.85 218.00,227.53 218.00,227.53
             218.00,227.53 218.00,58.03 218.00,58.03
             218.00,49.74 224.72,43.03 233.00,43.03
             241.28,43.03 248.00,49.74 248.00,58.03
             248.00,58.03 248.00,233.00 248.00,233.00
             248.00,233.00 248.00,233.00 248.00,233.00
             248.00,236.53 246.75,239.95 244.48,242.65 Z" /></svg> Time</h6>
									<span className="text-secondary">{startTime || ""} - {endTime || ""}</span>
								</li>

                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 264 264"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                    d="M 161.80,249.00
           C 161.80,249.00 102.20,249.00 102.20,249.00
             98.06,249.00 94.70,252.36 94.70,256.50
             94.70,260.64 98.06,264.00 102.20,264.00
             102.20,264.00 161.80,264.00 161.80,264.00
             165.94,264.00 169.30,260.64 169.30,256.50
             169.30,252.36 165.94,249.00 161.80,249.00 Z
           M 132.00,0.00
           C 89.34,0.00 54.64,34.70 54.64,77.36
             54.64,88.99 57.16,100.17 62.13,110.60
             62.23,110.82 62.33,111.04 62.44,111.26
             62.44,111.26 120.89,224.43 120.89,224.43
             123.04,228.58 127.32,231.19 132.00,231.19
             136.67,231.19 140.96,228.59 143.10,224.43
             143.10,224.43 201.54,111.29 201.54,111.29
             201.64,111.10 201.73,110.90 201.82,110.70
             206.82,100.25 209.36,89.03 209.36,77.36
             209.36,34.70 174.66,0.00 132.00,0.00 Z
           M 132.00,117.85
           C 109.67,117.85 91.51,99.69 91.51,77.36
             91.51,55.03 109.67,36.87 132.00,36.87
             154.33,36.87 172.49,55.03 172.49,77.36
             172.49,99.69 154.33,117.85 132.00,117.85 Z" /></svg> Location</h6>
									<span className="text-secondary">{Event.venue || ""}</span>
                                    
								</li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 24 24"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                    d="M 4.00,11.00
           C 4.00,11.00 10.00,11.00 10.00,11.00
             10.55,11.00 11.00,10.55 11.00,10.00
             11.00,10.00 11.00,4.00 11.00,4.00
             11.00,3.45 10.55,3.00 10.00,3.00
             10.00,3.00 4.00,3.00 4.00,3.00
             3.45,3.00 3.00,3.45 3.00,4.00
             3.00,4.00 3.00,10.00 3.00,10.00
             3.00,10.55 3.45,11.00 4.00,11.00
             4.00,11.00 4.00,11.00 4.00,11.00 Z
           M 14.00,11.00
           C 14.00,11.00 20.00,11.00 20.00,11.00
             20.55,11.00 21.00,10.55 21.00,10.00
             21.00,10.00 21.00,4.00 21.00,4.00
             21.00,3.45 20.55,3.00 20.00,3.00
             20.00,3.00 14.00,3.00 14.00,3.00
             13.45,3.00 13.00,3.45 13.00,4.00
             13.00,4.00 13.00,10.00 13.00,10.00
             13.00,10.55 13.45,11.00 14.00,11.00
             14.00,11.00 14.00,11.00 14.00,11.00 Z
           M 4.00,21.00
           C 4.00,21.00 10.00,21.00 10.00,21.00
             10.55,21.00 11.00,20.55 11.00,20.00
             11.00,20.00 11.00,14.00 11.00,14.00
             11.00,13.45 10.55,13.00 10.00,13.00
             10.00,13.00 4.00,13.00 4.00,13.00
             3.45,13.00 3.00,13.45 3.00,14.00
             3.00,14.00 3.00,20.00 3.00,20.00
             3.00,20.55 3.45,21.00 4.00,21.00
             4.00,21.00 4.00,21.00 4.00,21.00 Z
           M 17.00,21.00
           C 19.21,21.00 21.00,19.21 21.00,17.00
             21.00,14.79 19.21,13.00 17.00,13.00
             14.79,13.00 13.00,14.79 13.00,17.00
             13.00,19.21 14.79,21.00 17.00,21.00 Z" /></svg> Category</h6>
									<span className="text-secondary">{Event.activityCategory || ""}</span>
                                    </li>
							</ul>
						</div>
					</div>
				</div>
                    
                    
                    
                   </Container>
                   
                    <div style = {{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Button size="large" shape="round" type="danger" onClick={joinEvent} className="button-margin">
                            Join Event
                        </Button>

                        <Button size="large" shape="round" type="danger" onClick={unjoinEvent} className="button-margin">
                            Unregister
                        </Button>

                        <Button size="large" shape="round" type="success" className="button-margin" onClick={addToFav}>
                            Add to favorites
                    </Button>
                        
                    <Button size="large" shape="round" type="success" onClick={unaddToFav} className="button-margin">
                        Remove from favorites
                    </Button>

                        {isHost? <Button size="large" shape="round" type="danger" className="button-margin" onClick={deleteEvent} isHost>
                            Delete Event
                        </Button>:(null)}
                    </div>
                    <hr />

                    
               </React.Fragment>
            }

        </div>


    </React.Fragment>
  )
}

export default EventInfo