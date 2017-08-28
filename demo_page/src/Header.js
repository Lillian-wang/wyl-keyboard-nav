import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import keyBoardNavConfigs from './keyBoardNavConfigs.js';
import moviesInfo from './moviesInfo.js';

export default function Header(props) {
  console.log('kb:', keyBoardNavConfigs);
  const headerItems = moviesInfo.movieHeader;
  const menuMarkup = headerItems.map((item, index) => 
      <li className={keyBoardNavConfigs.kbItemClassName + (index == 0 ? ' focus selected' : '')} key={index}>
         {item}
      </li>
  );  
  return (
    <div className="header-container clickable-container" data-prev-container-action="stop" data-prev-head-action="goto-following-container" data-orientation="horizontal">
      <h3 className="nav-point movie-logo">
        <span>Movies & TV</span>
      </h3>
      <ul className="listItem-group">
        {menuMarkup}
      </ul>
    </div>
  );
}