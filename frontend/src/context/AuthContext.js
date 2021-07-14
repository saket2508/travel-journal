import React, {useState, useEffect, createContext} from "react"
import { getAuthStatus, getSavedPins, getUserInfo } from "../helpers"

export const AuthContext = createContext()

function AuthProvider({ children }){

    const [ isAuthenticated, setIsAuthenticated ] = useState(null)
    const [ savedPins, setSavedPins ] = useState(null)
    const [ currentUser, setCurrentUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    const [ errors, setErrors ] = useState(null)


    useEffect(() => {
        getAuthStatus()
            .then(res => res.data)
            .then(authRes => {
                setIsAuthenticated(authRes)
                setLoading(false)
            }).catch(err => {
                setLoading(false)
                setIsAuthenticated(false)
                if(err.status === 500){
                    setErrors(true)
                }
            })
    }, [])

    useEffect(() => {
        if(errors) return
        if(!isAuthenticated) return

        const getData = () => {
            getUserInfo()
                .then(res => res.data)
                .then(data => {
                    const { user }  = data
                    setCurrentUser(user)
                }).catch(err => {
                    console.error(err.message)
                    setErrors(true) 
                    return
                })
            getSavedPins()
                .then(res => res.data)
                .then(data => {
                    const { pins } = data
                    setSavedPins(pins)
                }).catch(err => {
                    console.log(err.message)
                    setErrors(true)
                    return
                })
        }
        getData()
    }, [isAuthenticated, errors])

    return(
        <div>
            <AuthContext.Provider value = {{
                loading,
                currentUser, 
                setCurrentUser, 
                isAuthenticated, 
                setIsAuthenticated,
                savedPins,
                setSavedPins
            }}>
                    { children }
            </AuthContext.Provider>
        </div>
    )

}

export default AuthProvider