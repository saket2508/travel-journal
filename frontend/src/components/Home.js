import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { Link, useHistory } from "react-router-dom";
import RoomIcon from '@material-ui/icons/Room';
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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems:'center',
    '& > *': {
      marginLeft: theme.spacing(0.50),
    },
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
      <div className="navbar navbar-light bg-header">
        <div className="container-fluid">
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
              You can explore any location on the map and add a pin to it by double-clicking, and then describe that place by writing about your favorite things, experiences or memories from your time there.
            </p>
          </li>
          <li>
            <p className="lead">
              When you've create a pin, clicking on it will show you what you wrote about the place. 
            </p>
          </li>
        </ul>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className="btn btn-primary border-0 shadow-none">Close</button>
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
        latitude: 0,
        longitude: 0,
        zoom: 2
      });

    const navControlStyle= {
        right: 10,
        left:0,
        top:0,
        bottom: 10
      }

    const handleAddClick = (e) => {
      const [longitude, latitude] = e.lngLat;
      setNewPlace({
        lat: latitude,
        long: longitude,
      });
    };

    useEffect(async() => {
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
            latitude: 40.7128,
            longitude: -74.0060,
            zoom: 8
          })
          // console.log('could not get location')
        })
      }
      else{
        setLocationPermitted(false)
          setViewport({
            width: "100vw",
            height: "100vh",
            latitude: 40.7128,
            longitude: -74.0060,
            zoom: 8
          })
        console.log('Location access denied')
      }
    }, [])

    useEffect(() => {
      if(currentUser){
        Axios({
          method:'GET',
          url:`https://travel-journal-server.herokuapp.com/api/pins/${currentUser}`,
          withCredentials:false,
        }).then(res => res.data)
        .then(data => {
          const {pins, success, message} = data
          if(success){
            setSavedPins(pins)
          }
          else{
            setAlert({'message': message, 'success':success})
          }
        }).catch(err => {
          setAlert({'message':'There was a problem getting data from the server. Try again after some time.', success:false})
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
        }
      }).catch(err => {
        setLoading(false)
        setAlert({'message':'There was a problem getting data from the server. Try again after some time.', success:false})
      })
    }


    const SignOut = () => {
      if(localStorage.getItem('uid')){
        localStorage.removeItem('uid')
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
          <div className="semibold-text">
            You are here.
          </div>
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