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
    timeRange = Math.round(elapsed / (1000 * 60)) + "m";
    //an hour or more
    if(elapsed / (1000 * 3600) > 3){
    timeRange = Math.round(elapsed / (1000 * 3600)) + "hr";
      //a day or more
      if(elapsed / (1000 * 3600 * 24) > 2){
        timeRange = Math.round(elapsed / (1000 * 3600 * 24)) + "d";
        //a week or more
        if(elapsed / (1000 * 3600 * 24 * 7) > 1){
          timeRange = Math.round(elapsed / (1000 * 3600 * 24 * 7)) + "w";
          //a month or more
          if(elapsed / (1000 * 3600 * 24 * 7 * 30) > 1){
            timeRange = Math.round(elapsed / (1000 * 3600 * 24 * 7 * 30)) + "mo";
          }
        }
      }
    }
  }

  let dummyPic = "https://bootdey.com/img/Content/avatar/avatar6.png"
  const [img, setImg] = useState(dummyPic);

  const fetchImage = async () => {
    let api = API_Query + "user-" + sidData;
    console.log(api);
    const res = await fetch(api, {
      method: "GET",
      headers: new Headers({
        "x-access-token": currentUser.accessToken,
      }),
    });
    //console.log(res);
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

/*
class OneFeed extends React.Component {
  // render one feed
  render() {
    let data = this.props.data[1];
    let user = "user/" + data.sid;
    let event = "event/" + data.event;
    return (
      <table>
        <tbody>
        <tr className="p-1">
          <td style={{ width: "90px", textAlign: "center" }}>
            <img
              src="https://bootdey.com/img/Content/avatar/avatar6.png"
              id="profile-pic"
              alt="profile-pic"
              className="rounded-circle p-1"
              width="75"
            />
          </td>
          <td>
            <div>
              <a href={user}>
                <h5>{data.friend}</h5>
              </a>
              {data.type == "Register" ? (
                <p className="mb-0">
                  is attending  <a href={event}><b>{data.event}</b></a>
                </p>
              ) : (
                <p className="mb-0">
                  is hosting <a href={event}><b>{data.event}</b></a>
                </p>
              )}
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    );
  }
}
*/

function OneProfile(props){
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
    let api = API_Query + "user-" + sid;
    console.log(api);
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

/*
class OneProfile extends React.Component {
  render() {
    let data = this.props.data;
    let sid = data[0];
    let name = data[1];
    let college = data[2];
    let interests = data[3];
    let userLink = "user/" + sid;

    return (
      <>
      <hr/>
      <table>
        <tbody>
        <tr className="p-1">
          <td style={{ width: "90px", textAlign: "center" }}>
            <img
              src="https://bootdey.com/img/Content/avatar/avatar6.png"
              id="profile-pic"
              alt="profile-pic"
              className="rounded-circle p-1"
              width="75"
            />
          </td>
          <td>
            <div>
              <a href={userLink}>
                <h5>{name}</h5>
              </a>
              <p className="mb-0">
                {college}
              </p>
              <p className="mb-0">
                {interests.map((val, index) => {
                  if (index != interests.length - 1) {
                    return val + ", ";
                  }
                  else {
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
    )
  }
}*/

class Feed extends React.Component {
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
      // console.log("called");
      // console.log(successResponse);
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
        data = [...new Set(data)];
        data = data.slice(0,4);
        this.setState({recommendedFriends: data});
      }
      else {
        console.log("Load recommendation error");
        this.setState({recommendedFriends: ""});
      }
    },
    error => {
      // console.log("called err");
      console.log("Load recommendation error");
      this.setState({recommendedFriends: ""});
    });
  }

  handleSearch(e) {
    e.preventDefault();
    this.setState({
      searchTerm: e.target.value
    })

    // console.log(this.state.searchTerm);

    let currentUser = AuthService.getCurrentUser();
    let userFromDB;

    UserService.getProfile(currentUser, this.state.searchTerm)
    .then(successResponse => {
      userFromDB = successResponse.data;
      // console.log(userFromDB);
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
      // console.log(this.state.queryMessage);
    });
  }

  onChangeSearch(e) {
    this.setState({
      searchTerm: e.target.value
    })
  }

  
  
  render() {
    // console.log(this.state.recommendedFriends);
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