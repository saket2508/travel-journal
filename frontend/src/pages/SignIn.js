import axios from 'axios'
import React, { useState, useContext, useEffect, useRef } from 'react'
import { Link } from "react-router-dom"
import { AuthContext } from '../context/AuthContext'

export default function SignIn(props) {

    const GOOGLE_OAUTH_URI = process.env.NODE_ENV === "production"
    ? 'https://merntraveljournal.herokuapp.com/api/oauth' 
    : 'http://localhost:5000/api/oauth'

    const [user, setUser] = useState({"email":"", "password":""})
    const [alertMessage, setAlertMessage] = useState()
    const [loading, setLoading] = useState(false)

    const { setIsAuthenticated } = useContext(AuthContext)
    let timerID = useRef(null)

    useEffect(()=>{
        return ()=>{
            clearTimeout(timerID);
        }
    },[]);


    const handleInput = e => {
        setUser({...user, [e.target.name]:e.target.value})
    }

    const LogIn = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post('/api/users/login', { 
                email: user.email,
                password: user.password
             }, { withCredentials: true })
            console.log(res.data)
            const { success, message } = res.data
            if(success){
                setLoading(false)
                setAlertMessage({success, message})
                setIsAuthenticated(true)
                timerID = setTimeout(() => {
                    props.history.push('/');
                }, 2000)
            } else{
                setLoading(false)
                setAlertMessage({success, message})
            }
        } catch (err) {
            console.log(err.message)
            setLoading(false)
            if(err.response.data){
                const { error } = err.response.data
                setAlertMessage({success: false, message: error})
            } else{
                setAlertMessage({success: false, message: 'Error signing in'})
            }
        }
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-center">
                <div className="card p-4 m-4 bg-white rounded-sm col-12 col-sm-6 col-lg-5">
                    <h5 className="fs2 mx-auto">Log in to continue</h5>

                    {alertMessage && <div className="mt-1 col-12 mx-auto">
                        {alertMessage.success===true ? <div>
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                <strong>Welcome! You've been signed in.</strong>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage()}></button>
                            </div>
                        </div> 
                        : <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <strong>{alertMessage.message}</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage()}></button>
                        </div>    
                    }
                    </div>}
                    <div className="mt-3">
                    <form onSubmit={LogIn}>
                        <div class="mb-3">
                            <input type="text" placeholder="Email" class="form-control shadow-none outline-none" id="usernameInput" name="email" aria-describedby="usernameHelp" onChange={event => handleInput(event)} required/>
                        </div>
                        <div class="mb-3">
                            <input type="password" placeholder="Password" class="form-control shadow-none outline-none" id="passwordInput" name="password" aria-describedby="passwordHelp" onChange={event => handleInput(event)} required/>
                        </div>
                        {loading===false ? <button type="submit" class="btn btn-primary shadow-none outline-none border-0 w-100 rounded-pill">Sign In</button>
                            : <button className="btn btn-primary shadow-none text-white outline-none border-0 w-100 rounded-pill" disabled>Loading...</button>
                        }
                    </form>
                    <div className="d-flex justify-content-center small text-muted mt-2">OR</div>
                            <a role="button" href={GOOGLE_OAUTH_URI} className="btn btn-secondary shadow-none outline-none border-0 w-100 mt-2 rounded-pill">
                                <i className="fab fa-google"></i>
                                <span className="ms-2">Continue with Google</span>
                            </a>
                            <div className="small text-muted mt-3">Don't have an account?{" "}
                                <Link to="/register" className="text-primary">
                                    Sign up
                                </Link>{" "}
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
