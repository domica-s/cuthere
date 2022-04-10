// UNDER DEVELOPMENT

import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import authService from "../services/auth.service";
import './UserRating.css';

// const WRITER = authService.getCurrentUser();
// class UserRating extends React.Component{
//     constructor() {
//         super();

//         this.state = { 
//             commentValue: '',
//             commentLine: [''], // CommentID is basically not used
//             reviewType: true

//         };
//     }

//     // Set the current comment / rating Value when we type into the box
//     handleCommentValue = (e) => {

//         this.setState({
//             commentValue: e.target.value,
//         });
//     };

//     // Set Review type
//     handleSetType = (e) => {
//         this.setState({
//             reviewType: e.target.value
//         })
//     }
//     // Set the commentLine --> Kind of like a local memory here
//     setCommentLine = () => {
//         // Add to local memory
//         this.setState({
//             commentLine: [...this.state.commentLine, this.state.commentValue],
//         })

//         // Re-initialize commentValue
//         this.setState({
//             commentValue: '',
//         })


//     }

//     // Submit the rating to the database
//     submitCommentLine = (e) => {
//         // e.preventDefault();

//         this.setCommentLine();

//         // Function call to send to dB --> Send SID who wrote it, Content, and if it is a good or bad review
//         this.props.addReview(WRITER, this.state.commentValue, this.state.reviewType)
//         // Re-initialize review Type 
//         this.setState({
//             reviewType: true,
//         })
//     };

//     // I don't know what the fuck this does but I think we need this
//     enterCommentLine = (e) => {
//         if (e.charCode === 13){
//             this.submitCommentLine();
//         }
//     };

//     render() {

//         return(
//             <>
//             <React.Fragment>
//                 <CommentBox 
//                     commentValue = {this.state.commentValue} 
//                     handleSetType = {this.handleSetType}
//                     handleCommentValue = {this.handleCommentValue}
//                     enterCommentLine = {this.enterCommentLine}
//                     submitCommentLine = {this.submitCommentLine}
//                     reviewHistory = {this.props.reviewHistory}
//                     reviewType = {this.state.reviewType} /> 
//             </React.Fragment>
            
//             </>
//         )
//     }


// }
// class CommentBox extends React.Component { 
//     render() {
//         const {commentValue, handleSetType, handleCommentValue, enterCommentLine, submitCommentLine, reviewHistory, reviewType} = this.props; 
//         const enableCommentButton = () => { return (commentValue ? false : true)}; 
//         const changeCommentButtonStyle = () => {return (commentValue? "comments-button-enabled" : "comments-button-disabled")}; 
       
//         return (
//             <React.Fragment>
//                 <div className="comments-box">
//                 <div className="form-submit">
//                 <Card>
//                 <Card.Header className="card-header"></Card.Header> 
//                 <Card.Body>
//                     <Form>
//                         <Form.Select required name="activityCategory" type="text" value = {reviewType} onChange={handleSetType}>
//                             <option value="true">Positive Review</option>
//                             <option value="false">Negative Review</option>
//                         </Form.Select>
//                         <br />
//                         <Form.Control rows={5} as="textarea" className="unresize" onKeyPress = {enterCommentLine} value ={commentValue} id="comments-input" onChange={handleCommentValue} type="text" placeholder="Add a Review..." />
//                         <div className="mt-2">
//                         <Button onClick={submitCommentLine} type="submit" className="comments-button" id={changeCommentButtonStyle()} disabled ={enableCommentButton()}> Post Review </Button>
//                         </div>
//                     </Form>
//                 </Card.Body>
//                 <Card.Header>
//                 </Card.Header>
//                     </Card>
//                     </div>
//                 </div>

//                 {reviewHistory ? 
//                 <ul classNam="comments-list"> 
//                     {reviewHistory.map((data) => <OneReview review={data}/>)}
//                 </ul>
//                 :
//                 (null)}
//                 <br/>
//                 <br/>
//                 <br/>
//             </React.Fragment>
//         )
//     }
// }

class ProfileComments extends React.Component {
    render() {
        const {commentValue, handleSetType, handleCommentValue, enterCommentLine, submitCommentLine, reviewHistory, reviewType} = this.props; 
    
        return(
            <React.Fragment>
            <Card>
                <Card.Header>Profile Comments</Card.Header>
            </Card>
             {reviewHistory ? 
                <ul classNam="comments-list"> 
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

    
            
            <div class="container mt-1">
            <div class="row d-flex justify-content-center">

                    <div class="headings d-flex justify-content-between align-items-center mb-3">
                        <h5></h5>
                    </div>
                    <Card border={type?"success":"danger"} className='p-3'>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="user d-flex flex-row align-items-center"> <img src="https://i.imgur.com/hczKIze.jpg" width="30" class="user-img rounded-circle mr-2" /> 
                            <span><small class="font-weight-bold text-primary">{name}</small> <small class="font-weight-bold">{content}</small></span> </div> <small>{reviewAt}</small>
                        </div>
                        <div class="action d-flex justify-content-between mt-2 align-items-center">
                            <div class="reply px-4"> <span class="dots"></span> <small>Remove</small> <span class="dots"></span> </div>
                            <div class="icons align-items-center"> <i class="fa fa-star text-warning"></i> <i class="fa fa-check-circle-o check-icon"></i> </div>
                        </div>
                        </Card>
                    </div>
                 
                    </div>
         
        
   

        )}


}

export default ProfileComments;
