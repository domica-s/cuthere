import './App.css';
import {BrowserRouter, Routes, Route, useLocation, Link} from 'react-router-dom'
import {Home, About} from './home/homePage'
import {LoginWithNavigate} from './home/loginPage'
import {Event} from './home/eventPage'
import { SignUpWithNavigate } from  './home/signUpPage'
import { ForgotPw } from './home/forgotPwPage';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Profile from './home/myProfile';
import authService from './services/auth.service';
import React from 'react';
import Modal from 'react-modal';
import Calendar from "./Components/Calendar";
import {CreateEvent} from "./home/createEventPage";
import { NavDropdown } from 'react-bootstrap';
import {Help} from './home/helpPage';
import {EditProfile} from './user/editProfile';
import {AccountSetting} from './user/accountSetting';
import { Image } from 'react-bootstrap';
import UserIcon from './user/userProfile.png';

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
    return (
      <div className="App">
        <BrowserRouter>
          <NavigationBar isAuthUser={(currentUser !== undefined)} />
          
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/login' element={<LoginWithNavigate/>} />
            {currentUser !== undefined && <Route path='/event' element={<Event/>} />}
            <Route path='/signup' element={<SignUpWithNavigate/>} />
            <Route path='/logout' element={<this.handleLogout/>} />
            <Route path='/profile' element={<Profile/>} />
            <Route path='/forgotpw' element={<ForgotPw/>} />
            {currentUser !== undefined && <Route path='/calendar' element={<Calendar/>} />}
            {currentUser !== undefined && <Route path='/createEvent' element={<CreateEvent/>} />}
            {currentUser !== undefined && <Route path='/editProfile' element={<EditProfile/>} />}
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
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
          CUthere
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            {isAuth !== true && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
            {isAuth !== true && <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>}
            {isAuth === true && <Nav.Link as={Link} to="/logout">Logout</Nav.Link>}
            {isAuth === true && <Nav.Link as={Link} to="/profile">Profile</Nav.Link>}
            {isAuth === true && <Nav.Link as={Link} to="/event">Events</Nav.Link>}
            {isAuth === true && <Nav.Link as={Link} to="/calendar">View Calendar</Nav.Link>}
            {isAuth === true && <Nav.Link as={Link} to="/createEvent">Create Events</Nav.Link>}
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/help">Help</Nav.Link>
            {isAuth === true && <NavDropdown title={
              <Image src={UserIcon} alt='' roundedCircle style={{ width: '25px' }}/>} id="user-profile-dropdown">
              <NavDropdown.Item as={Link} to="/editProfile">Edit Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/profile">View Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/accountSetting">Account Setting</NavDropdown.Item>
              </NavDropdown>}
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
