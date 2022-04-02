import React, {useEffect, useState} from 'react'
import {Button, Descriptions} from 'antd';

function EventInfo(props) { 

    const [Event, setEvent] = useState({})
    const [comment,setComment] = useState('')
    const [modalOpen, setModalOpen] = useState(false)

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
    
    // Function to add comment
    const addComment = () => {
        props.addComment(props.detail.eventID, comment)
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
                <Button size="large" shape="round" type="danger" onClick={deleteEvent}>
                    Delete Event
                </Button>

                <Button size="large" shape="round" type="danger" onClick={() => setModalOpen(true)}>Update Event</Button>
            </div>

        </div>


    </React.Fragment>
  )
}

export default EventInfo