import React, { useState, useContext, useRef, useEffect } from "react"
import {Link, useHistory} from "react-router-dom";
import Axios from "axios";

import { AuthContext } from "../context/AuthContext";

export default function SignIn(props){

    const {setCurrentUser} = useContext(AuthContext)
    const [user, setUser] = useState({"username":"", "password":""})
    const [alertMessage, setAlertMessage] = useState()
    const [loading, setLoading] = useState(false)
    const [saveCred, setSaveCred] = useState(false)
    let timerID = useRef(null)

    useEffect(()=>{
        return ()=>{
            clearTimeout(timerID);
        }
    },[]);


    const handleInput = e => {
        setUser({...user, [e.target.name]:e.target.value})
    }

    const handleCheckbox = () => {
        setSaveCred(!saveCred)
    }

    const Login = e => {
        setLoading(true)
        e.preventDefault()
        Axios({
            method:'POST',
            data:{
                username:user["username"],
                password:user["password"]
            },
            withCredentials:false,
            url:'/api/users/login'
        }).then(res => res.data)
        .then(data => {
            const {user, message, success} = data
    
            console.log(message, success)
            if(success===true){
                setAlertMessage({'message':message, 'success':success})
                setCurrentUser(user)
                if(saveCred===true){
                    localStorage.setItem('user', user)
                }
            
                timerID = setTimeout(() => {
                    props.history.push('/');
                }, 2000)
                setLoading(false)
            }
            else{
                setAlertMessage({message, success})
                setLoading(false)
            }
        }).catch(err => {
            console.log(err.message)
            setLoading(false)
            setAlertMessage({'message':'Could not connect to server. Try again later.', 'success':false})
        })
    }


    return(
        <div className="container">
            <div className="d-flex justify-content-center">
                <div className="card p-4 m-4 bg-white rounded-sm col-12 col-sm-10 col-md-6">
                    <h3 className="fs2 mx-auto text-heading">Log in to continue</h3>

                    {alertMessage && <div className="mt-1 col-12 mx-auto">
                        {alertMessage.success===true ? <div>
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                <strong>User signed in.</strong>
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
                    <form onSubmit={Login}>
                        <div class="mb-3">
                            <label for="usernameInput" class="form-label">Username</label>
                            <input type="text" class="form-control shadow-none outline-none" id="usernameInput" name="username" aria-describedby="usernameHelp" onChange={event => handleInput(event)} required/>
                            <div id="usernameHelp" class="form-text">Enter your username</div>
                        </div>
                        <div class="mb-3">
                            <label for="passwordInput" class="form-label">Password</label>
                            <input type="password" class="form-control shadow-none outline-none" id="passwordInput" name="password" aria-describedby="passwordHelp" onChange={event => handleInput(event)} required/>
                            <div id="emailHelp" class="form-text">Enter your password</div>
                        </div>
                        <div class="mb-3 form-check">
                            <input type="checkbox" checked={saveCred} onChange={()  => handleCheckbox()} class="form-check-input shadow-none" id="exampleCheck1"/>
                            <label class="form-check-label" for="exampleCheck1">Remember me</label>
                        </div>
                        {loading===false ? <button type="submit" class="btn btn-primary shadow-none outline-none border-0">Continue</button>
                            : <button className="btn shadow-none text-white outline-none border-0 btn-disabled disabled">Loading...</button>
                        }
                        <div className="small text-muted mt-3">Don't have an account?{" "}
                            <Link to="/register" className="text-primary">
                                Sign up
                            </Link>{" "}
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    )
}