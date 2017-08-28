import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import moviesInfo from './moviesInfo.js';
import SideNav from './SideNav.js';
import Header from './Header.js';
import MovieRow from './MovieRow.js';

class App extends Component {
  render() {
    const moviesInfoRow1 = moviesInfo.movieInfo1;
    const moviesInfoRow2 = moviesInfo.movieInfo2;
    return (
      <div id="demo-app">
        <SideNav/>
        <div className="movie-nav-container-wrapper">
          <Header/>
          <div className="movie-row-container-wrapper">
            <MovieRow movieItems = {moviesInfoRow1}/>
            <MovieRow movieItems = {moviesInfoRow2}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

