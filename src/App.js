import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Movie extends Component {
  render(){
    return (
      <div>{this.props.title}</div>
    );
  }
}

class MoviePane extends Component {
  render() {
    const movies = this.props.movies ?  this.props.movies.map ((movie, i) => {
        return (<Movie key={i} title={movie.title}></Movie>);
    }) : "no movies";
    return (
     <div>
       {movies}
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {movies: null}
  } 
  
  getMoviesFromApiAsync() {
    return fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.movies;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async componentDidMount() {
    this.setState({movies: await this.getMoviesFromApiAsync()});
  }


 render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Movies</h2>
        </div>
         <MoviePane
            movies={this.state.movies}/>
      </div>
    );
  }
}

export default App;
