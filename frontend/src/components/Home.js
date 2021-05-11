import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import  {AuthContext}  from "../context/AuthContext";
import { Link } from "react-router-dom";

function AppHeaderAuthorized(){
  return(
    <div className="header">
      <div className="navbar navbar-light bg-header">
        <div className="container-fluid d-flex align-items-center">
          <h5 className="header-title">
            My Travel Diary
          </h5>
            <button className="btn btn-primary border-0 shadow-none">Log out</button>
        </div>
      </div>
    </div>
  )
}

function AppHeaderUnauthorized(){
  return(
    <div className="header">
      <div className="navbar navbar-light bg-header">
        <div className="container-fluid d-flex align-items-center">
          <h5 className="header-title">
            My Travel Diary
          </h5>
          <Link to="/login">
            <button className="btn btn-primary border-0 shadow-none">Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Home(){

    const {currentUser, setCurrentUser} = useContext(AuthContext)
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8
      });
    const [showPopup, togglePopup] = useState(true);

    return(
        <>
      {currentUser ? <AppHeaderAuthorized/> : <AppHeaderUnauthorized/>} 
   <div className="map">
   <ReactMapGL
    {...viewport}
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
    onViewportChange={nextViewport => setViewport(nextViewport)}
    mapStyle="mapbox://styles/saket2000/ckogj12k43r0r17ol04ixk9ye"
      > 
       {showPopup && <Popup
        latitude={37.78}
        longitude={-122.41}
        closeButton={true}
        closeOnClick={false}
        onClose={() => togglePopup(false)}
        anchor="left" >
        <div>You are here.</div>
      </Popup>}
    </ReactMapGL>
   </div>
   </>
    )
}