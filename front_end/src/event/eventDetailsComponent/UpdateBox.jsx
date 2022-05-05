// This code is the front-end functionality and implementation of the update box
// Programmer: Philip Tarrantino Limas
// The codes are rendered when the user opens a specific event
// Revised on 6/5/2022

import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Datetime from 'react-datetime';
import moment from 'moment';
import './UpdateBox.css';


let updateCounter = 1;
class UpdateForm extends React.Component{
    constructor() {
        super();

        this.state = { 
            updateValue: '',
            updateDate: new Date()
        }; 
    }

    handleUpdateValue = (e) => {
                            /*
      This function is used to call the setState function to the set the update value you want to update the specific element with 
      Requirements (parameters): e is to be passed which contains the value to be set
      This function will be called whenever there is a change in the updatebox
    */
        this.setState({
            updateValue: e.target.value,
        });
    };
    
    handleUpdateDate = (date) => {
        /*
      This function is used to call the setState function to the set the update value for dates 
      Requirements (parameters): date is to be passed which contains the date you would like to set
      This function will be called whenever there is a change in the update date element
    */
        this.setState({
            updateDate: date
        })
    }

    setUpdateLabel = (format) => {
                /*
      This function is used to call the setState function to the set the update value depending on the format type
      Requirements (parameters): format is the data type to be changed - if it's a date then updateDate, else updateValue
      This function will be called whenever there is a change in the update element
    */

        (format==="date")? this.setState({updateDate:new Date()}): this.setState({updateValue:""})
    }

    submitUpdateLine = (e) => {
                            /*
      This function is used to submit the update content to the back-end to be updated and the change to be displayed
      Requirements (parameter): e is to be passed which contains the value of the update line
    */
        e.preventDefault();
        this.setUpdateLabel();

        const contentJSON= `{
            "${this.props.label}":"${(this.props.type==="date")?this.state.updateDate:this.state.updateValue}"
        }`
        this.props.updateEvent(contentJSON) 
        

    };

    enterUpdateLine = (e, format) => {
            /*
      This function is used to determine whether the user has entered the 'enter' key in their keyboard which suggests that they want to submit their updated content
      Requirements (parameter): e is to be passed which contains the value of the keypress
    */
        if (e.charCode === 13){
            this.setUpdateLabel(format);
        }
    };

    render() {
        return(
            <>
            <UpdateBox 
                updateValue = {this.state.updateValue}
                updateDate = {this.state.updateDate}
                handleUpdateValue = {this.handleUpdateValue}
                handleUpdateDate= {this.handleUpdateDate}
                enterUpdateLine = {this.enterUpdateLine}
                submitUpdateLine = {this.submitUpdateLine} 
                type= {this.props.type}
                label={this.props.label}
                value={this.props.value}
                />
                
            </>
        )
    }


}
class UpdateBox extends React.Component { 
    render() {
        const {updateValue, updateDate, handleUpdateValue, handleUpdateDate, enterUpdateLine, submitUpdateLine, type, label, value} = this.props; 
        const enableUpdateButton = () => { return (type=="date")?(updateDate?false:true):(updateValue ? false : true)}; 
        const changeUpdateButtonStyle = () => {return (type==="date")?(updateDate?"update-botton-enabled":"update-button-disabled"):(updateValue? "update-button-enabled" : "update-button-disabled")}; 

        return (
            <React.Fragment>
            <Container>
                <div className="update-box align-items-end row d-flex">
                    <Form className="signin-form" onSubmit={submitUpdateLine} method="post" encType="application/x-www-form-urlencoded; charset=UTF-8;application/json">
                    {
                        (type=="text") ? 
                            (label=="venue")? 
                            <div className="form-group col-5 col-md-5 ">
                            <label className="form-label">Venue</label>
                            <Form.Control name="Event Venue" format={type} placeholder="New venue.." value={updateValue} onChange={e => handleUpdateValue(e)}/>
                            </div> // Venue --> WORKING
                                : 
                                <div className="form-group col-5 col-md-5 ">
                                <label className="form-label">Category</label>
                                <Form.Select name="activityCategory" format={type} placeholder="New category.." value = {updateValue} onChange={e => handleUpdateValue(e)}> 
                                    <option value="">None</option>
                                    <option value="Basketball">Basketball</option>
                                    <option value="Badminton">Badminton</option>
                                    <option value="Soccer">Soccer</option>
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
                                </div>
                            : 
                        (type=="number")? 
                        <div className="form-group col-5 col-md-5 ">
                        <label className="form-label">Quota</label>
                        <Form.Control name="quota" format={type} placeholder="New quota.." value={updateValue} onChange={e => handleUpdateValue(e)}/>
                        </div> 
                            :
                            (label == 'start')?
                            <div className="form-group col-5 col-md-5 ">
                            <label>Start Date</label>
                            <Datetime format={type} value ={updateValue} onChange ={date => handleUpdateDate(date)} /> 
                            </div>
                            :
                            <div className="form-group col-5 col-md-5 ">
                            <label>End Date</label>
                            <Datetime format={type} value ={updateValue} onChange ={date => handleUpdateDate(date)} /> 
                            </div>
                }       <div className="form-group col-6 col-md-2">
                        <Button onClick={submitUpdateLine} type="submit" size='sm' className="update-button button-style" id={changeUpdateButtonStyle()} disabled ={enableUpdateButton()} format={type}> Update </Button>
                        </div>
                    </Form>
                </div>
                </Container>
            </React.Fragment>
        )
    }
}



export default UpdateForm
