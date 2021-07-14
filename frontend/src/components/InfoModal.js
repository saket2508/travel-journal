import React from 'react'
import { IconButton } from "@material-ui/core"
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import CloseIcon from '@material-ui/icons/Close'

export default function InfoModal(props) {

    const { handleClose, open } = props

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h5 className="modal-heading">How to use this site...</h5>
            <IconButton color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon/>
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
        <ul>
          <li>
            <p className="lead">
              First, create an account or login if you haven't already.
            </p>
          </li>
          <li>
            <p className="lead">
              You can explore any location on the map and add a pin to it by double-clicking, and then describe the place by writing about your favorite things, experiences or memories from your time there.
            </p>
          </li>
          <li>
            <p className="lead">
              When you've created a pin, clicking on it will show you what you wrote about the place. 
            </p>
          </li>
        </ul>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className="btn btn-primary border-0 shadow-none">CLOSE</button>
        </DialogActions>
      </Dialog>
    )
}
