import './App.css';
import {BrowserRouter, Routes, Route, useLocation, Link, useNavigate} from 'react-router-dom'
import {Home, About} from './home/homePage'
import {LoginWithNavigate} from './home/loginPage'
import {Event} from './home/eventPage'
import { SignUp } from  './home/signUpPage'
import { ForgotPw } from './home/forgotPwPage';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Profile from './home/myProfile';
import authService from './services/auth.service';
import React from 'react';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined
    }
    
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    const user = authService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  handleLogout() {
  
    localStorage.removeItem("user");
    localStorage.setItem("isAuthenticated", false);

    // this.setState({
    //   currentUser: undefined
    // });

    
    return <LoginWithNavigate/>
  }

  render() {
    const { currentUser } = this.state;
    return (
      <div className="App">
        <BrowserRouter>
          <NavigationBar isAuthUser={(currentUser != undefined)} />
          
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/login' element={<LoginWithNavigate/>} />
            <Route path='/event' element={<Event/>} />
            <Route path='/signup' element={<SignUp/>} />
            <Route path='/logout' element={<this.handleLogout/>} />
            <Route path='/profile' element={<Profile/>} />
            <Route path='/forgotpw' element={<ForgotPw/>} />
            <Route path='/*' element={<NoMatch/>} />
          </Routes>
      
          <FooterBar />
        </BrowserRouter>
      </div>    
    );
  }
}

class NavigationBar extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    let isAuth = this.props.isAuthUser;
    return (
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            {/* <img
              alt=""
              src="/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '} */}
          CUthere
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            {isAuth != true && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
            {isAuth != true && <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>}
            {isAuth == true && <Nav.Link as={Link} to="/logout">Logout</Nav.Link>}
            {isAuth == true && <Nav.Link as={Link} to="/profile">Profile</Nav.Link>}
            {isAuth == true && <Nav.Link as={Link} to="/event">Events</Nav.Link>}
            {isAuth == true && <Nav.Link as={Link} to="/createEvent">Create Events</Nav.Link>}
          </Nav>
        </Container>
      </Navbar>
    );
  }
}

function FooterBar() {
  return (
    <footer id="footer-bar" className="page-footer font-small">
      <div className="footer-copyright text-center">
        <b>© CUthere</b>
      </div>
    </footer>
  );
}

function NoMatch() {
  let location = useLocation();
  return (
      <div>
          <h3>
              No match for <code>{location.pathname}</code>
          </h3>
      </div>
  );
}

export default App;
