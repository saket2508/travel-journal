import React, { useState } from "react"
import {Link} from "react-router-dom";

export default function SignUp(){
    return(
        <div className="container">
            <div className="d-flex justify-content-center">
                <div className="card p-3 m-4 bg-white rounded-sm col-12 col-sm-6 justify-content-center">
                    <h4 className="fs2 mx-auto">Sign up</h4>
                    <div className="mt-3">
                    <form>
                    <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" class="form-control" id="username" aria-describedby="usernameHelp"/>
                            <div id="usernameHelp" class="form-text">For ex: @catsrunningamok</div>
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputEmail" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                            <div id="emailHelp" class="form-text">Enter your email address</div>
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" aria-describedby="passwordHelp"/>
                            <div id="emailHelp" class="form-text">Must be 8-20 characters long</div>
                        </div>
                        <button type="submit" class="btn btn-primary shadow-none outline-none border-0">Create an account</button>

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