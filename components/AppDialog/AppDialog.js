import React from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

export default function AppDialog(props) {
    const {renderActions} = props
    const { openDialog, closeDialog, children, title, actions } = props
    return (
        <Dialog open={openDialog}>
            <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                {title}
            </DialogTitle>
            <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                {children}
            </DialogContent>
            {ifRenderActions(renderActions, actions, closeDialog)}
        </Dialog>
    )
}

function ifRenderActions(value, actions, closeDialog){
    if (value == true){
        return(
            <DialogActions sx={{ paddingRight: 2, paddingBottom: 2 }}>
                {actions}
                <Button variant={'outlined'} onClick={closeDialog}>cerrar</Button>
            </DialogActions>
        )
    }
    
}
