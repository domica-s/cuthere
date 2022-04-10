import React, {useState} from 'react'; 
import Modal from 'react-modal';
import Datetime from 'react-datetime';

import logo from '../images/logo.jfif';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";
// import FloatingLabel from 'react-bootstrap/FloatingLabel'

export default function ({isOpen, onClose, onEventAdded}) {
    const [title, setTitle] = useState();
    const [venue, setVenue] = useState();
    const [quota, setQuota] = useState();
    const [activityCategory, setCategory] = useState();
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());

    const onSubmit = (event) => {
        event.preventDefault();
      
        onEventAdded({
            title,
            venue,
            quota,
            activityCategory,
            start,
            end
        })
        onClose();
    }



    return (
        <Modal isOpen = {isOpen} onRequestClose ={onClose}>
            <Container>
                <Row className="justify-content-sm-center">
                <Col>
                    <img className="mt-4" src={logo} alt="" width="100px"/>
                </Col>
                </Row>
                <Row className="justify-content-center">
                <Form className="signin-form" onSubmit={onSubmit} method="post" encType="application/x-www-form-urlencoded; charset=UTF-8;application/json">

                    <Container>
                        <h2>Create Your Event</h2>
                    </Container>

                    <Col className="form-floating">
                        <Form.Group className="mb-3">
                            <Form.Label>Title of your event</Form.Label>
                            <Form.Control name="Event Title" type="text" placeholder="Event Title" required
                            value={title}
                            onChange={e => setTitle(e.target.value)}/>
                        </Form.Group>                               
                    </Col>

                    <Col className="form-floating">
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control name="Event Venue" type="text" placeholder="Event Location" required
                            value={venue}
                            onChange={e => setVenue(e.target.value)}/>
                        </Form.Group>                                 
                    </Col>

                    <Col className="form-floating">
                        <Form.Group className="mb-3">
                            <Form.Label>Quota</Form.Label>
                            <Form.Control name="quota" type="number" placeholder="Event Quota" required
                            value={quota}
                            onChange={e => setQuota(e.target.value)}/>
                        </Form.Group> 
                    </Col>             

                    <Col className="mb-3 form-floating">
                        <Form.Group className="mb-3">
                            <Form.Label>Category of your event</Form.Label>
                            <Form.Select required name="activityCategory" type="text" value = {activityCategory} onChange={e => setCategory(e.target.value)}>
                            <option value="">None</option>
                            <option value="Basketball">Basketball</option>
                            <option value="Badminton">Badminton</option>
                            <option value="Soccer">Soccer</option>
                            <option value="Football">Football</option>
                            <option value="Hiking">Hiking</option>
                            <option value="Volleyball">Volleyball</option>
                            <option value="Boardgame">Board Games</option>
                            <option value="Tennis">Tennis</option>
                            <option value="Running">Running</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Swimming">Swimming</option>
                            <option value="Drinking">Drinking</option>
                            <option value="Study">Study</option>
                            <option value="Movies">Movies</option>
                            <option value="FratParty">Frat Parties</option>
                            <option value="Athletics">Athletics</option>
                            <option value="Arts">Arts</option>
                            <option value="Cooking">Cooking</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>  

                    <Col className="mb-3 form-floating">
                        <Form.Group className="mb-3">
                            <Form.Label>Start Date</Form.Label>
                            <Datetime value ={start} onChange ={date => setStart(date)} />
                        </Form.Group>
                    </Col>

                    <Col className="mb-3 form-floating">
                        <Form.Group className="mb-3">
                            <Form.Label>End Date</Form.Label>
                            <Datetime value ={end} onChange ={date => setEnd(date)} required/>
                        </Form.Group>
                    </Col>
    
                    <Button className="mb-3 m-2" variant="outline-warning" type="submit">
                        Add Event
                    </Button>
                    
                </Form>
                </Row>
            </Container>

        </Modal>
    )
}