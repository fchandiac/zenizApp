import { Card, CardContent, Typography, Grid, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { React, useState, useEffect } from 'react'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

const receptions = require('../../../promises/receptions')

export default function ReceptionDetailCard(props) {
  const { receptionDetail } = props
  const [producer, setProducer] = useState('')

  useEffect(() => {
    receptions.findOneById(receptionDetail.ReceptionId)
      .then(res => { setProducer(res.Producer.name) })
      .catch(err => { console.error(err) })

  }, [])

  return (
    <>
      <Card variant={'outlined'}>
        <Box sx={{ 'backgroundColor': '#bdbdbd', 'padding': 1 }}>
          <Typography fontSize={12}>Detalle: {receptionDetail.id}</Typography>
        </Box>


          <Grid direction={'column'}>
            <Grid item padding={1}>
              <Typography fontSize={12}>Recepción: {receptionDetail.ReceptionId}</Typography>
              <Typography fontSize={12}>Productor: {producer}</Typography>
              <Typography fontSize={12}>Bandejas: {receptionDetail.trays_quanty}</Typography>
              <Typography fontSize={12}>Kg Bruto: {receptionDetail.gross}</Typography>
            </Grid>
            <Grid item textAlign={'right'} padding={1}>
              <IconButton size='small'><ExitToAppIcon /></IconButton>
            </Grid>
          </Grid>


  
      </Card>
    </>
  )
}
