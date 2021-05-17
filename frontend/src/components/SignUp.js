import React, { useState, useContext, useRef, useEffect } from "react"
import {Link} from "react-router-dom";
import Axios from "axios";

import { AuthContext } from "../context/AuthContext";

export default function SignUp(props){

    const {setCurrentUser} = useContext(AuthContext)
    const [user, setUser] = useState({"username":"", "password":"", "email":""})
    const [loading, setLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState()
    let timer = useRef(null)

    useEffect(()=>{
        return ()=>{
            clearTimeout(timer);
        }
    },[]);

    const handleInput = e => {
        setUser({...user, [e.target.name]:e.target.value})
    }

    const RegisterUser = e => {
        setLoading(true)
        e.preventDefault()
        Axios({
            method:'POST',
            data:{
                username:user["username"],
                password:user["password"],
                email:user["email"]
            },
            withCredentials:false,
            url:'/api/users/register'
        }).then(res => res.data)
        .then(data => {
            const {user, message, success} = data
            
            if(success){
                setAlertMessage({'message':message, 'success':success})

                setCurrentUser(user)
                localStorage.setItem('uid', user)
                
                timer = setTimeout(() => {
                    props.history.push('/');
                }, 2000)
            }
            else{
                setAlertMessage({message, success})
                setLoading(false)
            }
        }).catch(err => {
            setLoading(false)
            setAlertMessage({'message':'Could not connect to server. Try again later.', 'success':false})
        })
    }

    return(
        <div className="container">
            <div className="d-flex justify-content-center">
                <div className="card p-4 m-4 bg-white rounded-sm col-12 col-sm-6 justify-content-center">
                    <h5 className="fs2 mx-auto">Create an account today</h5>

                    {alertMessage && <div className="mt-1 col-12 mx-auto">
                        {alertMessage.success===true ? <div>
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                <strong>User registered.</strong>
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
                    <form onSubmit={RegisterUser}>
                    <div class="mb-3">
                            <label for="usernameInput" class="form-label">Username</label>
                            <input type="text" class="form-control shadow-none outline-none" id="usernameInput" name="username" aria-describedby="usernameHelp" onChange={event => handleInput(event)} required/>
                            <div id="usernameHelp" class="form-text">For ex: @catsrunningamok</div>
                        </div>
                        <div class="mb-3">
                            <label for="emailInput" class="form-label">Email address</label>
                            <input type="email" class="form-control shadow-none outline-none" id="emailInput" name="email" aria-describedby="emailHelp" onChange={event => handleInput(event)} required/>
                            <div id="emailHelp" class="form-text">Enter your email address</div>
                        </div>
                        <div class="mb-3">
                            <label for="passwordInput" class="form-label">Password</label>
                            <input type="password" class="form-control shadow-none outline-none" id="passwordInput" name="password" aria-describedby="passwordHelp" onChange={event => handleInput(event)} required/>
                            <div id="emailHelp" class="form-text">Must be 8-20 characters long</div>
                        </div>
                         {loading===false ? <button type="submit" class="btn btn-primary shadow-none outline-none border-0">Sign up</button>
                            : <button className="btn shadow-none text-white outline-none border-0 btn-disabled disabled">Loading...</button>
                        }

                        <div className="small text-muted mt-3">Already have an account?{" "}
                            <Link to="/login" className="text-primary">
                                Sign in
                            </Link>{" "}
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    )
}