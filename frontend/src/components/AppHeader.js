import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { IconButton } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import axios from 'axios'

import { Link } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      alignItems:'center',
      '& > *': {
        marginLeft: theme.spacing(0.50),
      },
      fontFamily: ['Poppins', 'sans-serif'].join(','),
    },
  }))

export default function AppHeader(props) {

    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)
    const classes = useStyles()

    const { handleClickOpen } = props

    const SignOut = async() => {
      try {
        const res = await axios.get('https://travel-journal-server.herokuapp.com/api/users/logout', { withCredentials: true })
        setIsAuthenticated(true)
        window.location.pathname = '/login'
      } catch (error) {
        console.log('could not sign out')
      }

    }

    return (
    <div style={{position:'relative'}} className="header">
      <div className="navbar fixed-top navbar-light bg-header">
        <div className="container-fluid">
          <div className="w-100" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h6 className="navbar-brand header-title">
                My Travel Journal
            </h6>
            <div className={classes.root}>
              {/* Open Modal */}
              <IconButton onClick={handleClickOpen}>
                <HelpOutlineOutlinedIcon style={{fontSize:30, color:'black'}}/>
              </IconButton>
              <div>
              {isAuthenticated 
              ? <button className="btn btn-primary border-0 shadow-none" onClick={() => SignOut()}>Sign Out</button>
              : <Link to="/login">
                    <button className="btn btn-primary border-0 shadow-none">Sign In</button>
                </Link>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}
