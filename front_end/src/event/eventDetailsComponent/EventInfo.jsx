import React, {useEffect, useState} from 'react'
import {Button, Descriptions} from 'amtd';

function EventInfo(props) {
    const [Event, setEvent] = useState({})

    useEffect(() => {
        setProduct(props.detail)
    }, [props.detail])

    // function to join the event
    const joinEvent = () => {
        
    }

  return (
    <React.Fragment>
        <div> 
            <Descriptions title="Event Information"> 
                <Descriptions.items label= "Status"> {Event.status} </Descriptions.items>
                <Descriptions.items label= "Event ID"> {Event.eventID} </Descriptions.items>
                <Descriptions.items label= "Number of Participants"> {Event.numberOfParticipants} </Descriptions.items>
                <Descriptions.items label= "Venue"> {Event.venue} </Descriptions.items>
                <Descriptions.items label= "Quota"> {Event.quota} </Descriptions.items>
                <Descriptions.items label= "Category"> {Event.activityCategory} </Descriptions.items>
                <Descriptions.items label= "Start Date"> {Event.start} </Descriptions.items>
                <Descriptions.items label= "End Date"> {Event.end} </Descriptions.items>
                <Descriptions.items label= "Chat History"> {Event.chatHistory} </Descriptions.items>
                <Descriptions.items label= "Host"> {Event.createdBy} </Descriptions.items>
                <Descriptions.items label= "List of Participants"> {Event.participants} </Descriptions.items>
            </Descriptions>
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
            </div>

        </div>

    </React.Fragment>
  )
}

export default EventInfo