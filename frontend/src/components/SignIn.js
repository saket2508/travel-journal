import React, { useState } from "react"
import {Link} from "react-router-dom";

export default function SignIn(){
    return(
        <div className="container">
            <div className="mx-2 my-4 mx-sm-4">
                <div className="card p-3 bg-white rounded-sm w-100">
                    <h4 className="fs2 mx-auto header-title">Sign in</h4>
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
                        <button type="submit" class="btn btn-primary">Continue</button>

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