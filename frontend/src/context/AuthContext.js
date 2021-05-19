import React, {useState, useEffect, createContext} from "react"

export const AuthContext = createContext()

function AuthProvider({ children }){
    const [ currentUser, setCurrentUser ] = useState(null)

    useEffect(() => {
        if(localStorage.getItem('uid') && localStorage.getItem('username')){
            let uid = localStorage.getItem('uid')
            let username = localStorage.getItem('username')
            setCurrentUser({'username': username, 'uid': uid})
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