import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import AuthService from "../services/auth.service";

var params = require("../params/params");

const API = params.baseBackURL + "/file/upload";
const API_Query = params.baseBackURL + "/file/";
const currentUser = AuthService.getCurrentUser();

class UploadImage extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.onSubmitFile = this.onSubmitFile.bind(this);
        this.onChangeQuery = this.onChangeQuery.bind(this);
        this.onSubmitQuery = this.onSubmitQuery.bind(this);
    
        this.state = {
            file: "",
            queryImg: "",
            showImg: false
        }
    }
    
    onChangeFile(e) {
        this.setState({
            file: e.target.files[0]
        })
    }
    
    onSubmitFile(e) {
        e.preventDefault();
    }

    onChangeQuery(e) {
        this.setState({
            queryImg: e.target.value
        })
    }

    onSubmitQuery(e) {
        this.setState({
            showImg: true
        })
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
            </Container>
        )
    }
}


export {UploadImage};