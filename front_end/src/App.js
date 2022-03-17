import './App.css';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import {Home, About} from './home/homePage'
import {Login} from './home/loginPage'
import {Event} from './home/eventPage'


function App() {
  return (
    <div className="App">
      <h2>Hello World</h2>
      <BrowserRouter>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link>
        <Link to="/event">Events</Link>
        <hr/>
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

export default App;
