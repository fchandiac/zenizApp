import {
  AppBar, Container, Grid, IconButton, Typography, Box, Divider, Drawer, List,
  ListItem, ListItemButton, ListItemText, Popper, TextField, Button
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import { React, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'


// can use on component className={styles.exampleClass}
import styles from './Layout.module.css'
import AppPaper from '../AppPaper'

export default function Layout(props) {
  const { children, pageTitle, receptionBlock } = props
  const [drawerState, setDrawerState] = useState(false)
  const router = useRouter()
  const [userName, setUserName] = useState(router.query.userName)
  const [userId, setUserId] = useState(router.query.userId)
  const [user, setUser] = useState(router.query.user)
  const [profileName, setProfileName] = useState(router.query.profileName)
  const [popperAnchorEl, setpopperAnchorEl] = useState(null)
  const [menuButtonDisable, setMenuButtonDisable] = useState(false)
 
  // useEffect(() => {
  //   setMenuButtonDisable(receptionBlock == false? false: true)
  // }, [receptionBlock])
  

  const profileHandleClick = (e) => {
    setpopperAnchorEl(popperAnchorEl ? null : e.currentTarget)
  }

  const open = Boolean(popperAnchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <>
      <AppBar >
        <Container sx={{ display: 'flex', alignItems: 'center', paddingTop: '0.3rem', paddingBottom: '0.3rem' }}>
          <IconButton
            disabled = {menuButtonDisable}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => { setDrawerState(true) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {pageTitle}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h8" component="div" sx={{ flexGrow: 1, marginRight: '1rem' }}>
              {userName}
            </Typography>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={profileHandleClick}
            >
              <AccountCircle />
            </IconButton>
            <Popper id={id} open={open} anchorEl={popperAnchorEl}>
            <Grid container sx={{ p: 2, width:'14rem' }} >
            <AppPaper title='' className={styles.profile}>
                <Grid container>
                  <Grid item xs={12} sm={12} md={12}  paddingLeft={1} paddingRight={1}>
                    <TextField
                      label='Usuario'
                      value={user}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="standard"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} paddingLeft={1} paddingRight={1} paddingTop={1}>
                    <TextField
                      label='Perfil'
                      value={profileName}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="standard"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} textAlign='right' paddingLeft={1} paddingRight={1} paddingBottom={2} paddingTop={2}>
                    <Button
                      variant={'contained'}
                      onClick={() => {
                        router.push({
                          pathname: '/myProfile',
                          query: {
                            userId: userId,
                            userName: userName,
                            user: user,
                            profileName: profileName
                          }
                        })
                      }}
                    >Mi Perfil</Button>
                  </Grid>
                  </Grid>


                  </AppPaper>

            </Grid>
            </Popper>
          </Box>
        </Container>
      </AppBar>
      <Drawer
        anchor='left'
        open={drawerState}
      >
        <Box sx={{ justifyContent: 'flex-end', display: 'flex', padding: '0.3rem' }}>
          <IconButton onClick={() => setDrawerState(false)} >
            <ChevronLeft />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <Link href="/">
                <ListItemText primary="Login" />
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Nueva Recepción"
                onClick={() => {
                  router.push({
                    pathname: '/newReception',
                    query: {
                      userId: userId,
                      userName: userName,
                      user: user,
                      profileName: profileName
                    }
                  })
                }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Pallets / Bodegas"
                onClick={() => {
                  router.push({
                    pathname: '/pallets',
                    query: {
                      userId: userId,
                      userName: userName,
                      user: user,
                      profileName: profileName
                    }
                  })
                }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Recepciones"
                onClick={() => {
                  router.push({
                    pathname: '/receptions',
                    query: {
                      userId: userId,
                      userName: userName,
                      user: user,
                      profileName: profileName
                    }
                  })
                }} />
            </ListItemButton>
          </ListItem>
          {/* <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Nuevo desapacho"
                onClick={() => {
                  router.push({
                    pathname: '/newDelivery',
                    query: {
                      userId: userId,
                      userName: userName,
                      user: user,
                      profileName: profileName
                    }
                  })
                }} />
            </ListItemButton>
          </ListItem> */}
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Productores / Clientes"
                onClick={() => {
                  router.push({
                    pathname: '/producers',
                    query: {
                      userId: userId,
                      userName: userName,
                      user: user,
                      profileName: profileName
                    }
                  })
                }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Bandejas"
                onClick={() => {
                  router.push({
                    pathname: '/trays',
                    query: {
                      userId: userId,
                      userName: userName,
                      user: user,
                      profileName: profileName
                    }
                  })
                }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Registros"
                onClick={() => {
                  router.push({
                    pathname: '/records',
                    query: {
                      userId: userId,
                      userName: userName,
                      user: user,
                      profileName: profileName
                    }
                  })
                }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Usuarios / Perfiles"
                onClick={() => {
                  router.push({
                    pathname: '/usersProfiles',
                    query: {
                      userId: userId,
                      userName: userName,
                      user: user,
                      profileName: profileName
                    }
                  })
                }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Configuración"
                onClick={() => {
                  router.push({
                    pathname: '/config',
                    query: {
                      userId: userId,
                      userName: userName,
                      user: user,
                      profileName: profileName
                    }
                  })
                }} />
            </ListItemButton>
          </ListItem>


        </List>
      </Drawer>
      <Box>
        {children}
      </Box>
    </>

  )
}



