import { useEffect, useState } from 'react'

export default function useGeolocation() {

    const [ coordinates, setCoordinates ] = useState({ latitude: 39, longitude: 44, location: 'Not Granted' })

    useEffect(() => {
        console.log('Geolocation')
        function getCoordinates(){
            if("geolocation" in navigator){
                navigator.geolocation.getCurrentPosition(function(position){
                    const { latitude, longitude } = position.coords
                    setCoordinates({latitude, longitude, location:'Granted'})
                }, function(err){
                    console.error(err.message)
                })
            }
        }
        getCoordinates()
    }, [])

    return coordinates
}
