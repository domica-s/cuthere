// The program for managing the routes of the frontend
// PROGRAMMER: CUthere team
// The program is called by index.js
// Revised on 5/5/2022

import './App.css';
import {BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import {Home, About} from './home/homePage'
import {LoginWithNavigate} from './home/loginPage'
import {Event} from './event/eventPage'
import {Featured} from './event/featuredPage'
import { SignUpWithNavigate } from  './home/signUpPage'
import { ForgotPw } from './home/forgotPwPage';
import Profile from './user/myProfile';
import authService from './services/auth.service';
import React from 'react';
import Modal from 'react-modal';

import Calendar from "./calendar/Calendar";

import {CreateEvent} from "./event/createEventPage";
import { ConfirmEmail } from './home/confirmEmail';
import { Navbar, Container, Nav, NavDropdown, Button, Col } from 'react-bootstrap';
import {Help} from './home/helpPage';
import EventDetail from './event/EventDetail';
import {AccountSetting} from './user/accountSetting';
import { Image } from 'react-bootstrap';
import LandingPage from './home/LandingPage';
import { PasswordReset } from './home/passwordReset';
import { AdminDashboard } from './admin/adminPage';
import {UploadImage} from './event/uploadImg';
import ViewProfile from './user/viewProfile';
import AboutUs from './home/aboutPage';


Modal.setAppElement("#root");
class App extends React.Component {
                                          /*
        This is a class component which is used to render and handle all the components related to this app
        The component is the central directory for this app
    */

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
                            /*
        This function is called to log the user out of the app
        The program is called whenever the uses clicks log out
    */
    const user = authService.getCurrentUser();

    if (user) {
      localStorage.removeItem("user");
      localStorage.setItem("isAuthenticated", false);

      this.setState({
        currentUser: undefined
      });
    }
    window.history.replaceState({}, '','/login');

    return <LoginWithNavigate/>
  }

  render() {
    const { currentUser } = this.state;
    let username =  (authService.getCurrentUser())? authService.getCurrentUser().username : "Not logged in";
    let isAdmin = (authService.getCurrentUser() && (authService.getCurrentUser().role=== "Admin"))? true: false;

    return (
      <div className="App">
        <BrowserRouter>
          <div className="content">
          <div className="content-inside">
          <NavigationBar isAuthUser={(currentUser !== undefined)} username={(username)} isAdmin={(isAdmin)} />
          <br />
          <Routes>
            {currentUser === undefined && <Route path="/" element={<LandingPage/>} />}
            {currentUser !== undefined && <Route path='/' element={<Home/>} />}
            <Route path='/about' element={<AboutUs/>} />
            {/* <Route path='/login' element={<LoginWithNavigate/>} /> */}
            {currentUser === undefined && <Route path="/login" element={<LoginWithNavigate/>} />}
            {currentUser !== undefined && <Route path='/event' element={<Event/>} />}
            {currentUser !== undefined && <Route path='/featured/:type' element={<Featured/>} />}
            {/* <Route path='/signup' element={<SignUpWithNavigate/>} /> */}
            {currentUser === undefined && <Route path="/signup" element={<SignUpWithNavigate/>} />}
            {/* <Route path='/logout' element={<this.handleLogout/>} /> */}
            {currentUser === undefined && <Route path="/logout" element={<this.handleLogout/>} />}
            {currentUser !== undefined && <Route path='/profile' element={<Profile/>} />}
            {/* <Route path='/forgotpw' element={<ForgotPw/>} /> */}
            {currentUser === undefined && <Route path="/forgotpw" element={<ForgotPw/>} />}
            <Route path='/api/auth/passwordreset/:sid/:token' element={<PasswordReset/>} />
            <Route path='/api/auth/confirmation/:sid/:token' element={<ConfirmEmail/>} />
            {currentUser !== undefined && <Route path='/calendar' element={<Calendar/>} />}
            {currentUser !== undefined && <Route path='/event/:id' element={<EventDetail/>} />}
            {currentUser !== undefined && <Route path='/createEvent' element={<CreateEvent/>} />}
            {currentUser !== undefined && <Route path='/accountSetting' element={<AccountSetting/>} />}
            {currentUser !== undefined && isAdmin && <Route path='/admin' element={<AdminDashboard/>} />}
            {/* <Route path='/upload' element={<UploadImage/>} /> */}
            {currentUser !== undefined && <Route path='/upload' element = {<UploadImage />} />}
            {currentUser !== undefined && <Route path='/user/:sid' element = {<ViewProfile />} />}
            <Route path='/help' element={<Help/>} />
            <Route path='/*' element={<NoMatch/>} />
          </Routes>
          </div>
          </div>
          <FooterBar />
        </BrowserRouter>
      </div>    
    );
  }
}

