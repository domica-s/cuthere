import './App.css';
import {BrowserRouter, Routes, Route, useLocation, Link} from 'react-router-dom'
import {Home, About} from './home/homePage'
// import {Login} from './home/loginPage'
import {Event} from './home/eventPage'
import { SignUp } from './home/signUp';
import { ForgotPw } from './home/forgotPwPage';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path='/about' element={<About/>} />
          {/* <Route path='/login' element={<Login/>} /> */}
          <Route path='/event' element={<Event/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/forgotpw' element={<ForgotPw/>} />
          <Route path='/*' element={<NoMatch/>} />
        </Routes>
        <FooterBar />
      </BrowserRouter>
    </div>    
  );
}


function NavigationBar() {
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
          {/* <Nav.Link as={Link} to="/login">Login</Nav.Link> */}
          <Nav.Link as={Link} to="/event">Events</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
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
