import React, { useContext } from 'react'
import { Popup } from 'react-map-gl'
import Avatar  from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import { AuthContext } from '../context/AuthContext'

const useStyles = makeStyles((theme) => ({
    avi:{
        width: theme.spacing(6),
        height: theme.spacing(6)
    }
}))


export default function CurrentLocationPopup(props){

    const classes = useStyles()
    const { currentUser } = useContext(AuthContext)
    const { currLocationPopup, setCurrLocationPopup, coordinates } = props

    if(currLocationPopup){
        return(
            <Popup
                latitude={coordinates.latitude}
                longitude={coordinates.longitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrLocationPopup(false)}
                anchor="top"
            >
                {currentUser ? <div className="card-map">
                    <div className="mt-1">
                        <Avatar className={classes.avi} alt="profile-avi" src="https://share-cdn.picrew.me/shareImg/org/202105/696219_9e5fhUk0.png"/>
                    </div>
                    <small style={{fontWeight:'600', color:'tomato'}} className="mt-1">{currentUser.username && currentUser.username}</small>
                    <h6 style={{fontWeight:'300'}} className="mt-1">
                        Welcome, {currentUser.username && currentUser.username}. You are here. To create a pin, just double click on any location and then you can describe your memories, experiences or favorite things about that place. Submitting the form will create a pin.
                    </h6>
                    </div> :  <div className="card-map">
                    <div className="mt-1">
                        <Avatar className={classes.avi} alt="profile-avi" src="https://share-cdn.picrew.me/shareImg/org/202105/696219_9e5fhUk0.png"/>
                    </div>
                    <small style={{fontWeight:'600', color:'tomato'}} className="mt-1">You</small>
                        <h6 style={{fontWeight:'300'}} className="mt-1">
                            Sign in to set pins on all the places you've traveled to before the pandemic.
                        </h6>
                </div>}
            </Popup>
        )
    } else{
        return(
            <div></div>
        )
    }
}
