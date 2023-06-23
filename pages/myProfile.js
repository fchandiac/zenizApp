import { Button, Grid, TextField } from '@mui/material'
import { React, useState, useEffect } from 'react'
import AppPaper from '../components/AppPaper'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import UpdatePassForm from '../components/Forms/UpdatePassForm/UpdatePassForm'

const users = require('../promises/users')

export default function myProfile(props) {
  const {receptionBlock, setReceptionBlock} = props
  const [userData, setUserData] = useState(userDataDefault())
  const router = useRouter()
  console.log(router.query.user)

  useEffect(() => {
    users.findOneByUser(router.query.user)
      .then(res => {
        setUserData({
          user: res.user,
          name: res.name,
          pass: res.pass,
          mail: res.mail
        })
      })


  }, [])


  return (
    <>
      <Layout pageTitle='Mi perfil'>
        <Grid container spacing={1}>
          <Grid item xs={4} sm={4} md={4}>
            <AppPaper title='Información del usuario'>
              <Grid sx={{ p: 2 }} >
                <Grid item xs={12} sm={12} md={12} >
                  <TextField
                    label='Usuario'
                    value={userData.user}
                    InputProps={{
                      readOnly: true,
                    }}
                    size='small'
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                  <TextField
                    label='Nombre'
                    value={userData.name}
                    InputProps={{
                      readOnly: true,
                    }}
                    size='small'
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                  <TextField
                    label='Mail'
                    value={userData.mail}
                    InputProps={{
                      readOnly: true,
                    }}
                    size='small'
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} textAlign={'right'} paddingTop={1}>
                  <Button variant={'contained'}>Actualizar</Button>
                </Grid>
              </Grid>
            </AppPaper>


          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <UpdatePassForm></UpdatePassForm>
          </Grid>
        </Grid>
      </Layout>
    </>
  )
}

function userDataDefault() {
  return ({
    user: '', pass: '', name: '', mail: ''
  })
}


