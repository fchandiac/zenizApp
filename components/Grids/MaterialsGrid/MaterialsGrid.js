import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, FormControlLabel, Switch } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import { GridActionsCellItem } from '@mui/x-data-grid'
import moment from 'moment'
import { React, useState, useEffect } from 'react'
import AppDataGrid from '../../AppDataGrid'
import { useRouter } from 'next/router'

const materials = require('../../../promises/trays')
const records = require('../../../promises/records')

export default function MaterialsGrid(props) {
    const { update } = props
    const [gridApiRef, setGridApiRef] = useState(null)
    const [materialsList, setMaterialsList] = useState([])
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openViewDialog, setOpenViewDialog] = useState(false)
    const [rowData, setRowData] = useState([])


    useEffect(() => {
        materials.findAll()
            .then(res => {
                let data = res.map(item => ({
                    id: item.id,
                    name: item.name,
                    weight: item.weight,
                    stock: item.stock,
                    createdAt: moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')
                }))
                setMaterialsList(data)
            })
    }, [update])


    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number' },
        { field: 'type', headerName: 'Tipo', flex: 1 },
        { field: 'name', headerName: 'Nombre', flex: 1.5 },
        { field: 'weight', headerName: 'Peso', flex: 1, type: 'number' },
        { field: 'stock', headerName: 'Stock', flex: 1, type: 'number' },
        { field: 'createdAt', headerName: 'Creado', flex: 1, type: 'date' },
        {
            field: 'actions',
            headerName: '',
            type: 'actions', flex: .5, getActions: (params) => [
                <GridActionsCellItem
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            name: params.row.name,
                            weight: params.row.weight,
                            stock: params.row.stock
                        })
                        setOpenDeleteDialog(true)
                    }}
                />,
                <GridActionsCellItem
                    label='view'
                    icon={<InfoIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            name: params.row.name,
                            weight: params.row.weight,
                            stock: params.row.stock
                        })
                        setOpenViewDialog(true)
                    }}
                />
            ]
        }
    ]

    return (
        <>
            <AppDataGrid title='bandejas' rows={materialsList} columns={columns} height='37rem' setGridApiRef={setGridApiRef} />
            <DeleteDialog open={openDeleteDialog} close={() => { setOpenDeleteDialog(false) }} rowData={rowData} gridApiRef={gridApiRef} />
            <ViewDialog open={openViewDialog} close={() => { setOpenViewDialog(false) }} rowData={rowData} setRowData={setRowData} gridApiRef={gridApiRef} />
        </>
    )
}

function DeleteDialog(props) {
    const { open, close, rowData, gridApiRef } = props
    const router = useRouter()
    const [userId, setUserId] = useState(router.query.userId)

    const destroy = () => {
        materials.destroy(rowData.id)
            .then(() => {
                records.create(
                    'materiales',
                    'elimina',
                    'material ' + rowData.id + ', ' + rowData.name,
                    userId
                )
                    .then(() => {
                        gridApiRef.current.updateRows([{ id: rowData.rowId, _action: 'delete' }])
                        close()
                    })
                    .catch(err => { console.log(err) })
            })
            .catch(err => { console.log(err) })
    }
    return (
        <Dialog open={open} maxWidth={'xs'} fullWidth>
            <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                Eliminar bandeja
            </DialogTitle>
            <DialogContent sx={{ paddingLeft: 2, paddingRight: 2 }}>
                <Grid container spacing={1} direction="column" paddingTop={1}>
                    <Grid item>
                        <TextField label="Id"
                            value={rowData.id}
                            type={'text'}
                            variant={'outlined'}
                            InputProps={{
                                readOnly: true,
                              }}
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item paddingTop={1}>
                        <TextField label="Nombre"
                            value={rowData.name}
                            type={'text'}
                            variant={'outlined'}
                            InputProps={{
                                readOnly: true,
                              }}
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ paddingLeft: 2, paddingRight: 2, paddingBottom: 2 }}>
                <Button variant={'contained'} onClick={destroy}>Eliminar</Button>
                <Button variant={'outlined'} onClick={close}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    )
}

function ViewDialog(props) {
    const { open, close, rowData, setRowData, gridApiRef } = props
    const router = useRouter()
    const [userId, setUserId] = useState(router.query.userId)


    const handleOnChange = (e) => {
        setRowData({
            ...rowData,
            [e.target.name]: e.target.value
        })
    }

    const update = () => {
        materials.update(rowData.id, rowData.name, rowData.weight, rowData.stock, rowData.tray)
            .then(() => {
                records.create(
                    'materiales',
                    'actualiza',
                    'material ' + rowData.id + ', nombre: ' + rowData.name + ' peso: ' + rowData.weight + ' stock: ' + rowData.stock,
                    userId
                )
                .then(() => {
                    gridApiRef.current.updateRows([{
                        id: rowData.rowId,
                        name: rowData.name,
                        weight: rowData.weight,
                        stock: rowData.stock,
                        tray: rowData.tray
                    }])
                    close()
                })
                .catch(err => {console.log(err)})
            })
            .catch(err => { console.log(err) })
        

    }
    return (
        <Dialog open={open} maxWidth={'xs'} fullWidth>
            <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                Información bandeja
            </DialogTitle>
            <DialogContent sx={{ paddingLeft: 2, paddingRight: 2 }}>
                <Grid container spacing={1} direction="column" paddingTop={1}>
                    <Grid item>
                        <TextField label="Id"
                            value={rowData.id}
                            type={'text'}
                            variant={'outlined'}
                            InputProps={{
                                readOnly: true,
                              }}
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item paddingTop={1}>
                        <TextField label="Nombre"
                            name='name'
                            value={rowData.name}
                            onChange={handleOnChange}
                            type={'text'}
                            variant={'outlined'}
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item paddingTop={1}>
                        <TextField label="Peso Kg"
                            name="weight"
                            value={rowData.weight}
                            onChange={handleOnChange}
                            type={'number'}
                            inputProps={{ step: "0.01" }}
                            variant={'outlined'}
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item paddingTop={1}>
                        <TextField label="Stock"
                            name="stock"
                            value={rowData.stock}
                            onChange={handleOnChange}
                            type={'number'}
                            InputProps={{
                                readOnly: true,
                              }}
                            variant={'outlined'}
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ paddingLeft: 2, paddingRight: 2, paddingBottom: 2 }}>
                <Button variant={'contained'} onClick={update}>Actualizar</Button>
                <Button variant={'outlined'} onClick={close}>Cerrar</Button>
            </DialogActions>
        </Dialog>

    )
}


function setTypeString(type){
    let string = ''
    if (type == 0) {
        string = 'Bandeja'
    } else if (type == 1){
        string = 'Pallet'
    } else if (type == 2){
        string = 'Otro'
    }

    return string
}