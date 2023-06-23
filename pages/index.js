import React from 'react'
import { Grid} from '@mui/material'
import LoginForm from '../components/Forms/LoginForm/LoginForm'

export default function Home() {
  return (
    <Grid container
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{backgroundColor:'lightgray'}}
      marginLeft={-2}
      marginRight={-2}
      marginTop={'-4.7rem'}
      height={'100vh'}
      width={'100.2vw'}
      alignSelf={'start'}
      >
      <LoginForm></LoginForm>
    </Grid>

  )
}
