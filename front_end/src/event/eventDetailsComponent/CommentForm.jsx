import React, { useState} from 'react'
import Button from 'react-bootstrap/Button';


let commentCounter = 1;
class CommentForm extends React.Component{
    constructor() {
        super();

        this.state = { 
            commentValue: '',
            commentLine: [{commentId:"", text:"",}],
        };
    }

    handleCommentValue = (e) => {

        this.setState({
            commentValue: e.target.value,
        });
    };

    setCommentLine = () => {
        this.setState({
            commentLine: [
                ...this.state.commentLine,
                {commentId: commentCounter++, text: this.state.commentValue}
            ],

            commentValue:""
        })
    }

    submitCommentLine = (e) => {
        e.preventDefault();
        this.setCommentLine();
        // Send to the EventDetails Page
        console.log(this.props)
        this.props.addComment(this.props.detail.eventID, this.state.commentValue)
    };

    enterCommentLine = (e) => {
        if (e.charCode === 13){
            this.setCommentLine();
        }
    };

    render() {
        return(
            <>
            
            <CommentBox 
                commentValue = {this.state.commentValue}
                handleCommentValue = {this.handleCommentValue}
                enterCommentLine = {this.enterCommentLine}
                submitCommentLine = {this.submitCommentLine} />

            <Comment chatHistory = {this.props.chatHistory}/>

            
            
            </>
        )
    }


}
class CommentBox extends React.Component { 
    render() {
        const {commentValue, handleCommentValue, enterCommentLine, submitCommentLine} = this.props; 
        const enableCommentButton = () => { return (commentValue ? false : true)}; 
        const changeCommentButtonStyle = () => {return (commentValue? "comments-button-enabled" : "comments-button-disabled")}; 

        return (
            <React.Fragment>
                <div className="comments-box">
                    <input onKeyPress = {enterCommentLine} value ={commentValue} id="comments-input" onChange={handleCommentValue} type="text" placeholder="Add a comment..." />
                    <Button onClick={submitCommentLine} type="submit" className="comments-button" id={changeCommentButtonStyle()} disabled ={enableCommentButton()}> Post </Button>
                </div>
            </React.Fragment>
        )
    }
}

class Comment extends React.Component {

    render () {
        const {chatHistory} = this.props 
        console.log(chatHistory)

        return(
            <ul className ="comments-list">
                {chatHistory.map((data)=> {
                    return <li className="each-comment">{data.content}</li>
                    })}
            </ul>
        )
    }
}

export default CommentForm
