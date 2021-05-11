import React, { useState } from "react"
import {Link} from "react-router-dom";

export default function SignIn(){
    return(
        <div className="container">
            <div className="d-flex justify-content-center">
                <div className="card p-3 m-4 bg-white rounded-sm col-12 col-sm-6">
                    <h4 className="fs2 mx-auto">Sign in</h4>
                    <div className="mt-3">
                    <form>
                        <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" class="form-control" id="username" aria-describedby="usernameHelp"/>
                            <div id="usernameHelp" class="form-text">Enter your username</div>
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" aria-describedby="passwordHelp"/>
                            <div id="emailHelp" class="form-text">Enter your password</div>
                        </div>
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
                            <label class="form-check-label" for="exampleCheck1">Remember me</label>
                        </div>
                        <button type="submit" class="btn btn-primary shadow-none outline-none border-0">Continue</button>
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