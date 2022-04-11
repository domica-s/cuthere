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
        }; // May need to increase this part
    }

    handleUpdateValue = (e) => {

        this.setState({
            updateValue: e.target.value,
        });
    };
    
    handleUpdateDate = (date) => {
        this.setState({
            updateDate: date
        })
    }

    setUpdateLabel = (format) => {
        (format==="date")? this.setState({updateDate:new Date()}): this.setState({updateValue:""})
    }

    submitUpdateLine = (e) => {
        e.preventDefault();
        this.setUpdateLabel();

        const contentJSON= `{
            "${this.props.label}":"${(this.props.type==="date")?this.state.updateDate:this.state.updateValue}"
        }`
        this.props.updateEvent(contentJSON) 
        

    };

    enterUpdateLine = (e, format) => {
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
                                    <option value="Outdoor">Outdoor</option>
                                    <option value="Indoor">Indoor</option>
                                    <option value="Offline">Offline</option>
                                    <option value="Online">Online</option>
                                </Form.Select> 
                                </div>// Category --> WORKING
                            : 
                        (type=="number")? 
                        <div className="form-group col-5 col-md-5 ">
                        <label className="form-label">Quota</label>
                        <Form.Control name="quota" format={type} placeholder="New quota.." value={updateValue} onChange={e => handleUpdateValue(e)}/>
                        </div> // Quota --> WORKING
                            :
                            (label == 'start')?
                            <div className="form-group col-5 col-md-5 ">
                            <label>Start Date</label>
                            <Datetime format={type} value ={updateValue} onChange ={date => handleUpdateDate(date)} /> 
                            </div>// Date --> NOT WORKING
                            :
                            <div className="form-group col-5 col-md-5 ">
                            <label>End Date</label>
                            <Datetime format={type} value ={updateValue} onChange ={date => handleUpdateDate(date)} /> 
                            </div>// Date --> NOT WORKING
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
