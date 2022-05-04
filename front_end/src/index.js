// The program is the root of the react dom tree
// Programmer: Domica Santoso
// Revised on 5/5/2022

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'react-datetime/css/react-datetime.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


