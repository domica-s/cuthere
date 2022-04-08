import React from "react";
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
const currentUser = AuthService.getCurrentUser();

function OneFeed(props){

  const API_Query = params.baseBackURL + "/file/";

  let data = props.data[1];
  let user = "user/" + data.sid;
  let event = "event/" + data.event;

  const onLoadPic = async (e) => {
    const img = document.querySelector("#profile-pic");

    let api = API_Query + "user-" + currentUser.sid;
    const loadResult = await fetch(api, {
      method: "GET",
      headers: new Headers({
        "x-access-token": currentUser.accessToken,
      }),
    });

    const resultBlob = await loadResult.blob();
    img.crossOrigin = "anonymous";
    img.src = await URL.createObjectURL(resultBlob);
  };

  return (
      <table>
        <tr className="p-1">
          <td style={{ width: "90px", textAlign: "center" }}>
            <img
              src="https://bootdey.com/img/Content/avatar/avatar6.png"
              id="profile-pic"
              alt="profile-pic"
              className="rounded-circle p-1"
              width="75"
              onLoad={onLoadPic}
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

class OneProfile extends React.Component {
  render() {
    let data = this.props.data;
    let sid = data[0];
    let name = data[1];
    let college = data[2];
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
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      </>
    )
  }
}

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
        queryCollege: userFromDB.college
      })
    },
    error => {
      this.setState({
        queryMessage: error.response.data.message,
      })
      // console.log(this.state.queryMessage);
    });
  }

  onChangeSearch(e) {
    this.setState({
      searchTerm: e.target.value
    })
  }

  render(){
    // console.log(this.state.feeds);
    let feeds = (this.state.feeds) ? Object.entries(this.state.feeds): null;
    let queryRes = (this.state.querySID) ? [this.state.querySID, this.state.queryName, this.state.queryCollege]: null;
    return (
      <Container className="flexbox" style={{paddingLeft: "0px", paddingRight: "10px", paddingTop: "20px"}}>
        <Card>
          <Card.Header style={{ textAlign: "left" }}>
            <b>Search for friends</b>
          </Card.Header>
          <Row className="m-0" style={{ textAlign: "left" }}>
            <Form onSubmit={this.handleSearch}>
              <div className="form-group">
                  <label className="form-label">Enter SID to query:</label>
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
                <Button type="submit" variant="primary" value="Query SID">Query SID</Button>
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
            <h7>Find and follow other students first</h7>
            </div>
          )}
        </Card>
        
      </Container>
    );
  }
}

export {Feed}