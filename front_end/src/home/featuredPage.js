import React from "react";
import Container from "react-bootstrap/Container";

import {EventCard} from "./eventPage";
import Button from "react-bootstrap/Button";
import AuthService from "../services/auth.service";

var params = require("../params/params");


class Featured extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            api: params.baseBackURL + "/featured/new",
            events: {}
        };
    }
    componentDidMount(){
      let currentUser = AuthService.getCurrentUser()
      if (currentUser === null) {
      }
      {
        currentUser !== null && fetch(this.state.api, {
            method: "GET",
            headers: new Headers({
              "x-access-token": currentUser.accessToken,
            }),
          })
          .then((res) => res.json())
          .then((data) => {
            this.setState({
              title: data.title,
              events: data.event_dic
            });
          });
      }
    }
    render(){
        let events = Object.entries(this.state.events)
        return (
          <Container className="mb-5">
            <a href="/">
            <Button variant="secondary" className="mt-2" style={{display:"flex", justifyContent:"flex-start"}}>
              Go back</Button></a>
          <div style={{padding:"1rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gridGap:"40px"}}>
            {events.length > 0 &&
              events.map((data) => 
              <EventCard data={data} />
              )}
          </div>
          </Container>
        );
    }
}

export {Featured}