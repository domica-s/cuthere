// The program for the frontend of the feature page 
// PROGRAMMER: Domica Santoso
// The program is called to show the featured activities for the user
// Revised on 5/5/2022


import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import EventCard from "./eventPage";
import Button from "react-bootstrap/Button";
import AuthService from "../services/auth.service";

var params = require("../params/params");

function Featured(){
    const [data, setData] = useState({
      events: {}
    });

    const {type} = useParams();
    let currentUser = AuthService.getCurrentUser();

    useEffect(() => {
      var strType = type;
      let api = params.baseBackURL + "/featured/" + type;
      if(type == "discover" || type == "interest" || type == "starred"){
        api = api + "/" + currentUser.sid;
      }
      else if(type.includes('ctg')){
        strType = strType.replace("ctg-", "");
        api = params.baseBackURL + "/featured/ctg/" + strType;
      }
      // console.log(api)
      currentUser !== null && fetch(api, {
          method: "GET",
          headers: new Headers({
            "x-access-token": currentUser.accessToken,
          }),
        })
        .then((res) => res.json())
        .then((data) => {
          setData({
            events: data.event_dic
          })
        });
        }
        , []);

    const {events} = data;
    const disp_events = Object.entries(events)
    // console.log(disp_events)

    return (
      <Container className="mb-5">
        <a href="/">
        <Button variant="secondary" className="mt-2" style={{display:"flex", justifyContent:"flex-start"}}>
          Go back</Button></a>
        <div style={{padding:"1rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gridGap:"40px"}}>
          {disp_events.length > 0 &&
            disp_events.map((data) => 
            <EventCard data={data} />
            )}
        </div>
      </Container>
    );
}


export {Featured}