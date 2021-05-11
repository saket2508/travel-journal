import React, { useContext } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
  return (
    <Router>
      <Route exact path = "/" component = {Home}/>
      <Route exact path = "/login" component = {SignIn}/>
      <Route exact path = "/register" component = {SignUp}/>
    </Router>
  );
}

export default App;