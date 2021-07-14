import React, { useContext } from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import { AuthContext } from "../src/context/AuthContext"
import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import red from "@material-ui/core/colors/red"
import indigo from "@material-ui/core/colors/indigo"

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems:'center',
    justifyContent:'center',
    minHeight:'100vh',
    minWidth:'100vw',
    color:indigo[400]
  },
  spinner:{
    marginRight: theme.spacing(1),
    color:indigo[400]
  },
  loadingText:{
    fontFamily: ['Poppins', 'sans-serif'].join(','),
    fontWeight:'500'
  },
  errorText:{
    fontFamily: ['Poppins', 'sans-serif'].join(','),
    fontWeight:'500',
    color: red[400]
  }
}))


function App() {
  const classes = useStyles()
  const { loading, errors, isAuthenticated } = useContext(AuthContext)

  if(loading){
    return(
      <div className={classes.container}>
        <CircularProgress className={classes.spinner} thickness={6} size={18}/>
        <div className={classes.loadingText}>Loading</div>
      </div>
    )
  }

  if(errors){
    return(
      <div className={classes.container}>
        <div className={classes.errorText}>Server Error :(</div>
      </div>
    )
  }

  return (
    <Router>
        <Switch>
          <Route exact path = "/home">
            <Home/>
          </Route>
          <Route exact path = "/login">
            {isAuthenticated===true ? <Redirect to ="/home"/> : <SignIn/>}
          </Route>
          <Route exact path = "/register">
            {isAuthenticated===true ? <Redirect to ="/home"/> : <SignUp/>}
          </Route>
          <Route exact path ="/">
            <Redirect to ="/home"/>
          </Route>
          <Route exact path = "*">
            <Redirect to="/home"/>
          </Route>
        </Switch>
    </Router>
  );
}

export default App;