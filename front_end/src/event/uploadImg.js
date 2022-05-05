// The program for testing the upload image to mongoDB function in frontend
// PROGRAMMER: ETHAN LEE
// This program is for testing purpose only
// Revised on 5/5/2022


import React from "react";
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import AuthService from "../services/auth.service";

var params = require("../params/params");

const API = params.baseBackURL + "/file/upload";
const API_Query = params.baseBackURL + "/file/";
const API_DELETE = params.baseBackURL + "/file/delete/";
const currentUser = AuthService.getCurrentUser();

class UploadImage extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.onSubmitFile = this.onSubmitFile.bind(this);
        this.onChangeQuery = this.onChangeQuery.bind(this);
        this.onSubmitQuery = this.onSubmitQuery.bind(this);
        this.onChangeDelete = this.onChangeDelete.bind(this);
        this.onSubmitDelete = this.onSubmitDelete.bind(this);
    
        this.state = {
            file: "",
            queryImg: "",
            showImg: false,
            deleteImg: ""
        }
    }
    
    onChangeFile(e) {
                    /*
      This function is used to handle the change of image files
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called after the user clicks the file to be uploaded
    */
        this.setState({
            file: e.target.files[0]
        })
    }
    
    onSubmitFile(e) {
                            /*
      This function is used to uploading and storing of the file to the database in the back-end
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called after the user clicks the upload file button
    */
        e.preventDefault();
        let data = new FormData();
        let file = this.state.file;
        data.append("file", file, "event" + currentUser.sid + ".jpg");
        fetch(API, {
            method: "POST",
            headers: new Headers({
                "x-access-token": currentUser.accessToken,
            }),
            body: data
        }).then((res) => res.json())
        .then(data => window.alert(data.message))
    }

    onChangeQuery(e) {
                            /*
      This function is used to set the query Image based on the query set by the user
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called simultaneously when the user types the query
    */
        this.setState({
            queryImg: e.target.value
        })
    }

    onSubmitQuery(e) {
                /*
      This function is used to find the image matching based on the query from the database
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called after the user clicks the submit query button
    */
        let api = API_Query + this.state.queryImg;
        fetch(api, {
            method: "GET",
            headers: new Headers({
                "x-access-token": currentUser.accessToken,
            }),
        }).then((res) => res.blob())
        .then(blob => {
            const img = new Image;
            img.crossOrigin = 'anonymous';
            img.src = URL.createObjectURL(blob);
            document.body.appendChild(img);
        })
        this.setState({
            showImg: true
        })
    }

    onChangeDelete(e) {
                        /*
      This function is used to set the image to be deleted
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called simultaneously when the user picks the image to be deleted
    */
        this.setState({
            deleteImg: e.target.value
        })
    }

    onSubmitDelete(e) {
            /*
      This function is used to delete the image associated with the specific component
      Requirements (Parameter): e is the whole data to be passed in the form 
      This function will be called after the user clicks the delete image button
    */
        e.preventDefault();

        let api = API_DELETE + this.state.deleteImg;
        fetch(api, {
            method: "GET",
            headers: new Headers({
                "x-access-token": currentUser.accessToken,
              }),            
        }).then((res) => res.json())
        .then(data => window.alert(data.message))
    }


    render() {
        return (
            <Container>
                <h2>Upload your image</h2>
                <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Upload a photo for your event?</Form.Label>
                        <Form.Control type="file" onChange={this.onChangeFile}/>
                        <Button type="button" onClick={this.onSubmitFile}>Upload</Button>
                </Form.Group> 

                <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Query for image</Form.Label>
                        <Form.Control type="text" onChange={this.onChangeQuery}/>
                        <Button type="button" onClick={this.onSubmitQuery}>Show</Button>
                </Form.Group>                             
                {this.state.queryImg && <img className="w-30 h-30" src={API_Query + this.state.queryImg} alt="image1" />}

                <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Delete image</Form.Label>
                        <Form.Control type="text" onChange={this.onChangeDelete}/>
                        <Button type="button" onClick={this.onSubmitDelete}>Delete</Button>
                </Form.Group>     
            </Container>
        )
    }
}


export {UploadImage};