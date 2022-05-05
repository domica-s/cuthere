// This code is the front-end functionality and implementation for the comment form and the thread
// Programmer: Philip Tarrantino Limas
// The codes are rendered when the user goes into a specific event details page
// Revised on 6/5/2022

import React from 'react'
import Button from 'react-bootstrap/Button';
import './CommentForm.css'
import Form from 'react-bootstrap/Form';
import authService from '../../services/auth.service';
var params = require("../../params/params");

let commentCounter = 1;
const API_Query = params.baseBackURL + "/file/";
const currentUser = authService.getCurrentUser();

class CommentForm extends React.Component{
    constructor(props) {
        super(props);
        this.props = props;
        // console.log("navigation shit: " + props.navigation);
        this.state = { 
            commentValue: '',
            commentLine: [{commentId:"", text:"",}],

        };
    }


    handleCommentValue = (e) => {
                            /*
      This function is used to call the setState function to the set the commentValue of this class component
      Requirements (parameters): e is to be passed which contains the value to be set
    */
        this.setState({
            commentValue: e.target.value,
        });
    };

    setCommentLine = () => {
            /*
      This function is used to call the setState function to set the commentLine of this class component after setting the comment value
    */
        this.setState({
            commentLine: [
                ...this.state.commentLine,
                {commentId: commentCounter++, text: this.state.commentValue}
            ],

            commentValue:""
        })
    }

    submitCommentLine = (e) => {
                    /*
      This function is used to submit the comment line to the back-end to be stored and displayed as a comment 
      Requirements (parameter): e is to be passed which contains the value of the comment line
    */
        this.setCommentLine();

        this.props.addComment(this.props.detail.eventID, this.state.commentValue)
    };

    enterCommentLine = (e) => {
            /*
      This function is used to determine whether the user has entered the 'enter' key in their keyboard which suggests that they want to submit their comment
      Requirements (parameter): e is to be passed which contains the value of the comment line
    */

        if (e.charCode === 13){
            this.submitCommentLine();
        }
    };

    pinComment = (comment) => {
            /*
      This function is used to pin the comments to which the information is sent to the back-end to be processed and displayed as a pinned comment
      Requirements (comment): This is the comment details / specific comment to be passed to the back-end which needs to be pinned
    */
        this.props.pinComment(this.props.detail.eventID, comment)
    }

    unPinComment = (comment) => {
                    /*
      This function is used to unpin the comments to which the information is sent to the back-end to be processed and displayed as a normal comment
      Requirements (comment): This is the comment details / specific comment to be passed to the back-end which needs to be un-pinned
    */
        this.props.unPinComment(this.props.detail.eventID, comment)
    }

    render() {
        // console.log(this.props.createdBy);
        // console.log(currentUser._id);
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
                    unPinComment = {this.unPinComment}
                    navigation = {this.props.navigation}
                    isHost = {(this.props.createdBy === currentUser._id)}/>
                    
            </React.Fragment>
            
            </>
        )
    }


}
class CommentBox extends React.Component {
    
    constructor(props){
        super(props);
    }
    
    pinComment = (chat) => {
        this.props.pinComment(chat)
    }

    unPinComment = (chat) => {
        this.props.unPinComment(chat)
    }

    render() {

        const {commentValue, handleCommentValue, enterCommentLine, submitCommentLine, chatHistory, pinnedComment,isHost} = this.props; 
        const enableCommentButton = () => { return (commentValue ? false : true)}; 
        const changeCommentButtonStyle = () => {return (commentValue? "comments-button-enabled" : "comments-button-disabled")}; 
       
        return (
            <React.Fragment>
                <Form>
                <div class="row">
                <div class="col-lg-4 col-lg-offset-4 center-block col-center">
                        <Form.Control as="textarea" rows={5} className="unresize" onKeyPress = {enterCommentLine} value ={commentValue} id="comments-input" onChange={handleCommentValue} type="text" placeholder="Add a comment..." />
                        <br />
                        <Button onClick={submitCommentLine} type="submit" className="comments-button" id={changeCommentButtonStyle()} disabled ={enableCommentButton()}> Post Comment</Button>
                    </div>
                    </div>
                </Form>

                {/* Pinned Comments Part */}
                {pinnedComment? 
                <ul className="comments-list">
                    {pinnedComment.map((data) => 
                        <OneChat chat={data} state={'pinned'} unPinComment= {this.unPinComment} navigation={this.props.navigation} isHost={isHost}/> 
                        )}
                </ul>
                :
                (null)}

                {/* Rest of the Chat History */}
                {chatHistory ? 
                <ul className="comments-list"> 
                    {chatHistory.map((data, index) => 
                        <OneChat chat={data} index={index} state={'unpinned'} pinComment={this.pinComment} navigation={this.props.navigation} isHost={isHost}/>
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
        this.onClickUser = this.onClickUser.bind(this);
        this.onLoadPic = this.onLoadPic.bind(this);
    }

    async onLoadPic(sid) {
        const img = document.querySelector("#user-" + this.props.index);
        let api = API_Query + 'user-' + sid;
        const loadResult = await fetch(api, {
            method: "GET",
            headers: new Headers({
                "x-access-token": currentUser.accessToken,
            })
        })
        const resultStatus = await loadResult.clone().status
        const resultBlob = await loadResult.blob();
        if (resultStatus === 200) {
            img.crossOrigin = 'anonymous';
            img.src = await URL.createObjectURL(resultBlob);            
        }
    }

    pinComment = () => {
        this.props.pinComment(this.props.chat)
    }

    unPinComment = () => {
        this.props.unPinComment(this.props.chat)
    }

    onClickUser(sid) {
        let userLink = '/user/' + sid;
        // console.log('Directing to ' + userLink + '...');
        this.props.navigation(userLink, { replace: true });
    }

    render() {
        const state = this.props.state
        const isHost = this.props.isHost

        let chat = this.props.chat;
        let content = chat.content;
        let username = chat.name;
        let chatAt = chat.chatAt;
        let sid = chat.user;
        // console.log(isHost);
        return (
            <div>
            <div class="container mt-3">
    <div class="row d-flex justify-content-center full">
        <div class="col-md-8">
            <div class="card p-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="user d-flex flex-row align-items-center">
                     <img id={"user-"+this.props.index} src="https://i.imgur.com/hczKIze.jpg" width="30" className="user-img rounded-circle" onClick={() => {this.onClickUser(sid)}} onLoad={() => {this.onLoadPic(sid)}}/>
                      <span><small class="font-weight-bold text-primary" onClick={ () => {this.onClickUser(sid)} }>{username}</small> <small class="font-weight-bold">{content}</small></span> </div> <small>{chatAt}</small>
                </div>
                <div class="action d-flex justify-content-between mt-2 align-items-center">
                    <div class="icons align-items-center"> <i class="fa fa-star text-warning"></i> <i class="fa fa-check-circle-o check-icon"></i> </div>
                    
                    {(isHost == true)?
                    (
                        (state ==="pinned")
                            ?
                            <Button onClick = {this.unPinComment} type="submit"> Unpin this comment </Button>
                            :
                            <Button onClick = {this.pinComment} type="submit">Pin this comment</Button> 
                    )
                    :(null) }

                    {/* {
                    (state ==="pinned")
                        ?
                        <Button onClick = {this.unPinComment} type="submit"> Unpin this comment </Button>
                        :
                        <Button onClick = {this.pinComment} type="submit">Pin this comment</Button> 
                    } */}
                    
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
