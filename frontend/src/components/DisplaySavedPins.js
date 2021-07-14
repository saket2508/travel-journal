import React, { useContext, useState } from 'react'
import { Marker, Popup } from 'react-map-gl'
import { AuthContext } from '../context/AuthContext'
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone'


export default function DisplaySavedPins(props) {

    const { viewport } = props
    const { savedPins } = useContext(AuthContext)
    const [ showPopup, setShowPopup ] = useState(null)

    if(savedPins){
        return(
            savedPins.map((pin, idx) => {
                return(
                    <>
                    <Marker
                        key={idx}
                        latitude={pin.lat}
                        longitude={pin.long}
                        offsetLeft={-3.5 * viewport.zoom}
                        offsetTop={-7 * viewport.zoom}
                        >
                        <RoomTwoToneIcon onClick={() => setShowPopup(pin)} style={{color:'tomato', fontSize:viewport.zoom*7}}/>
                    </Marker>
                    {showPopup && 
                    <Popup
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
            })
        )
    } else{
        return(
            <div></div>
        )
    }
}
