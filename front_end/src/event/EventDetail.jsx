import React, { useEffect, useState } from 'react'
import Axios from 'axios' 
import { Row, Col } from 'antd';
import { useDispatch } from 'react-redux';

// import smaller components related to the events 
import EventImage from './eventDetailsComponent/EventImage'
import EventInfo from './eventDetailsComponent/EventInfo'


export default function () { 

    const [Event, setEvent] = useState([])
    const dispatch = useDispatch(); 
    
    // Add EventId through Params 
    const productId = props.match.params.productId 

    // Axios get the following event by event ID 
    // Link is somewhat like this --> `/api/product/products_by_id?id=${productId}&type=single` 
    useEffect(() => {
        Axios.get('http://localhost:8080/event').then(response => { 
            setEvent(response.data[0])
        })
    })

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
                            detail = {Product}/>
                    </Col>
                    
                </Row>
            </div>


        </React.Fragment>

    )








}