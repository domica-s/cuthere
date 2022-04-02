import React, {useState} from "react";
import {Button, Descriptions} from 'antd';


const CommentForm = ({
    handleSubmit, 
    initialText= "",
}) => {
    const {text, setText} = useState(initialText)
    const onSubmit = (event) => { 
        event.preventDefault(); 
        handleSubmit(text);
        setText("");
    }



    return ( 
        <React.Fragment>
            <form onSubmit = {onSubmit}>
                <textarea className ="comment-form textarea" value ={text} onChange={e => setText(e.target.value)} /> 
                <Button className ="button" >
                    Submit
                </Button>
            </form>
            
        </React.Fragment>
    )
}


export default CommentForm;