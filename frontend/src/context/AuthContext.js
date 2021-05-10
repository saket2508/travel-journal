import React, {useState, useEffect, createContext} from "react"

export const AuthContext = createContext()

export default ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null)

    useEffect(() => {
        const userSaved = localStorage.getItem('user')
        if(userSaved){
            setCurrentUser(userSaved)
        }
    }, [])

    return(
        <div>
            <AuthContext.Provider value = {currentUser}>
                    { children }
            </AuthContext.Provider>
        </div>
    )

}