import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import  {AuthContext}  from "../context/AuthContext";
import { Link } from "react-router-dom";
import RoomIcon from '@material-ui/icons/Room';

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

    const [savedPins, setSavedPins] = useState([])

    const [currentPlaceID, setCurrentPlaceID] = useState()
    const [newPlace, setNewPlace] = useState()

    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 40.7128,
        longitude: -74.0060,
        zoom: 8
      });
    const [showPopup, togglePopup] = useState(true);


    const handleAddClick = (e) => {
      const [longitude, latitude] = e.lngLat;
      setNewPlace({
        lat: latitude,
        long: longitude,
      });
    };

    return(
        <>
      {currentUser ? <AppHeaderAuthorized/> : <AppHeaderUnauthorized/>} 
   <div className="map">
   <ReactMapGL
    {...viewport}
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
    onViewportChange={nextViewport => setViewport(nextViewport)}
    mapStyle="mapbox://styles/saket2000/ckogj12k43r0r17ol04ixk9ye"
    onDblClick={currentUser && handleAddClick}
      > 
      <Marker
        latitude={40.712}
        longitude={-74.006}
        offsetLeft={-20}
        offsetTop={-10}
      >
        <RoomIcon style={{color:'slateblue', fontSize:viewport.zoom*7}}/>
      </Marker>
       {showPopup && <Popup
       latitude={40.712}
       longitude={-74.006}
        closeButton={true}
        closeOnClick={false}
        onClose={() => togglePopup(false)}
        anchor="left" >
        <div className="card-map">
          <div className="place">
            <div className="small">Place</div>
            <h6>New York City</h6>
          </div>
          <div className="description">
            <div className="small">When did you visit?</div>
            <h6>Have never been there, sadly :(</h6>
          </div>
          <div className="description">
            <div className="small">Experiences/memories of this place</div>
            <h6>None since I have never visited NYC. I wish I get the chance to make many though.</h6>
          </div>
        </div>
      </Popup>}
    </ReactMapGL>
   </div>
   </>
    )
}