import { Grid } from '@mui/material'
import {React, useState} from 'react'
import Layout from '../components/Layout'
import NewUserForm from '../components/Forms/NewUserForm'
import UsersTab from '../components/Tabs/UsersTab'
import UsersGrid from '../components/Grids/UsersGrid/UsersGrid'

export default function users(props) {
  const { receptionBlock, setReceptionBlock } = props
  const [usersGridState, setUsersGridState] = useState(false)

  const updateUsersGrid = () => {
    let gridState = usersGridState == false ? true : false
    setUsersGridState(gridState)
  }


  return (
    <Layout pageTitle='Usuarios / Perfiles'>
      <UsersTab usersContent={usersContent(updateUsersGrid, usersGridState)} />
    </Layout>
  )
}

function usersContent(updateUsersGrid, usersGridState) {
  return (
    <Grid container spacing={1} >
      <Grid item xs={4} sm={4} md={4}>
        <NewUserForm updateUsersGrid={updateUsersGrid}></NewUserForm>
      </Grid>
      <Grid item xs={8} sm={8} md={8}>
        <UsersGrid updateState={usersGridState}></UsersGrid>
      </Grid>
    </Grid>
  )
}


