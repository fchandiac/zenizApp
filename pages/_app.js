import { React, useState } from 'react'
import '../styles/global.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { esES } from '@mui/material/locale'
import Layout from '../components/Layout'
import Head from 'next/head'
const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#bdbdbd' }
    },
  }, esES)

// { palette: { primary: { main: '#1976d2' }, }, }

// { palette: { 
//   primary: { main: '#ef5350' },
//   secondary: {main: '#616161'}
// }



export default function MyApp({ Component, pageProps }) {
  const [receptionBlock, setReceptionBlock] = useState(false)
  return (
    <>
      <Head>
        <title>
          Zeniz App 1.0.0
        </title>
      </Head>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} receptionBlock={receptionBlock} setReceptionBlock={setReceptionBlock} />
      </ThemeProvider>
    </>
  )
}
