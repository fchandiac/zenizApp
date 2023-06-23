import { Grid } from '@mui/material'
import React from 'react'
import AppPaper from '../components/AppPaper'


import Layout from '../components/Layout'
import ReceptionsTab from '../components/Tabs/ReceptionsTab'

export default function receptions(props) {
  const { receptionBlock, setReceptionBlock } = props
  return (
    <Layout pageTitle={'Recepciones'} receptionBlock={receptionBlock}>
      
      <ReceptionsTab />
    </Layout>
  )
}
