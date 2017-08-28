import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import keyBoardNavConfigs from './keyBoardNavConfigs.js';

export default class KeyBoardComponent extends React.Component {
  constructor (props) {
    super(props);
    this.focusableEls = null;
  }

  componentDidMount() {
    this.focusableEls = Array.from(
        ReactDOM.findDOMNode(this).getElementsByClassName(keyBoardNavConfigs.kbItemClassName));
    this.focusableEls.forEach((item) => {
      item.addEventListener(keyBoardNavConfigs.enterEventName, this.handleKbEnterEvent)
    });
  }

  componentWillUnmount() {
    this.focusableEls.forEach((item) => {
      item.removeEventListener(keyBoardNavConfigs.enterEventName, this.handleKbEnterEvent)
    });
  }

  handleKbEnterEvent (e) {}
}

class MovieRow extends KeyBoardComponent {

  handleKbEnterEvent (foo) {
    alert('action fired');
  }

  render() {
    const movieItems = this.props.movieItems;
    const listMarkup = movieItems.items.map((item, index) =>
          <div className={"movie-item" + keyBoardNavConfigs.kbItemClassName} key={index}>
            <a href="#">
              <div className="movie-image-wrapper">
                <img src={item.imgSrc} alt="Poster image for {item.name}" className="movie-img"/>
              </div>
              <div className="movie-info">
                <h3 className="movie-name">{item.name}</h3>
                <span className="movie-cate">{item.category}</span>
              </div>
            </a>
          </div>
        );
    return (
      <div className={"movie-row-container" + keyBoardNavConfigs.containerClassName} data-orientation="horizontal" data-prev-head-action="circulate" data-next-tail-action="circulate">
        <h3>{movieItems.header}</h3>
        <p>{movieItems.caption}</p>
        <div className="listItem-group">
          {listMarkup}
        </div>
      </div>
    );
  }
}