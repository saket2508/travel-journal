import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

export default function Home(){
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
      <div className="header">
      <div className="navbar navbar-light bg-header">
        <div className="container-fluid">
          <h5 className="header-title">
            Travel App
          </h5>
          <div className="d-flex">
              <button className="btn btn-primary shadow-none">Sign in</button>
          </div>
        </div>
      </div>
    </div>
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
        anchor="top" >
        <div>You are here.</div>
      </Popup>}
    </ReactMapGL>
   </div>
   </>
    )
}