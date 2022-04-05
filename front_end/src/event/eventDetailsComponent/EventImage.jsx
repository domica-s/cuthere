import React, { useEffect, useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import defaultImage from '../../images/cuth.png';
import authService from '../../services/auth.service';
var params = require("../../params/params");


const API = params.baseBackURL + "/file/upload";
const API_Query = params.baseBackURL + "/file/";
const API_DELETE = params.baseBackURL + "/file/delete/";
const currentUser = authService.getCurrentUser();

const INITIAL_STATE = {
    file: ""
};

function EventImage(props) {
    console.log(props.eventID, props.category);
    const [Images, setImages] = useState(INITIAL_STATE);

    const onChangeFile = async(e) => {
        setImages({
            file: e.target.files[0]
        });
    }

    const onUploadFile = async(e) => {
        e.preventDefault();
        let api_delete = API_DELETE + "event-" + props.eventID;
        const deletePrevious = await fetch(api_delete, {
            method: "GET",
            headers: new Headers({
                "x-access-token": currentUser.accessToken,
              }),            
        })
        const ResponseJson = await deletePrevious.json();

        if (ResponseJson.message) {
            let data = new FormData();
            data.append("file", Images.file, "event-" + props.eventID);
            const uploadResult = await fetch(API, {
                method: "POST",
                headers: new Headers({
                    "x-access-token": currentUser.accessToken,
                    }),
                  body: data              
            });
            const resultJson = await uploadResult.json();
            await window.alert(resultJson.message);
        }
    }

    const onLoadPic = async(e) => {
        const img = document.querySelector("#event-pic");
        let api = API_Query + "event-" + props.eventID;
        const loadResult = await fetch(api, {
            method: "GET",
            headers: new Headers({
                "x-access-token": currentUser.accessToken,
              }),            
        })
        const resultStatus = await loadResult.clone().status
        const resultBlob = await loadResult.blob();
        if (resultStatus === 200){
            img.crossOrigin = 'anonymous';
            img.src = await URL.createObjectURL(resultBlob);
        }
    }

  return (
      <div> 
          <img id="event-pic" src={defaultImage} alt="" className="center ui-w-80" onLoad={onLoadPic}/>
          <br/>
          <label className="m-3 btn btn-outline-primary">
                Select new photo
                <input type="file" className="account-settings-fileinput" onChange={onChangeFile}/>
          </label> &nbsp;          
          {Images.file && <Button className="m-3" variant="outline-warning" type="button" onClick={onUploadFile}>Upload</Button>}
          {Images.file && <p>File selected: {Images.file.name}</p>}
      </div>
  )
}

export default EventImage