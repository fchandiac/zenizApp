import { Grid } from '@mui/material'
import React from 'react'
import RecordsGrid from '../components/Grids/RecordsGrid/RecordsGrid'
import Layout from '../components/Layout/Layout'

export default function records(props) {
  const { receptionBlock, setReceptionBlock } = props
  return (
    <Layout pageTitle='Registros'>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12}>
          <RecordsGrid></RecordsGrid>
        </Grid>
      </Grid>
    </Layout>
  )
}
