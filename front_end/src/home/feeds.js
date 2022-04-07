import React from "react";
import Container from "react-bootstrap/Container";
import AuthService from "../services/auth.service";
import Row from "react-bootstrap/Row";

var params = require("../params/params");
const APIfeed = params.baseBackURL + "/feed";
const currentUser = AuthService.getCurrentUser();



class OneFeed extends React.Component {
  // render one feed
  render() {
    let data = this.props.data[1];
    return (
      <Container>
          <h4>{data.friend}</h4>
          <p>{data.event}</p>
      </Container>
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
    return(
        <Container>
              {
                feeds.length > 0 ? (
                feeds.map((data)=>(
                    <Row>
                      <OneFeed data={data} />
                    </Row>
                ))) :
                (<h1>No activities to display</h1>)
              }
        </Container>
    );
  }
}

export {Feed}