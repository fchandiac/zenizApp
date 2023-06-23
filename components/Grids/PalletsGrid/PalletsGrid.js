import moment from 'moment'
import { React, useState, useEffect } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import AppDataGrid from '../../AppDataGrid'
import AppPaper from '../../AppPaper'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Dialog, DialogTitle, DialogActions, DialogContent, Grid, TextField, Button } from '@mui/material'
import ReceptionDetailCard from '../../Cards/ReceptionDetailCard/ReceptionDetailCard'

const pallets = require('../../../promises/pallets')

export default function PalletsGrid() {
  const [gridApiRef, setGridApiRef] = useState(null)
  const [rowData, setRowData] = useState(rowDataDefault())
  const [palletsList, setPalletsList] = useState([])
  const [openInfoDialog, setOpenInfoDialog] = useState(false)

  useEffect(() => {
    pallets.findAll()
      .then(res => {
        let data = res.map(item => ({
          id: item.id,
          variety: item.Variety.name,
          trays: item.trays,
          storage: item.Storage.name,
          weight: item.weight,
          max: item.max,
          receptionsDetails: item.Receptionsdetails,
          createdAt: moment(item.createdAt).format('DD-MM-YYYY HH:ss'),
          updatedAt: moment(item.updatedAt).format('DD-MM-YYYY HH:ss')
        }))
        setPalletsList(data)
      })
      .catch(err => { console.error(err) })
  }, [])

  const totalGross = (receptionsDetails) => {
    let total = 0

    receptionsDetails.map(item => {
      total = total + item.gross
    })

    return total
  }


  const columns = [
    { field: 'id', headerName: 'Id', flex: .5, type: 'number' },
    { field: 'variety', headerName: 'Variedad', flex: 1.5 },
    { field: 'trays', headerName: 'Cant Bj', flex: 1, type: 'number' },
    { field: 'max', headerName: 'Capacidad', flex: 1, type: 'number' },
    { field: 'weight', headerName: 'Peso pallet', flex: 1, type: 'number' },
    { field: 'storage', headerName: 'Bodega', flex: 1 },
    { field: 'createdAt', headerName: 'Creado', flex: 1, type: 'date' },
    { field: 'updatedAt', headerName: 'Modificado', flex: 1, type: 'date' },
    {
      field: 'actions',
      headerName: '',
      type: 'actions', flex: .5, getActions: (params) => [

        <GridActionsCellItem
          label='view'
          icon={<InfoIcon />}
          onClick={() => {
            setRowData({
              ...rowData,
              id: params.row.id,
              storage: params.row.storage,
              totalGross: totalGross(params.row.receptionsDetails),
              receptionDetails: params.row.receptionsDetails,
              trays: params.row.trays,
              max : params.row.max,
              weight: params.row.weight
            })
            setOpenInfoDialog(true)
          }}
        />
      ]
    }
  ]
  return (
    <>
      <AppDataGrid title='Pallets' rows={palletsList} columns={columns} height='34rem' setGridApiRef={setGridApiRef} />
      <Dialog open={openInfoDialog} maxWidth={'sm'} fullWidth>
        <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
          Información pallet
        </DialogTitle>
        <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
          <Grid container sx={{ p: 1 }} spacing={1} direction="column">
            <Grid item>
              <TextField
                label='Id'
                value={rowData.id}
                InputProps={{
                  readOnly: true,
                }}
                variant={'outlined'}
                size={'small'}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField label="Bodega"
                value={rowData.storage}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                size={'small'}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField label="Bandejas"
                value={rowData.trays}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                size={'small'}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField label="Capcidad maxima"
                value={rowData.max}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                size={'small'}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField label="Peso Kg pallet"
                value={rowData.weight}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                size={'small'}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField label="Total Kg bruto"
                value={rowData.totalGross}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                size={'small'}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField label="Total Kg pallet + bruto"
                value={rowData.totalGross + rowData.weight}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                size={'small'}
                fullWidth
              />
            </Grid>
            <Grid item>
              <AppPaper title={'Detalle de recepciones'}>
                <Grid container spacing={1} sx={{ p: 1 }}>
                  {rowData.receptionDetails.map((item => (
                    <Grid item key={item.id} sx={4} sm={4} md={4} >
                      <ReceptionDetailCard receptionDetail={item} />
                    </Grid>
                  )))}
                </Grid>
              </AppPaper>
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Button variant={'outlined'} onClick={() => { setOpenInfoDialog(false) }} >cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function rowDataDefault() {
  return ({
    id: null,
    storage: null,
    totalGross:0,
    receptionDetails: [],
    trays: 0,
    max:0,
    weight:0


  })
}