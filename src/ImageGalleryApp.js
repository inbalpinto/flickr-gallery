import React, { Component } from 'react';
import searchIcon from './assets/magnifying-glass.svg';
import './stylesheets/ImageGalleryApp.scss';

function Image(props) {
  return (
    <div className="imageWrapper">
      <img className="image" alt="gallery" src={props.src} />
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      searchText: "",
      page: 1,
    };
  }

  relodeImages() {
    const APIKey = 'bac9f1ccfd854f27894fd47c4f01b1e8'; // privacy
    const flickrURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&safe_search=1&format=json&nojsoncallback=1&api_key=" + APIKey + "&content_type=1&is_getty=1&page=" + this.state.page + "&text=" + this.state.searchText;

    fetch(flickrURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (j) {
        let imgArray = j.photos.photo.map((img, i) => {
          let srcPath = 'https://farm' + img.farm + '.staticflickr.com/' + img.server + '/' + img.id + '_' + img.secret + '.jpg';

          return <Image
            key={generateKey("img_wrapper", i)}
            src={srcPath}
            index={i} />;

        });
        this.setState({ images: imgArray });
      }.bind(this))
      .catch(function (ex) {
        console.log('failed', ex)
      });
  }


  handleSearchInputChange(e) {
    this.setState({ searchText: e.target.value });
  }

  delayKeyPress = (function () {
    let timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  handleSearchClick() {
    // this.relodeImages();
  }


  componentDidMount() {
    this.relodeImages();
  }

  render() {
    return (
      <div className="imageGalleryApp">
        <header className="galleryHeader">
          <a className="appLogo" href="https://venn.city/" target="_blank" rel="noopener noreferrer">
            <img className="vennLogo" alt="" src="https://venn.city/wp-content/uploads/elementor/thumbs/venn_logo_green-o0yceabxc1wkhlc95igjcpab509we8breb5p4fyffi.png" />
            <span className="appTitle">gallery</span>
          </a>
          <div className="searchBar">
            <input type="text" className="searchInput" placeholder="&nbsp;"
              onChange={this.handleSearchInputChange.bind(this)}
              onKeyUp={(e) => {
                const ms = (e.keyCode === 13 ? 0 : 200);
                this.delayKeyPress(function () {
                  this.relodeImages(); 
                }.bind(this), ms)
              }}></input>
            <span className="label">Search</span>
            <button className={"searchBtn" + (this.state.searchText.length !== 0 ? " notEmpty" : "")} onClick={this.handleSearchClick.bind(this)}>
              <img src={searchIcon} className="searchIcon" alt="logo" />
            </button>
            <span className="underline" />
          </div>
        </header>
        <div className="galleryContainer">
          {this.state.images}
        </div>
      </div>
    );
  }
}

export default App;

function generateKey(pre, i) {
  const formattedIndex = ("00" + i).slice(-3);
  return [pre, formattedIndex, new Date().getTime()].filter(Boolean).join("_");
}