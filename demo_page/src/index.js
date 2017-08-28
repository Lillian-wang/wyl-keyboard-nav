import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {wylKeyboardNav} from './wylKeyboardNav';
import keyBoardNavConfigs from './keyBoardNavConfigs.js';
import './index.css';


ReactDOM.render(
  <App />,
  document.getElementById('root')
);

document.addEventListener("DOMContentLoaded", (e) => {
  wylKeyboardNav.init(keyBoardNavConfigs);
});