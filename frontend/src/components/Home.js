import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import { IconButton } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone';
import  {AuthContext}  from "../context/AuthContext";
import indigo from '@material-ui/core/colors/indigo';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems:'center',
    '& > *': {
      marginLeft: theme.spacing(0.50),
    },
    fontFamily: ['Poppins', 'sans-serif'].join(','),
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
}));

function AppHeader(props){

  const classes = useStyles();
  let history = useHistory()

  const {currentUser, SignOut, handleClickOpen} = props
  return(
    <div style={{position:'relative'}} className="header">
      <div className="navbar fixed-top navbar-light bg-header">
        <div className="container-fluid">

          <div className="w-100" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            
          <h6 className="navbar-brand header-title">
            My Travel Journal
          </h6>
          
            <div className={classes.root}>
              {/* Open Modal */}
              <IconButton onClick={handleClickOpen}>
                <HelpOutlineOutlinedIcon style={{fontSize:30, color:'black'}}/>
              </IconButton>
              <div>
              {currentUser ? <button onClick={() => {
                SignOut()
                history.push('/login')
              }} className="btn btn-primary btn-sm border-0 shadow-none">LOG OUT</button>

              : <Link to="/login">
            <button className="btn btn-primary btn-sm border-0 shadow-none">SIGN IN</button>
          </Link>}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}


function InfoModal(props){

  const {handleClose, open} = props

  return(
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h5 className="modal-heading">How to use this site...</h5>
            <IconButton color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon/>
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
        <ul>
          <li>
            <p className="lead">
              First, create an account or login if you haven't already.
            </p>
          </li>
          <li>
            <p className="lead">
              You can explore any location on the map and add a pin to it by double-clicking, and then describe the place by writing about your favorite things, experiences or memories from your time there.
            </p>
          </li>
          <li>
            <p className="lead">
              When you've created a pin, clicking on it will show you what you wrote about the place. 
            </p>
          </li>
        </ul>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className="btn btn-primary border-0 shadow-none">CLOSE</button>
        </DialogActions>
      </Dialog>
  )
}

export default function Home(){

    // location access 
    const [locationPermitted, setLocationPermitted] = useState(false)
    const [currLocation, setCurrLocation] = useState(null)
    const [currPopup, setCurrPopup] = useState(true)

    // current logged in user
    const {currentUser, setCurrentUser} = useContext(AuthContext)

    // pins saved by user
    const [savedPins, setSavedPins] = useState([])

    // triggers when pin form data is submitted
    const [loading, setLoading] = useState(false)

    // triggers popup for any saved pin
    const [showPopup, setShowPopup] = useState(null)

    // State data for creating a new pin
    const [newPlace, setNewPlace] = useState()
    const [placeName, setPlaceName] = useState()
    const [memories, setMemories] = useState()

    // triggers modal popup
    const [modalOpen, setModalOpen] = useState(false)

    // Modal functions
    const handleClickOpen = () => {
      setModalOpen(true);
    };
    const handleClose = () => {
      setModalOpen(false);
    };
  

    const [viewport, setViewport] = useState({
      width: "100vw",
      height: "100vh",
      latitude: 39,
      longitude: 44,
      zoom: 3
    });

    const handleAddClick = (e) => {
      const [longitude, latitude] = e.lngLat;
      setNewPlace({
        lat: latitude,
        long: longitude,
      });
    };

    useEffect(() => {
    async function getLocation(){
      if("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(function(position){
          setLocationPermitted(true)
          setCurrLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          })
          setViewport({
            width: "100vw",
            height: "100vh",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 12
          })
        }, function(err){
          setLocationPermitted(false)
          setViewport({
            width: "100vw",
            height: "100vh",
            latitude: 39,
            longitude: 44,
            zoom: 3
          })
        })
      }
      else{
        setLocationPermitted(false)
          setViewport({
            width: "100vw",
            height: "100vh",
            latitude: 39,
            longitude: 44,
            zoom: 3
          })
        console.log('Location access denied')
      }
    }
    getLocation()
    }, [])

    useEffect(() => {
      if(currentUser){
        Axios({
          method:'GET',
          url:`https://travel-journal-server.herokuapp.com/api/pins/${currentUser.uid}`,
          withCredentials:false,
        }).then(res => res.data)
        .then(data => {
          const {pins, success, message} = data
          if(success){
            setSavedPins(pins)
          }
          else{
            console.log({'message': message, 'success':success})
          }
        }).catch(err => {
          console.log({'message':'There was a problem getting data from the server. Try again after some time.', success:false})
        })
      }
    }, [currentUser])


    const SubmitPinData = e => {
      setLoading(true)
      e.preventDefault()
      Axios({
        method:'POST',
        url:"https://travel-journal-server.herokuapp.com/api/pins",
        withCredentials:false,
        data:{
          user:currentUser.uid,
          place:placeName,
          lat:newPlace.lat,
          long: newPlace.long,
          memories: memories
        },
      }).then(res => res.data)
      .then(data => {
        const {pin, success, message} = data
        if(success){
          setSavedPins([...savedPins, pin])
          setLoading(false)
          setNewPlace()
          setPlaceName()
          setMemories()
        }
        else{
          console.log({'message': message, 'success':success})
          setLoading(false)
        }
      }).catch(err => {
        setLoading(false)
        console.log({'message':'There was a problem getting data from the server. Try again after some time.', success:false})
      })
    }


    const SignOut = () => {
      if(localStorage.getItem('uid') && localStorage.getItem('username')){
        localStorage.removeItem('uid')
        localStorage.removeItem('username')
      }
      setCurrentUser(null);
    }

    
    return(
   <div className="map">
   <AppHeader currentUser={currentUser} SignOut={SignOut} handleClickOpen={handleClickOpen}/>
   <InfoModal handleClose={handleClose} open={modalOpen}/>
   <ReactMapGL
    width="100vw" 
    height="100vh"
    {...viewport}
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
    onViewportChange={nextViewport => setViewport(nextViewport)}
    mapStyle="mapbox://styles/saket2000/ckogj12k43r0r17ol04ixk9ye"
    onDblClick={currentUser && handleAddClick}
      > 
      {currLocation && 
      <>
      <Marker
        latitude={currLocation.lat}
        longitude={currLocation.long}
        offsetLeft={-3.5 * viewport.zoom}
        offsetTop={-7 * viewport.zoom}
      >
        <RoomTwoToneIcon onClick={() => setCurrPopup(true)} style={{color:indigo[500], fontSize:viewport.zoom*7}}/>
      </Marker>
      {currPopup && 
      <Popup
        latitude={currLocation.lat}
        longitude={currLocation.long}
        closeButton={true}
        closeOnClick={false}
        onClose={() => setCurrPopup(false)}
        anchor="top"
      >
        <div className="card-map">
          <div className="mt-1">
            <Avatar alt="profile-avi" src="https://share-cdn.picrew.me/shareImg/org/202105/696219_9e5fhUk0.png"/>
          </div>
          <small style={{fontWeight:'600', color:'tomato'}} className="mt-1">{currentUser.username && currentUser.username}</small>
          <h6 style={{fontWeight:'300'}} className="mt-1">
              Welcome, {currentUser.username && currentUser.username}. You are here.
          </h6>
        </div>
      </Popup>}
      </>
      }
      {savedPins && savedPins.map((pin, index) => {
        return(
          <>
            <Marker
              key={index}
              latitude={pin.lat}
              longitude={pin.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <RoomTwoToneIcon onClick={() => setShowPopup(pin)} style={{color:'tomato', fontSize:viewport.zoom*7}}/>
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
                <small style={{fontWeight:'600', color:'tomato'}}>Place</small>
                <h6 style={{fontWeight:'300'}}>{showPopup.place}</h6>
                </div>
                <div className="description">
                  <small style={{fontWeight:'600', color:'tomato'}}>Experiences/memories/future plans for this place</small>
                  <h6 style={{fontWeight:'300'}}>{showPopup.memories}</h6>
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
          <RoomTwoToneIcon style={{color:'tomato', cursor:'pointer', fontSize:viewport.zoom*7}} />
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
                  <label style={{color:'tomato', fontWeight:'600'}} for="inputPlaceName" className="form-label small">Place</label>
                  <input type="text" value={placeName} onChange={e => setPlaceName(e.target.value)} class="form-control form-control-sm border-0 shadow-none outline-none semibold-text" id="inputPlaceName" placeholder="Name of the place" required></input>
                </div>
                <div className="mb-1">
                  <label style={{color:'tomato', fontWeight:'600'}} for="inputMemories" className="form-label small">Memories/Experiences/Future plans</label>
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
   </div>
    )
}