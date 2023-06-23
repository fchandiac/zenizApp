import { Button, Grid, TextField, Autocomplete } from '@mui/material'
import { React, useState, useEffect } from 'react'
import AppErrorSnack from '../../AppErrorSnack/AppErrorSnack'
import AppPaper from '../../AppPaper'
import { useRouter } from 'next/router'

const profiles = require('../../../promises/profiles')
const users = require('../../../promises/users')
const records = require('../../../promises/records')


export default function NewUserForm(props) {
  const { updateUsersGrid } = props
  const router = useRouter()
  const [userId, setUserId] = useState(router.query.userId)

  const [openSnack, setOpenSnack] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [profilesOptions, setProfilesOptions] = useState([])
  const [autocompleteValue, setautocompleteValue] = useState('')
  const [userData, setUserData] = useState(userDataDefault())

  useEffect(() => {
    profiles.findAll()
      .then(res => {
        let data = res.map(item =>
        ({
          label: item.name,
          id: item.id
        })
        )
        setProfilesOptions(data)
      })

  }, [])

  useEffect(() => {
    setUserData({
      ...userData,
      profile_id: autocompleteValue.id
    })

  }, [autocompleteValue])


  const handleOnChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }



  const submit = (e) => {
    e.preventDefault()
    users.create(userData.user, userData.pass, userData.name, userData.mail, userData.profile_id)
      .then(res => {
        records.create('usuarios', 'crea', 'usuario ' + userData.user + ' , ' + 'id ' + res.id, userId)
          .then(() => {
            setUserData(userDataDefault())
            updateUsersGrid()
          })
          .catch(err => { console.log(err) })
      })
      .catch(err => {
        console.log(err)
        if (err.errors[0].message == 'user must be unique') {
          setErrorText('El Usuario ya existe en los registros')
          setOpenSnack(true)

        } else if (err.errors[0].message == 'name must be unique') {
          setErrorText('El Nombre ya existe en los registros')
          setOpenSnack(true)
        }
        
      })
  }

  return (
    <>
      <AppPaper title='Nuevo Usuario'>
        <form onSubmit={submit}>
          <Grid sx={{ p: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <TextField label="Usuario"
                name="user"
                value={userData.user}
                onChange={handleOnChange}
                variant="outlined"
                size={'small'}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} paddingTop={1}>
              <TextField label="Nombre"
                name="name"
                value={userData.name}
                onChange={handleOnChange}
                variant="outlined"
                size={'small'}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} paddingTop={1}>
              <TextField label="Contraseña"
                name="pass"
                value={userData.pass}
                onChange={handleOnChange}
                variant="outlined"
                size={'small'}
                type={'password'}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} paddingTop={1}>
              <TextField label="Mail"
                name="mail"
                value={userData.mail}
                onChange={handleOnChange}
                variant="outlined"
                size={'small'}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} paddingTop={1}>
              <Autocomplete
                value={autocompleteValue}
                onChange={(e, newValue) => {
                  setautocompleteValue(newValue);
                }}
                disablePortal
                options={profilesOptions}
                renderInput={(params) => <TextField {...params} label='Perfil' name='profile' size={'small'} fullWidth required />}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} paddingTop={1} textAlign='right'>
              <Button variant='contained' type='submit'>Guardar</Button>
            </Grid>
          </Grid>
        </form>
      </AppPaper>
      <AppErrorSnack openSnack={openSnack} errorText={errorText} setOpenSnack={setOpenSnack}></AppErrorSnack>
    </>
  )
}


function userDataDefault() {
  return ({
    user: '',
    name: '',
    pass: '',
    mail: '',
    profile_id: 0
  })
}