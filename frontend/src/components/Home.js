import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import  {AuthContext}  from "../context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import RoomIcon from '@material-ui/icons/Room';
import Axios from "axios";

function AppHeader(props){

  let history = useHistory()

  const {currentUser, SignOut} = props
  return(
    <div style={{position:'relative'}} className="header">
      <div className="navbar navbar-light bg-header">
        <div className="container-fluid align-items-center">
          <h6 className="navbar-brand header-title">
            My Travel Diary
          </h6>
          {currentUser ? 
            <button onClick={() => {
              SignOut()
              history.push('/login')
            }} className="btn btn-primary border-0 shadow-none">LOG OUT</button>
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

    // current logged in user
    const {currentUser, setCurrentUser} = useContext(AuthContext)

    // pins saved by user
    const [savedPins, setSavedPins] = useState([])
  
    // User prompt message
    const [alert, setAlert] = useState()

    // triggers when pin form data is submitted
    const [loading, setLoading] = useState(false)

    // triggers popup for any saved pin
    const [showPopup, setShowPopup] = useState(null)

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
            // setAlert({'message': message, 'success':success})
            // console.log('Retrieved saved pins. ')
            setSavedPins(pins)
          }
          else{
            setAlert({'message': message, 'success':success})
            // console.log('There was a problem getting data from the server. Try again after some time.')
          }
        }).catch(err => {
          // console.log(err.message)
          setAlert({'message':'There was a problem getting data from the server. Try again after some time.', success:false})
        })
      }
    }, [currentUser])


    const SubmitPinData = e => {
      setLoading(true)
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
          // console.log('Saved pin')
          setSavedPins([...savedPins, pin])
          setLoading(false)
          setNewPlace()
          setPlaceName()
          setMemories()
        }
        else{
          setAlert({'message': message, 'success':success})
          setLoading(false)
          // console.log('There was a problem getting data from the server. Try again after some time.')
        }
      }).catch(err => {
        setLoading(false)
        // console.log(err.message)
        setAlert({'message':'There was a problem getting data from the server. Try again after some time.', success:false})
      })
    }


    const SignOut = () => {
      if(localStorage.getItem('uid')){
        localStorage.removeItem('uid')
      }
      setCurrentUser(null);
      // console.log('Signed out')
    }

    
    return(
   <div className="map">
   <AppHeader currentUser={currentUser} SignOut={SignOut}/>
   <ReactMapGL
    {...viewport}
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
    onViewportChange={nextViewport => setViewport(nextViewport)}
    mapStyle="mapbox://styles/saket2000/ckogj12k43r0r17ol04ixk9ye"
    onDblClick={currentUser && handleAddClick}
      > 
      {savedPins && savedPins.map((pin, index) => {
        return(
          <>
            <Marker
              key={index}
              latitude={pin.lat}
              longitude={pin.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
              on
            >
              <RoomIcon onClick={() => setShowPopup(pin)} style={{color:'tomato', fontSize:viewport.zoom*7}}/>
            </Marker>
            {showPopup && <Popup
              latitude = {showPopup.lat}
              longitude = {showPopup.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setShowPopup(null)}
              anchor="top"
            >
              <div className="card-map">
              <div className="place">
                <div style={{color:'tomato'}} className="small label">Place</div>
                  <h6>{showPopup.place}</h6>
                </div>
                <div className="description">
                  <div style={{color:'tomato'}} className="small label">Experiences/memories/future plans for this place</div>
                  <h6>{showPopup.memories}</h6>
                </div>
              </div>  
            </Popup>}
          </>
        )
      })}

      {newPlace && (
        <>
        <Marker
          latitude={newPlace.lat}
          longitude= {newPlace.long}
          offsetLeft={-3.5 * viewport.zoom}
          offsetTop={-7 * viewport.zoom}
        >
          <RoomIcon style={{color:'tomato', cursor:'pointer', fontSize:viewport.zoom*7}} />
        </Marker>
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => {
            setNewPlace(null)
            setPlaceName()
            setMemories()
          }}
          anchor="top"
        >
          <div className="card-map">
            <form className="p-1" onSubmit={SubmitPinData}>
                <div className="mb-2">
                  <label style={{color:'tomato'}} for="inputPlaceName" className="form-label small label">Place</label>
                  <input type="text" value={placeName} onChange={e => setPlaceName(e.target.value)} class="form-control form-control-sm border-0 shadow-none outline-none semibold-text" id="inputPlaceName" placeholder="Name of the place" required></input>
                </div>
                <div className="mb-1">
                  <label style={{color:'tomato'}} for="inputMemories" className="form-label small label">Memories/Experiences/Future plans</label>
                  <textarea rows="5" value={memories} onChange={e => setMemories(e.target.value)} class="form-control form-control-sm shadow-none border-0 outline-none semibold-text" id="inputMemories" placeholder="Funny incidents you recall from this place. Or perhaps something special or memorable that you are going to hold on to forever." required></textarea>
                </div>
                <div className="mt-2">
                  {loading===false ? <button style={{backgroundColor:'tomato'}} className="btn btn-sm shadow-none border-0 outline-none text-white">ADD PIN</button>
                  :   <button style={{backgroundColor:'tomato'}} className="btn btn-sm shadow-none border-0 outline-none text-white" disabled>ADDING PIN</button>
                }
                </div>
            </form>
          </div>
        </Popup>
        </>
      )}
    </ReactMapGL>

    {alert && <div style={{position:'absolute', bottom:20, left:0, right:0, marginLeft:0, marginRight:0 }}>
    <div className="mx-auto col-10 col-sm-4">
    {alert.success===false ? <div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>{alert.message}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlert()}></button>
    </div>
    :   <div class="alert alert-success alert-dismissible fade show" role="alert">
    <strong>{alert.message}</strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlert()}></button>
  </div>
  }
  </div>
    </div>}

   </div>
    )
}