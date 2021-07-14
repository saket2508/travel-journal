import React from 'react'
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone'
import { Marker } from 'react-map-gl'
import indigo from "@material-ui/core/colors/indigo"

export default function CurrentLocationMarker(props) {
    const { locationAccess, setCurrLocationPopup, viewport, coordinates } = props
    if (locationAccess === 'Granted'){
        return(
            <Marker
                     latitude={coordinates.latitude}
                     longitude={coordinates.longitude}
                     offsetLeft={-3.5 * viewport.zoom}
                     offsetTop={-7 * viewport.zoom}
                 >
                     <RoomTwoToneIcon onClick={() => setCurrLocationPopup(true)} style={{color:indigo[500], fontSize:viewport.zoom*7}}/>
                 </Marker>
         )
    }
    return(
        <div></div>
    )
}
