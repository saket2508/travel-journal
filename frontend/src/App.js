import React from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from "./components/Home";

function App() {
  
  return (
    <Router>
      <Route exact path = "/" component = {Home}/>
    </Router>
  );
}

export default App;