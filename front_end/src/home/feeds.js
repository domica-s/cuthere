import React from "react";
import Container from "react-bootstrap/Container";
import AuthService from "../services/auth.service";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import "./feeds.css";

var params = require("../params/params");
const APIfeed = params.baseBackURL + "/feed";
const currentUser = AuthService.getCurrentUser();



class OneFeed extends React.Component {
  // render one feed
  render() {
    let data = this.props.data[1];
    let user = "user/" + data.sid;
    let event = "event/" + data.event;
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
}

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feeds: {},
      currentUser: AuthService.getCurrentUser(),
    };
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
  render(){
    console.log(this.state.feeds);
    let feeds = (this.state.feeds) ? Object.entries(this.state.feeds): null;
    return (
      <Container className="flexbox" style={{paddingLeft: "0px", paddingRight: "10px", paddingTop: "20px"}}>
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
            <p>
            <h3>No activities to display</h3>
            <h4>Find friends here</h4>
            </p>
          )}
        </Card>
      </Container>
    );
  }
}

export {Feed}