import './App.css';
import {BrowserRouter, Routes, Route, useLocation, Link} from 'react-router-dom'
import {Home, About} from './home/homePage'
import {LoginWithNavigate} from './home/loginPage'
import {Event} from './home/eventPage'
import { SignUpWithNavigate } from  './home/signUpPage'
import { ForgotPw } from './home/forgotPwPage';
// import { Navbar, Container, Nav } from 'react-bootstrap';
import Profile from './home/myProfile';
import authService from './services/auth.service';
import React from 'react';
import Modal from 'react-modal';

// Imports from Component
import Calendar from "./Components/Calendar";

import {CreateEvent} from "./home/createEventPage";
import { Confirm } from './home/confirm';
import { NavDropdown } from 'react-bootstrap';
import {Help} from './home/helpPage';
import {EditProfile} from './user/editProfile';
import {AccountSetting} from './user/accountSetting';
import { Image } from 'react-bootstrap';
import UserIcon from './user/userProfile.png';
import LandingPage from './home/LandingPage';
import ProfileScreen from './home/EditProfile';
import { PasswordReset } from './home/passwordReset';
import { Nav, NavLink,Bars, NavMenu, NavBtn, NavBtnLink, Footer} from './NavBarStyle';
import logo from './logo.jfif';

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
    let username =  (authService.getCurrentUser())? authService.getCurrentUser().user.username : "Not logged in";
    return (
      <div className="App">
        <BrowserRouter>
          <NavigationBar isAuthUser={(currentUser !== undefined)} username={(username)} />
          
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/login' element={<LoginWithNavigate/>} />
            {currentUser !== undefined && <Route path='/event' element={<Event/>} />}
            <Route path='/signup' element={<SignUpWithNavigate/>} />
            <Route path='/logout' element={<this.handleLogout/>} />
            {currentUser !== undefined && <Route path='/profile' element={<Profile/>} />}
            <Route path='/forgotpw' element={<ForgotPw/>} />
            <Route path='/api/auth/passwordreset/:sid/:token' element={<PasswordReset/>} />
            <Route path='/api/auth/confirmation/:sid/:token' element={<Confirm/>} />
            {currentUser !== undefined && <Route path='/calendar' element={<Calendar/>} />}
            {currentUser !== undefined && <Route path='/createEvent' element={<CreateEvent/>} />}
            {currentUser !== undefined && <Route path='/editProfile' element={<ProfileScreen/>} />}
            {currentUser !== undefined && <Route path='/accountSetting' element={<AccountSetting/>} />}
            <Route path='/help' element={<Help/>} />
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
      <Nav>
        <NavLink to='/'>
          {/* <img src={logo} alt='logo' /> */}
          CUthere
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to="/about">About</NavLink>
          {isAuth === true && <NavLink to="/event">Events</NavLink>}
          {isAuth === true && <NavLink to="/createEvent">Create Events</NavLink>}
          {isAuth === true && <NavLink to="/calendar">View Calendar</NavLink>}
          {isAuth === true && 
          <NavDropdown title={"Hello, " + this.props.username} id="user-profile-dropdown">
              <NavDropdown.Item as={Link} to="/editProfile">Edit Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/profile">View Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/accountSetting">Account Setting</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/logout">Logout</NavDropdown.Item>
          </NavDropdown>}
          {isAuth !== true && <NavLink to="/signup">Sign Up</NavLink>}
        </NavMenu>
        <NavBtn>
          {isAuth !== true && <NavBtnLink to="/login">Login</NavBtnLink>}
        </NavBtn>
      </Nav>
    );
  }
}

function FooterBar() {
  return (
    // <footer id="footer-bar" className="page-footer font-small">
    //   <div className="footer-copyright text-center">
    //     <b>© CUthere</b>
    //   </div>
    // </footer>
    <Footer>
      © CUthere
    </Footer>
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
