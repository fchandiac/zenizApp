import { Grid, TextField, Button, Snackbar, Alert } from '@mui/material'
import { React, useState } from 'react'
import AppPaper from '../../AppPaper'

export default function UpdatePassForm() {
  const [openSnack, setOpenSnack] = useState(false)
  const [errorText, setErrorText] = useState('')


  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnack(false)
  }

  const submit = (e) => {
    e.preventDefault()
  }


  return (
    <>
      <AppPaper title='Actualizar contraseña'>
        <form onSubmit={submit}>
          <Grid container sx={{ p: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <TextField label="Contraseña actual"
                name="oldPass"
                // value={profileUserData.pass}
                // onChange={handleOnChange}
                variant="outlined"
                size={'small'}
                type={'password'}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} paddingTop={1}>
              <TextField label="Nueva contraseña"
                name="newPass"
                // value={profileUserData.pass}
                // onChange={handleOnChange}
                variant="outlined"
                size={'small'}
                type={'password'}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} paddingTop={1}>
              <TextField label="Confirmar contraseña"
                name="confirmParss"
                // value={profileUserData.pass}
                // onChange={handleOnChange}
                variant="outlined"
                size={'small'}
                type={'password'}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} paddingTop={1} textAlign='right' paddingBottom={1}>
              <Button variant={'contained'} type='submit'>Actualizar</Button>
            </Grid>
          </Grid>
        </form>
      </AppPaper>
      <Snackbar open={openSnack} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={4000} onClose={handleCloseSnack}>
        <Alert severity="error" variant={'filled'}>
          {errorText}
        </Alert>
      </Snackbar>
    </>

  )
}
