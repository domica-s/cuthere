import React, { useState} from 'react'
import Button from 'react-bootstrap/Button';


let updateCounter = 1;
class UpdateForm extends React.Component{
    constructor() {
        super();

        this.state = { 
            updateValue: ''
        };
    }

    handleUpdateValue = (e) => {

        this.setState({
            updateValue: e.target.value,
        });
    };

    setUpdateLabel = () => {
        this.setState({updateValue:""})
    }

    submitUpdateLine = (e) => {
        e.preventDefault();
        this.setUpdateLabel();

        // Send to the EventDetails Page
        console.log(this.props)
    };

    enterUpdateLine = (e) => {
        if (e.charCode === 13){
            this.setUpdateLabel();
        }
    };

    render() {
        return(
            <>
            <UpdateBox 
                updateValue = {this.state.updateValue}
                handleUpdateValue = {this.handleUpdateValue}
                enterUpdateLine = {this.enterUpdateLine}
                submitUpdateLine = {this.submitUpdateLine} 
                contentType= {this.props.type}/>
            </>
        )
    }


}
class UpdateBox extends React.Component { 
    render() {
        const {updateValue, handleUpdateValue, enterUpdateLine, submitUpdateLine} = this.props; 
        const enableUpdateButton = () => { return (updateValue ? false : true)}; 
        const changeUpdateButtonStyle = () => {return (updateValue? "update-button-enabled" : "update-button-disabled")}; 

        return (
            <React.Fragment>
                <div className="update-box">
                    <input onKeyPress = {enterUpdateLine} value ={updateValue} id="update-input" onChange={handleUpdateValue} type="text" placeholder="Add updates here" />
                    <Button onClick={submitUpdateLine} type="submit" className="update-button" id={changeUpdateButtonStyle()} disabled ={enableUpdateButton()}> Update </Button>
                </div>
            </React.Fragment>
        )
    }
}



export default UpdateForm
