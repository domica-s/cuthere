import React, { useEffect, useState} from 'react'
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
            <React.Fragment>
                <CommentBox 
                    commentValue = {this.state.commentValue}
                    handleCommentValue = {this.handleCommentValue}
                    enterCommentLine = {this.enterCommentLine}
                    submitCommentLine = {this.submitCommentLine} 
                    chatHistory = {this.props.chatHistory}/>
            </React.Fragment>
            
            </>
        )
    }


}
class CommentBox extends React.Component { 
    render() {
        const {commentValue, handleCommentValue, enterCommentLine, submitCommentLine, chatHistory} = this.props; 
        const enableCommentButton = () => { return (commentValue ? false : true)}; 
        const changeCommentButtonStyle = () => {return (commentValue? "comments-button-enabled" : "comments-button-disabled")}; 

        return (
            <React.Fragment>
                <div className="comments-box">
                    <input onKeyPress = {enterCommentLine} value ={commentValue} id="comments-input" onChange={handleCommentValue} type="text" placeholder="Add a comment..." />
                    <Button onClick={submitCommentLine} type="submit" className="comments-button" id={changeCommentButtonStyle()} disabled ={enableCommentButton()}> Post </Button>
                </div>
                <ul className="comments-list">
                    {chatHistory.map((data) => <OneChat chat={data}/>)}
                </ul>
                <br/>
                <br/>
                <br/>
            </React.Fragment>
        )
    }
}

class Comment extends React.Component { // This is useless if we want to use OneChat

    render () {
        const {chatHistory} = this.props 
  
        return(
            <ul className ="comments-list">
                {chatHistory.map((data)=> 
                    <li className="each-comment"><strong>{data.user}</strong> commented: "{data.content}" on <i>{data.chatAt}</i></li>
                    )}
            </ul>
        )
    }
}

class OneChat extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let chat = this.props.chat;
        let content = chat.content;
        let username = chat.userDetails;
        let chatAt = chat.chatAt;
        return (
            <div className="bg-dark text-warning">
                <p>Time posted: {chatAt}</p>
                <p>user: {username}</p>
                <p>content: {content}</p>
                <hr/>
            </div>
        );
    }

}

export default CommentForm
