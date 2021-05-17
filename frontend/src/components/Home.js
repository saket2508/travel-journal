import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import  {AuthContext}  from "../context/AuthContext";
import { Link } from "react-router-dom";
import RoomIcon from '@material-ui/icons/Room';
import Axios from "axios";

function AppHeader(props){
  const {currentUser, SignOut} = props
  return(
    <div className="header">
      <div className="navbar navbar-light bg-header">
        <div className="container-fluid d-flex align-items-center">
          <h5 className="navbar-brand header-title">
            My Travel Diary
          </h5>
          {currentUser ? 
          <Link to="/login">
            <button onClick={() => SignOut()} className="btn btn-primary border-0 shadow-none">LOG OUT</button>
          </Link>
          :  
          <Link to="/login">
            <button className="btn btn-primary border-0 shadow-none">SIGN IN</button>
          </Link>}
        </div>
      </div>
    </div>
  )
}

export default function Home(){

    const {currentUser, setCurrentUser} = useContext(AuthContext)

    const [savedPins, setSavedPins] = useState([])
  
    const [alert, setAlert] = useState()

    // State data for creating a new pin
    const [newPlace, setNewPlace] = useState()
    const [placeName, setPlaceName] = useState()
    const [memories, setMemories] = useState()

    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 40.7128,
        longitude: -74.0060,
        zoom: 8
      });

    const handleAddClick = (e) => {
      const [longitude, latitude] = e.lngLat;
      setNewPlace({
        lat: latitude,
        long: longitude,
      });
    };

    useEffect(() => {
      if(currentUser){
        Axios({
          method:'GET',
          url:`/api/pins/${currentUser}`,
          withCredentials:false,
        }).then(res => res.data)
        .then(data => {
          const {pins, success, message} = data
          if(success){
            setAlert({'message': message, 'success':success})
            console.log('Retrieved saved pins. ')
            setSavedPins(pins)
          }
          else{
            setAlert({'message': message, 'success':success})
            console.log('There was a problem getting data from the server. Try again after some time.')
          }
        }).catch(err => {
          console.log(err.message)
          setAlert({'message':'There was a problem getting data from the server. Try again after some time.', success:false})
        })
      }
    }, [currentUser])


    const SubmitPinData = e => {
      e.preventDefault()
      Axios({
        method:'POST',
        url:"/api/pins",
        withCredentials:false,
        data:{
          user:currentUser,
          place:placeName,
          lat:newPlace.lat,
          long: newPlace.long,
          memories: memories
        },
      }).then(res => res.data)
      .then(data => {
        const {pin, success, message} = data
        if(success){
          setAlert({'message': message, 'success':success})
          console.log('Saved pin')
          setSavedPins([...savedPins, pin])
        }
        else{
          setAlert({'message': message, 'success':success})
          console.log('There was a problem getting data from the server. Try again after some time.')
        }
      }).catch(err => {
        console.log(err.message)
        setAlert({'message':'There was a problem getting data from the server. Try again after some time.', success:false})
      })
    }


    const SignOut = () => {
      localStorage.removeItem('user')
      setCurrentUser(null);
    }

    
    return(
        <>
      <AppHeader currentUser={currentUser} SignOut={SignOut}/>
   <div className="map">
   <ReactMapGL
    {...viewport}
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
    onViewportChange={nextViewport => setViewport(nextViewport)}
    mapStyle="mapbox://styles/saket2000/ckogj12k43r0r17ol04ixk9ye"
    onDblClick={currentUser && handleAddClick}
      > 
      {/* <Marker
        latitude={40.712}
        longitude={-74.006}
        offsetLeft={-20}
        offsetTop={-10}
      >
        <RoomIcon style={{color:'slateblue', fontSize:viewport.zoom*5}}/>
      </Marker>
       {showPopup && <Popup
       latitude={40.712}
       longitude={-74.006}
        closeButton={true}
        closeOnClick={false}
        onClose={() => togglePopup(false)}
        anchor="bottom" >
        <div className="card-map">
          <div className="place">
            <div className="small text-muted label">Place</div>
            <h6>New York City</h6>
          </div>
          <div className="description">
            <div className="small text-muted label">When did you visit?</div>
            <h6>Never</h6>
          </div>
          <div className="description">
            <div className="small text-muted label">Experiences/memories/future plans for this place</div>
            <h6>Would love to see New York if I ever get the opportunity in future.</h6>
          </div>
        </div>
      </Popup>} */}

      {newPlace && (
        <>
        <Marker
          latitude={newPlace.lat}
          longitude= {newPlace.long}
        >
          <RoomIcon style={{color:'tomato', cursor:'pointer', fontSize:viewport.zoom*5}} />
        </Marker>
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
          anchor="left"
        >
          <div className="card-map">
            <form className="p-1" onSubmit={SubmitPinData}>
                <div className="mb-2">
                  <label for="inputPlaceName" className="form-label small text-muted label">Place</label>
                  <input type="text" value={placeName} onChange={e => setPlaceName(e.target.value)} class="form-control form-control-sm border-0 shadow-none outline-none semibold-text" id="inputPlaceName" placeholder="Name of the place"></input>
                </div>
                <div className="mb-1">
                  <label for="inputMemories" className="form-label small text-muted label">Memories/Experiences/Future plans</label>
                  <textarea rows="5" value={memories} onChange={e => setMemories(e.target.value)} class="form-control form-control-sm shadow-none border-0 outline-none semibold-text" id="inputMemories" placeholder="Funny incidents you recall from this place. Or maybe something special and memorable that you are going to hold on to forever."></textarea>
                </div>
                <div className="mt-2">
                  <button style={{backgroundColor:'tomato'}} className="btn btn-sm shadow-none border- outline-none text-white">ADD LOCATION</button>
                </div>
            </form>
          </div>
        </Popup>
        </>
      )}
    </ReactMapGL>
   </div>
   </>
    )
}