class NavigationBar extends React.Component {
                                          /*
        This is a class component which is used to render and handle functionalities of the nav bar within the app - the header part!
        The program is rendered throughout the usage of the app
    */

  constructor(props) {
    super(props);
  }

  render () {
    let isAuth = this.props.isAuthUser;
    let isAdmin = this.props.isAdmin;
    return (
      <>
      <Container>
        <Navbar className="justify-content-center nav-margins" fixed='top' expand='sm' bg='dark' variant='dark'>
          <Container >
            <Col>
            <Navbar.Brand href="/" className='push-CUTHERE-left'>CUthere</Navbar.Brand>
            </Col>
            <Navbar.Toggle className="container-fluid" aria-controls='responsive-navbar-nav'/>
            <Navbar.Collapse id='responsive-navbar-nav'>
              <Nav>
                <Col>
                <Nav.Link href='/about'>About</Nav.Link>
                </Col>
                <Col>
                {isAuth === true && <Nav.Link href='/event' style={{whiteSpace: 'nowrap'}}>Events</Nav.Link>}
                </Col>
                <Col>
                {isAuth === true && <Nav.Link href='/createevent' style={{whiteSpace: 'nowrap'}}>Create Events</Nav.Link>}
                </Col>
                <Col>
                {isAuth === true && <Nav.Link href='/calendar' style={{whiteSpace: 'nowrap'}}>View Calendar</Nav.Link>}
                </Col>
               
                {isAuth === true && <Col className='pull-user-left'>
                  <NavDropdown title={"Hello, " + this.props.username} id="user-profile-dropdown" className='push-user-right'>
                      <NavDropdown.Item href="/profile">View Profile</NavDropdown.Item>
                      <NavDropdown.Item href="/accountSetting">Account Setting</NavDropdown.Item>
                      {isAdmin && <NavDropdown.Item href='/admin' style={{whiteSpace: 'nowrap'}}>Admin Dashboard</NavDropdown.Item>}
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                  </NavDropdown>
                  </Col>}
                <Col>{isAuth !== true && <Nav.Link href='/signup' style={{whiteSpace: 'nowrap'}}>Sign Up</Nav.Link>}</Col>
              </Nav>
              {isAuth !== true && 

                <Nav className="ms-auto"> 
                  {/* <div className='push-login-right'> */}
                  <Nav.Link href='/login'><Button >Login</Button></Nav.Link>
                  {/* </div> */}

                </Nav>}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>
      </>
    );
  }
}

function FooterBar() {
                                          /*
        This is a functional component used to render the footer of the app 
        The program is rendered throughout the usage of the app
    */
  return (
  <div className="footer-div">
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
        <span className="text-muted">© CUthere 2022</span>
      </div>
    </footer>
    </div>
  );
}

function NoMatch() {
                                      /*
        This is a functional component used to render a no match route
        The program is rendered when the user gets navigated to a route that's not found
    */
  let location = useLocation();
  return (
    <div className="form-group">
      <div className= "alert alert-danger" role="alert">
        Error 404: No match for <code>{location.pathname}</code>
      </div>
    </div>
  );
}

export default App;
