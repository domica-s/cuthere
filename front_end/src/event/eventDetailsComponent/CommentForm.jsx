import React from 'react'
import Button from 'react-bootstrap/Button';
import './CommentForm.css'
import Form from 'react-bootstrap/Form';

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
        this.setCommentLine();

        this.props.addComment(this.props.detail.eventID, this.state.commentValue)
    };

    enterCommentLine = (e) => {
        if (e.charCode === 13){
            this.submitCommentLine();
        }
    };

    pinComment = (comment) => {
        this.props.pinComment(this.props.detail.eventID, comment)
    }

    unPinComment = (comment) => {
        this.props.unPinComment(this.props.detail.eventID, comment)
    }

    render() {

        return(
            <>
            <React.Fragment>
                <CommentBox 
                    commentValue = {this.state.commentValue}
                    handleCommentValue = {this.handleCommentValue}
                    enterCommentLine = {this.enterCommentLine}
                    submitCommentLine = {this.submitCommentLine} 
                    chatHistory = {this.props.chatHistory}
                    pinnedComment = {this.props.pinnedComment}
                    pinComment = {this.pinComment}
                    unPinComment = {this.unPinComment}/>
            </React.Fragment>
            
            </>
        )
    }


}
class CommentBox extends React.Component {  
    pinComment = (chat) => {
        this.props.pinComment(chat)
    }

    unPinComment = (chat) => {
        this.props.unPinComment(chat)
    }

    render() {

        const {commentValue, handleCommentValue, enterCommentLine, submitCommentLine, chatHistory, pinnedComment} = this.props; 
        const enableCommentButton = () => { return (commentValue ? false : true)}; 
        const changeCommentButtonStyle = () => {return (commentValue? "comments-button-enabled" : "comments-button-disabled")}; 
       
        return (
            <React.Fragment>
                <Form>
                    <div className="comments-box">
                        <input onKeyPress = {enterCommentLine} value ={commentValue} id="comments-input" onChange={handleCommentValue} type="text" placeholder="Add a comment..." />
                        <Button onClick={submitCommentLine} type="submit" className="comments-button" id={changeCommentButtonStyle()} disabled ={enableCommentButton()}> Post </Button>
                    </div>
                </Form>

                {/* Pinned Comments Part */}
                {pinnedComment? 
                <ul className="comments-list">
                    {pinnedComment.map((data) => 
                        <OneChat chat={data} state={'pinned'} unPinComment= {this.unPinComment}/> 
                        )}
                </ul>
                :
                (null)}

                {/* Rest of the Chat History */}
                {chatHistory ? 
                <ul className="comments-list"> 
                    {chatHistory.map((data) => 
                        <OneChat chat={data} state={'unpinned'} pinComment={this.pinComment}/>
                    )}
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


class OneChat extends React.Component {
    constructor(props) {
        super(props);
    }

    pinComment = () => {
        this.props.pinComment(this.props.chat)
    }

    unPinComment = () => {
        this.props.unPinComment(this.props.chat)
    }

    render() {
        const state = this.props.state

        let chat = this.props.chat;
        let content = chat.content;
        let username = chat.name;
        console.log(chat);
        console.log(username);
        let chatAt = chat.chatAt;
        return (
            <div>
            <div class="container mt-3">
    <div class="row d-flex justify-content-center full">
        <div class="col-md-8">
            <div class="card p-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="user d-flex flex-row align-items-center">
                     <img src="https://i.imgur.com/hczKIze.jpg" width="30" class="user-img rounded-circle" />
                      <span><small class="font-weight-bold text-primary">{username}</small> <small class="font-weight-bold">{content}</small></span> </div> <small>{chatAt}</small>
                </div>
                <div class="action d-flex justify-content-between mt-2 align-items-center">
                    <div class="reply px-4"> <small>Remove</small> <span class="dots"></span> <small>Reply</small> <span class="dots"></span> <small>Translate</small> </div>
                    <div class="icons align-items-center"> <i class="fa fa-star text-warning"></i> <i class="fa fa-check-circle-o check-icon"></i> </div>
                    
                    {
                    (state ==="pinned")
                        ?
                        <Button onClick = {this.unPinComment} type="submit"> Unpin this comment </Button>
                        :
                        <Button onClick = {this.pinComment} type="submit">Pin this comment</Button> 
                    }
                    
                </div>
            </div>
            </div>
            </div>
            </div>
    </div>
        );
    }

}

export default CommentForm
