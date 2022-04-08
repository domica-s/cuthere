// UNDER DEVELOPMENT

import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import authService from "../services/auth.service";

const WRITER = authService.getCurrentUser();
class UserRating extends React.Component{
    constructor() {
        super();

        this.state = { 
            commentValue: '',
            commentLine: [''], // CommentID is basically not used
            reviewType: false

        };
    }

    // Set the current comment / rating Value when we type into the box
    handleCommentValue = (e) => {

        this.setState({
            commentValue: e.target.value,
        });
    };

    // Set Review type
    handleSetType = (e) => {
        this.setState({
            reviewType: e.target.value
        })
    }
    // Set the commentLine --> Kind of like a local memory here
    setCommentLine = () => {
        // Add to local memory
        this.setState({
            commentLine: [...this.state.commentLine, this.state.commentValue],
        })

        // Re-initialize commentValue
        this.setState({
            commentValue: '',
        })

        // Re-initialize review Type 
        this.setState({
            reviewType: false,
        })
    }

    // Submit the rating to the database
    submitCommentLine = (e) => {
        // e.preventDefault();

        this.setCommentLine();

        // Function call to send to dB --> Send SID who wrote it, Content, and if it is a good or bad review
        this.props.addReview(WRITER, this.state.commentValue, this.state.reviewType)

    };

    // I don't know what the fuck this does but I think we need this
    enterCommentLine = (e) => {
        if (e.charCode === 13){
            this.submitCommentLine();
        }
    };

    render() {

        return(
            <>
            <React.Fragment>
                <CommentBox 
                    commentValue = {this.state.commentValue} 
                    handleSetType = {this.handleSetType}
                    handleCommentValue = {this.handleCommentValue}
                    enterCommentLine = {this.enterCommentLine}
                    submitCommentLine = {this.submitCommentLine}
                    reviewHistory = {this.props.reviewHistory}
                    reviewType = {this.state.reviewType} /> 
            </React.Fragment>
            
            </>
        )
    }


}
class CommentBox extends React.Component { 
    render() {
        const {commentValue, handleSetType, handleCommentValue, enterCommentLine, submitCommentLine, reviewHistory, reviewType} = this.props; 
        const enableCommentButton = () => { return (commentValue ? false : true)}; 
        const changeCommentButtonStyle = () => {return (commentValue? "comments-button-enabled" : "comments-button-disabled")}; 
       
        return (
            <React.Fragment>
                <div className="comments-box">
                    <Form>
                        <Form.Select required name="activityCategory" type="text" value = {reviewType} onChange={handleSetType}>
                            <option value="true">Positive Review</option>
                            <option value="false">Negative Review</option>
                        </Form.Select>

                        <input onKeyPress = {enterCommentLine} value ={commentValue} id="comments-input" onChange={handleCommentValue} type="text" placeholder="Add a Review..." />
                        <Button onClick={submitCommentLine} type="submit" className="comments-button" id={changeCommentButtonStyle()} disabled ={enableCommentButton()}> Post Review </Button>
                    </Form>
                </div>
                {reviewHistory ? 
                <ul classNam="comments-list"> 
                    {reviewHistory.map((data) => <OneReview review={data}/>)}
                </ul>
                :
                (null)}
                <br/>
                <br/>
                <br/>
            </React.Fragment>
        )
    }
}


class OneReview extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        const {user, type, content, reviewAt} = this.props.review // Fix this if wrong
        return (
            <div className="bg-dark text-success">
                {type? <p>Positive Review!</p>: <p>Negative Review!</p>}
                <p>Written by: {user}</p>
                <p>Review: {content}</p>
                <p>Posted on: {reviewAt}</p>
                <hr/>
            </div>
        );
    }

}

export default UserRating
