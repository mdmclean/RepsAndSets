import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Workout extends Component {
  render(){
    return (
      <div>Workout on {this.props.timestamp}</div>
    );
  }
}

class WorkoutPane extends Component {
  render() {
    const workouts = this.props.workouts ?  this.props.workouts.map ((workout, i) => {
        return (<Workout key={i} timestamp={workout.Timestamp}></Workout>);
    }) : "no workouts";
    return (
     <div>
       {workouts}
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {workouts: null}
  } 
  
  getWorkoutsForUserAsync() {
    return fetch('http://localhost:17234/api/workout?userId=1')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async componentDidMount() {
    this.setState({workouts: await this.getWorkoutsForUserAsync()});
  }

  async newWorkout()
  {
    fetch('http://localhost:17234/api/workout?userId='+1+"&workoutDate="+ (new Date()).toJSON(), {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})
   this.setState({workouts: await this.getWorkoutsForUserAsync()});

  }


 render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Workouts</h2>
        </div>
        <button className="square" onClick={() => this.newWorkout()}>New workout</button>
         <WorkoutPane
            workouts={this.state.workouts}/>
      </div>
    );
  }
}

export default App;
