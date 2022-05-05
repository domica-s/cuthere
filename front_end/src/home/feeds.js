// The program to handle the functionalities and implementation related to the feeds
// PROGRAMMER: Bryan
// The codes are rendered when we open the about page / see the feeds section
// Revised on 5/5/2022

import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import AuthService from "../services/auth.service";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import "./feeds.css";
import UserService from "../services/user.service";
import {Form, Button} from 'react-bootstrap';
var params = require("../params/params");
const APIfeed = params.baseBackURL + "/feed";


function OneFeed(props){
                          /*
      This is a functional component which is used to display one feed 
      Requirement(parameters): The props which needs to be passed to the component is passed as props
    */
  const currentUser = AuthService.getCurrentUser();
  const API_Query = params.baseBackURL + "/file/";

  let data = props.data[1];
  let sidData = data.sid;
  let user = "user/" + data.sid;
  let event = "event/" + data.eid;
  let timeNow = Date.now();
  let timestamp = Date.parse(data.timestamp);
  let elapsed = timeNow-timestamp;
  let timeRange = "Just now";

  //3 minutes or more
  if(elapsed / (1000 * 60) > 3){
    timeRange = Math.round(elapsed / (1000 * 60)) + " m";
    //an hour or more
    if(elapsed / (1000 * 3600) > 1){
    timeRange = Math.round(elapsed / (1000 * 3600)) + " hr";
      //a day or more
      if(elapsed / (1000 * 3600 * 24) > 2){
        timeRange = Math.round(elapsed / (1000 * 3600 * 24)) + " d";
        //a week or more
        if(elapsed / (1000 * 3600 * 24 * 7) > 1){
          timeRange = Math.round(elapsed / (1000 * 3600 * 24 * 7)) + " w";
          //a month or more
          if(elapsed / (1000 * 3600 * 24 * 7 * 30) > 1){
            timeRange = Math.round(elapsed / (1000 * 3600 * 24 * 7 * 30)) + " mo";
          }
        }
      }
    }
  }

  let dummyPic = "https://bootdey.com/img/Content/avatar/avatar6.png"
  const [img, setImg] = useState(dummyPic);

  const fetchImage = async () => {
                              /*
      This function is called to fetch image
      This function is called directly when the specific feed is loaded / when the about page is rendered
    */
    let api = API_Query + "user-" + sidData;

    const res = await fetch(api, {
      method: "GET",
      headers: new Headers({
        "x-access-token": currentUser.accessToken,
      }),
    });

    if (res.status == 200) {
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImg(imageObjectURL);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [dummyPic]);

  return (
    <table>
      <tr className="p-1">
        <td style={{ width: "90px", textAlign: "center" }}>
          <img
            id="profile-pic"
            src={img}
            className="rounded-circle p-1"
            width="75"
            height="75"
          />
        </td>
        <td>
          <div>
            <span style={{ float: "right" }}>
                {timeRange}
              </span>
            <p>
              <a href={user}>
                <h5>{data.friend}</h5>
              </a>
            </p>
            {data.type == "Register" ? (
              <p className="mb-0">
                is attending{" "}
                <a href={event}>
                  <b>{data.event}</b>
                </a>
              </p>
            ) : (
              <p className="mb-0">
                is hosting{" "}
                <a href={event}>
                  <b>{data.event}</b>
                </a>
              </p>
            )}
          </div>
        </td>
      </tr>
    </table>
  );

}


function OneProfile(props){
                            /*
      This is a functional component which is used to display one user profile
      Requirement(parameters): The props which needs to be passed to the component is passed as props
    */
  const currentUser = AuthService.getCurrentUser();
  const API_Query = params.baseBackURL + "/file/";

  let data = props.data;
    let sid = data[0];
    let name = data[1];
    let college = data[2];
    let interests = data[3];
    let userLink = "user/" + sid;

  let dummyPic = "https://bootdey.com/img/Content/avatar/avatar6.png";
  const [img, setImg] = useState(dummyPic);

  const fetchImage = async () => {
                                  /*
      This function is called to fetch image
      This function is called directly when the specific user profile is loaded / when the about page is rendered
    */
    let api = API_Query + "user-" + sid;
    // console.log(api);
    const res = await fetch(api, {
      method: "GET",
      headers: new Headers({
        "x-access-token": currentUser.accessToken,
      }),
    });
    if (res.status == 200) {
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImg(imageObjectURL);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [dummyPic]);

  return (
    <>
      <hr />
      <table>
        <tbody>
          <tr className="p-1">
            <td style={{ width: "90px", textAlign: "center" }}>
              <img
                id="profile-pic"
                src={img}
                className="rounded-circle p-1"
                width="75"
                height="75"
              />
            </td>
            <td>
              <div>
                <a href={userLink}>
                  <h5>{name}</h5>
                </a>
                <p className="mb-0">{college}</p>
                <p className="mb-0">
                  {interests.map((val, index) => {
                    if (index != interests.length - 1) {
                      return val + ", ";
                    } else {
                      return val;
                    }
                  }) || ""}
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

class Feed extends React.Component {
                              /*
      This is a class component which acts as the backbone for the feed structure in the about class
      Requirement(parameters): The props which needs to be passed to the component is passed as props
    */
  constructor(props) {
    super(props);
    this.state = {
      feeds: {},
      currentUser: AuthService.getCurrentUser(),
      searchTerm: "",
      searchResults: "",
      querySID: "",
      queryName: "",
      queryCollege: "",
      queryMessage: "",
      recommendedFriends: [],
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.onChangeSearch = this.onChangeSearch.bind(this);
  }

  componentDidMount() {
    let currentUser = AuthService.getCurrentUser();
    let api = APIfeed + "/" + currentUser.sid;
    if (currentUser === null) {
    }
    currentUser !== null &&
    fetch(api, {
        method: "GET",
        headers: new Headers({
            "x-access-token": currentUser.accessToken,
        }),
        })
        .then((res) => res.json())
        .then((data) => {
        this.setState({
            feeds: data,
        });
    });

    UserService.recommendFriends(currentUser)
    .then(successResponse => {
                /*
      This function is called to set the recommended friends to the user based on things such as interests / college
      This function is called directly when the about page is rendered
    */
      if (successResponse.fromCollege && successResponse.fromInterests) {
        let fromCollege = successResponse.fromCollege.data;
        let fromInterests = successResponse.fromInterests.data;
        let data1 = [];
        let data2 = [];
        fromCollege.fromCollege.map((val, index) => {
          data1[index] = val;
        })
        fromInterests.fromInterests.map((val, index) => {
          data2[index] = val;
        })
        let data = data1.concat(data2);
        const unique = [...new Map(data.map(item =>[item['sid'], item])).values()];
        this.setState({recommendedFriends: unique});
      }
      else {
        console.log("Load recommendation error");
        this.setState({recommendedFriends: ""});
      }
    },
    error => {
      console.log("Load recommendation error");
      this.setState({recommendedFriends: ""});
    });
  }

  handleSearch(e) {
                    /*
      This function is called to search for a specific user
      Requirement(parameter): e is the whole thing to be passed about the form
      This function is called directly when the user presses the search button
    */
    e.preventDefault();
    this.setState({
      searchTerm: e.target.value
    })

    let currentUser = AuthService.getCurrentUser();
    let userFromDB;

    UserService.getProfile(currentUser, this.state.searchTerm)
    .then(successResponse => {
      userFromDB = successResponse.data;
 
      this.setState({
        querySID: userFromDB.sid,
        queryName: userFromDB.name,
        queryCollege: userFromDB.college,
        queryInterests: userFromDB.interests,
        searchTerm: ""
      })
    },
    error => {
      this.setState({
        queryMessage: error.response.data.message,
        searchTerm: ""
      })

    });
  }

  onChangeSearch(e) {
                        /*
      This function is called to set the value for the user to be searched in the search bar
      Requirement(parameter): e is the whole thing to be passed about the form
      This function is called directly when the user changes something in the search bar
    */
    this.setState({
      searchTerm: e.target.value
    })
  }

  
  
  render() {
    let feeds = (this.state.feeds) ? Object.entries(this.state.feeds): null;
    let queryRes = (this.state.querySID) ? [this.state.querySID, this.state.queryName, this.state.queryCollege, this.state.queryInterests]: null;
    return (
      <Container className="flexbox" style={{paddingLeft: "0px", paddingRight: "10px", paddingTop: "20px"}}>
        <Card>
          <Card.Header style={{ textAlign: "left" }}>
            <b>Discover friends</b>
          </Card.Header>
          <Row className="m-0" style={{ textAlign: "left" }}>
            <h6>Users you may be interested in</h6>
            {/* get friends from same college (2) and same interests (3) */}
            { this.state.recommendedFriends ? (
              <>
                {this.state.recommendedFriends.map((data, index) => (
                  <Row className="m-0" style={{ textAlign: "left" }}>
                    <OneProfile data={[data.sid, data.name, data.college, data.interests]} key={index} />
                  </Row>
                ))}
              </>
            ): (
              <>
              <p>No recommended friends right now</p>
              <p>Invite your friends to CUthere or add more interests!</p>
              </>
            )}
            <hr/>
          </Row>
          <Row className="m-0" style={{ textAlign: "left" }}>
            <Form onSubmit={this.handleSearch}>
              <div className="form-group">
                  <label className="form-label">Enter friend's SID:</label>
                  <Form.Control 
                      name="querySID"
                      type="number" 
                      value={this.state.searchTerm} 
                      onChange={this.onChangeSearch}
                      placeholder={"Type in an SID"}
                      required
                  />
              </div>
              <Container style={{display:'flex', justifyContent:'center'}}>
                <Button type="submit" variant="primary" value="Query SID">Search</Button>
              </Container>
            </Form>
          </Row>
          {queryRes && (
            <Row className="m-0" style={{ textAlign: "left" }}>
              <OneProfile data={queryRes} />
            </Row>
          )}
          <Container>
          {this.state.queryMessage && (
            <div className="form-group">
              <div
              className="alert alert-danger"
              role="alert"
              >
              {this.state.queryMessage}
              </div>
            </div>
          )}
          </Container>
        </Card>
        <Card>
          <Card.Header style={{ textAlign: "left" }}>
                <b>Friend Activity</b>
          </Card.Header>
          {feeds.length > 0 ? (
            feeds.map((data) => (
              <Row className="m-0" style={{ textAlign: "left" }}>
                <OneFeed data={data} />
                <hr className="m-0"></hr>
              </Row>
            ))
          ) : (
            <div className="m-2">
            <h5>No friend activities to display</h5>
            <h6>Find and follow other students first</h6>
            </div>
          )}
        </Card>
      </Container>
    );
  }
}

export {Feed}