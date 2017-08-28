import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import keyBoardNavConfigs from './keyBoardNavConfigs.js';
import KeyBoardComponent from './KeyBoardComponent.js';
import moviesInfo from './moviesInfo.js';

export default class SideNav extends KeyBoardComponent {

  handleKbEnterEvent(e) {
    alert('action fired');
  }

  render() {
    const naviationItems = moviesInfo.sideBar;
    const listMarkup = naviationItems.map((item, index) =>
      <li className={keyBoardNavConfigs.kbItemClassName} key={index}>
        {item}
      </li>
    );
    return (
      <div className="sidenav-container clickable-container" 
        data-next-tail-action="circulate"
        data-orientation="vertical"
        data-ignore-scroll-position="true">
        <ul className="listItem-group">
          {listMarkup}
        </ul>
      </div>
    );
  }
}
