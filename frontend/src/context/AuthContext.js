import React, {useState, useEffect, createContext} from "react"

export const AuthContext = createContext()

function AuthProvider({ children }){
    const [ currentUser, setCurrentUser ] = useState(null)

    useEffect(() => {
        if(localStorage.getItem('user')){
            setCurrentUser(localStorage.getItem('user'))
        }
    }, [])

    return(
        <div>
            <AuthContext.Provider value = {{currentUser, setCurrentUser}}>
                    { children }
            </AuthContext.Provider>
        </div>
    )

}

export default AuthProvider