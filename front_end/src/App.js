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

// Imports from calendar
import Calendar from "./calendar/Calendar";

import {CreateEvent} from "./event/createEventPage";
import { ConfirmEmail } from './home/confirmEmail';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import {Help} from './home/helpPage';
import EventDetail from './event/EventDetail';
import {AccountSetting} from './user/accountSetting';
import { Image } from 'react-bootstrap';
import UserIcon from './images/userProfile.png';
import LandingPage from './home/LandingPage';
import { PasswordReset } from './home/passwordReset';
import logo from './images/logo.jfif';
import { AdminDashboard } from './admin/adminPage';
import {UploadImage} from './event/uploadImg';
import ViewProfile from './user/viewProfile';


Modal.setAppElement("#root");
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
          
          <Routes>
            {currentUser === undefined && <Route path="/" element={<LandingPage/>} />}
            {currentUser !== undefined && <Route path='/' element={<Home/>} />}
            <Route path='/about' element={<About/>} />
            <Route path='/login' element={<LoginWithNavigate/>} />
            {currentUser !== undefined && <Route path='/event' element={<Event/>} />}
            {currentUser !== undefined && <Route path='/featured/:type' element={<Featured/>} />}
            <Route path='/signup' element={<SignUpWithNavigate/>} />
            <Route path='/logout' element={<this.handleLogout/>} />
            {currentUser !== undefined && <Route path='/profile' element={<Profile/>} />}
            <Route path='/forgotpw' element={<ForgotPw/>} />
            <Route path='/api/auth/passwordreset/:sid/:token' element={<PasswordReset/>} />
            <Route path='/api/auth/confirmation/:sid/:token' element={<ConfirmEmail/>} />
            {currentUser !== undefined && <Route path='/calendar' element={<Calendar/>} />}
            
            {currentUser !== undefined && <Route path='/event/:id' element={<EventDetail/>} />}
            {currentUser !== undefined && <Route path='/createEvent' element={<CreateEvent/>} />}
            {currentUser !== undefined && <Route path='/accountSetting' element={<AccountSetting/>} />}
            {isAdmin && <Route path='/admin' element={<AdminDashboard/>} />}
            <Route path='/upload' element={<UploadImage/>} />
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

  constructor(props) {
    super(props);
  }

  render () {
    let isAuth = this.props.isAuthUser;
    let isAdmin = this.props.isAdmin;
    return (
      <>
      <Container>
        <Navbar className="justify-content-center" collapseOnSelect fixed='top' expand='sm' bg='dark' variant='dark'>
          <Container >
            <Navbar.Brand href="/">CUthere</Navbar.Brand>
            <Navbar.Toggle className="container-fluid" aria-controls='responsive-navbar-nav'/>
            <Navbar.Collapse id='responsive-navbar-nav'>
              <Nav>
                <Nav.Link href='/about'>About</Nav.Link>
                {isAuth === true && <Nav.Link href='/event'>Events</Nav.Link>}
                {isAuth === true && <Nav.Link href='/createevent'>Create Events</Nav.Link>}
                {isAuth === true && <Nav.Link href='/calendar'>View Calendar</Nav.Link>}
                {isAuth === true && isAdmin && <Nav.Link href='/admin'>Admin Dashboard</Nav.Link>}
                {isAuth === true && 
                  <NavDropdown title={"Hello, " + this.props.username} id="user-profile-dropdown">
                      <NavDropdown.Item href="/profile">View Profile</NavDropdown.Item>
                      <NavDropdown.Item href="/accountSetting">Account Setting</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                  </NavDropdown>}
                {isAuth !== true && <Nav.Link href='/signup'>Sign Up</Nav.Link>}
              </Nav>
              {isAuth !== true && 
                <Nav className="ms-auto"> 
                  <Nav.Link href='/login'><Button>Login</Button></Nav.Link>
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
  return (
    <footer class="footer mt-auto py-3 bg-light">
      <div class="container">
        <span class="text-muted">© CUthere 2022</span>
      </div>
    </footer>
  );
}

function NoMatch() {
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
