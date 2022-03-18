import './App.css';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import {Home, About} from './home/homePage'
import {Login} from './home/loginPage'
import {Event} from './home/eventPage'
import { Navbar, Container, Nav } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          {/* <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
          <Link to="/event">Events</Link>
          <hr/> */}
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/event' element={<Event/>} />
        </Routes>
      </BrowserRouter>
    </div>    
  );
}


function NavigationBar() {
  return (
  <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand href="/" Link to="/home">
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
        <Nav.Link href="/about" Link to="/about">About</Nav.Link>
        <Nav.Link href="/login" Link to="/login">Login</Nav.Link>
        <Nav.Link href="/event" Link to="/event">Events</Nav.Link>
      </Nav>
    </Container>
  </Navbar>
  );
}

export default App;
