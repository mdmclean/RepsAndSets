import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FormGroup } from 'react-bootstrap';

function Workout(props) {
  return (
    <a href="#" onClick={() => props.onClick()}>Workout on {props.timestamp}</a>
  );
}

class WorkoutPane extends Component {
  render() {
    const workouts = this.props.workouts ? this.props.workouts.map((workout, i) => {
      return (<div key={i} ><Workout timestamp={workout.Timestamp} onClick={() => this.props.onClick(workout.Id)}></Workout><br /></div>);
    }) : "no workouts";
    return (
      <div>
        {workouts}
      </div>
    )
  }
}

class NewSetForm extends Component {
  constructor() {
    super();
    this.state = {
      exerciseId: 1,
      reps: 1,
      weightLb: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

    handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    this.props.submit(this.state.exerciseId, this.state.reps, this.state.weightLb)
        event.preventDefault();
  }

  render() {
    return (
      //https://facebook.github.io/react/docs/forms.html
            <form onSubmit={this.handleSubmit}>

        <FormGroup>
          <select name='exerciseId' value={this.state.exerciseId}  onChange={this.handleInputChange}>
            <option value='1'>Squat</option>
            <option value='2'>Bench</option>
            <option value='3'>Deadlift</option>
            <option value='5'>Row</option>
            <option value='6'>Face Pull</option>
          </select>
          <label>Weight(lb) 
            <input 
              name='weightLb' 
              min='0' 
              step='2.5' 
              type='number'
              value={this.state.weightLb}
              onChange={this.handleInputChange} />
          </label>
          <br />
          <label>Reps 
            <input
              name="reps"
              type="number"
              min='1'
              step='1'
              value={this.state.reps}
              onChange={this.handleInputChange} />
          </label>
        <input type="submit" value="Submit" />
        </FormGroup>
        </form>
    );
  }
}

class WorkoutDetailPane extends Component {

  constructor() {
    super();
    this.state = { openNewSetForm: false }
  }

  async newSet(workoutId, exerciseId, reps, weightLb) {
     await fetch('http://localhost:17234/api/set?workoutId='+workoutId+'&exerciseId='+exerciseId+'&setNumber='+0+'&weightLb='+weightLb+'&reps='+reps, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    this.props.onChange();
  }

  openNewSetForm() {
    const openNewSetFormOld = this.state.openNewSetForm;
    this.setState({ 
      openNewSetForm: !openNewSetFormOld,
    })
  }

  render() {
    const header = this.props.workout ? 'Workout #'+this.props.workout.Id : null;
    const workout = this.props.workout ? this.props.workout.Sets.map((set, i) => {
      return (<div key={i} > {set.ExerciseName} {set.WeightLb}lb x {set.Reps}</div>);
    }) : "no sets recorded";
    return (
      <div> <h2>{header}</h2>
        {workout} <br />
        <button onClick={() => this.openNewSetForm()}>
          {
            this.state.openNewSetForm === false ? 'New set' : 'Cancel new set'
          }
        </button>
        <br />
        {this.state.openNewSetForm === true &&
          <NewSetForm submit={(exerciseId, reps, weightLb) => this.newSet(this.props.workout.Id, exerciseId, reps, weightLb)} />
        }
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = { workouts: null }
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
    this.setState({ workouts: await this.getWorkoutsForUserAsync() });
  }

  async newWorkout() {
    fetch('http://localhost:17234/api/workout?userId=' + 1 + "&workoutDate=" + (new Date()).toJSON(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    this.setState({ workouts: await this.getWorkoutsForUserAsync() });
  }

  //int workoutId, int exerciseId, int setNumber, int weightLb, int Reps
  getWorkoutDetailAsync(workoutId) {
    return fetch('http://localhost:17234/api/workout?workoutId=' + workoutId)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async setSelectedWorkout(workoutId)
  {
    const workouts = this.state.workouts.slice();
    this.setState({ 
      workout: workouts,
      selectedWorkout: await this.getWorkoutDetailAsync(workoutId)
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Workouts</h2>
        </div>
        <button className="square" onClick={() => this.newWorkout()}>New workout</button>
        <WorkoutPane
          workouts={this.state.workouts} onClick={(workoutId) => this.setSelectedWorkout(workoutId)} />
        <WorkoutDetailPane workout={this.state.selectedWorkout} onChange={() => this.setSelectedWorkout(this.state.selectedWorkout.Id)} />
      </div>
    );
  }
}

export default App;
