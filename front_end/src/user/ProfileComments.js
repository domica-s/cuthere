// UNDER DEVELOPMENT

import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import authService from "../services/auth.service";
import './UserRating.css';

class ProfileComments extends React.Component {
    render() {
        const {commentValue, handleSetType, handleCommentValue, enterCommentLine, submitCommentLine, reviewHistory, reviewType} = this.props; 
    
        return(
            <React.Fragment>
            <Card>
                <Card.Header>Profile Comments</Card.Header>
            </Card>
             {reviewHistory ? 
                <ul className="comments-list"> 
                    {reviewHistory.map((data) => <OneReview review={data}/>)}
                </ul>
                :
                (null)}
            </React.Fragment>
        )
    }
    

}

class OneReview extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        const {user, name, type, content, reviewAt} = this.props.review 
        return (

    
            
            <div className="container mt-1">
            <div className="row d-flex justify-content-center">

                    <div className="headings d-flex justify-content-between align-items-center mb-3">
                        <h5></h5>
                    </div>
                    <Card border={type?"success":"danger"} className='p-3'>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="user d-flex flex-row align-items-center"> <img src="https://i.imgur.com/hczKIze.jpg" width="30" className="user-img rounded-circle mr-2" /> 
                            <span><small className="font-weight-bold text-primary">{name}</small> <small className="font-weight-bold">{content}</small></span> </div> <small>{reviewAt}</small>
                        </div>
                        <div className="action d-flex justify-content-between mt-2 align-items-center">
                            <div className="reply px-4"> <span className="dots"></span> <small>Remove</small> <span className="dots"></span> </div>
                            <div className="icons align-items-center"> <i className="fa fa-star text-warning"></i> <i className="fa fa-check-circle-o check-icon"></i> </div>
                        </div>
                        </Card>
                    </div>
                 
                    </div>
         
        
   

        )}


}

export default ProfileComments;
