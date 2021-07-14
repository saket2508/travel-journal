import React, { useState, useContext } from 'react'
import { Marker, Popup } from 'react-map-gl'
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

export default function DisplayDroppedPin(props) {

    const { newPlace, setNewPlace, viewport } = props
    const { savedPins, setSavedPins } = useContext(AuthContext)

    const [ loading, setLoading ] = useState(false)
    const [ placeName, setPlaceName ] = useState()
    const [ memories, setMemories ] = useState()

    const SubmitPinData = e => {
        setLoading(true)
        e.preventDefault()
        axios.post(
            '/api/pins/add',
            {
                place: placeName,
                lat: newPlace.lat,
                long: newPlace.long,
                memories: memories
            },
            {
                withCredentials: true
            }
        ).then(res => res.data)
        .then(data => {
            const { pin, message, success } = data
            if(success){
                setSavedPins([...savedPins, pin])
                setLoading(false)
                setNewPlace()
                setMemories()
                setPlaceName()
            } else{
                console.log(message)
                setLoading(false)
            }
        }).catch(err => {
            setLoading(false)
            console.error(err.message)
        })
    }


    if(newPlace){
        return(
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
        )
    } else {
        return(
            <div></div>
        )
    }
}
