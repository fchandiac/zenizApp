import { React, useState, useEffect } from 'react'
import AppDataGrid from '../../AppDataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Dialog, Grid, DialogActions, DialogTitle, Button, DialogContent, TextField } from '@mui/material'
import moment from 'moment'

const trays = require('../../../promises/trays')
const utils = require('../../../utils')

export default function TraysMovementsGrid(props) {
    const { update } = props
    const [movementsList, setMovementsList] = useState([])
    const [gridApiRef, setGridApiRef] = useState(null)

    useEffect(() => {
        trays.findAllMovements()
            .then(res => {
                let data = res.map(item => ({
                    id: item.id,
                    quanty: item.quanty,
                    type: typeMovement(item.type),
                    producer: item.Producer == null? 'sin dato':  item.Producer.name,
                    rut: item.Producer == null? 'sin dato': item.Producer.rut,
                    tray: item.Tray == null? 'sin dato': item.Tray.name,
                    stock: item.Tray == null? 'sin dato': item.stock_balance,

                    createdAt: item.createdAt
                }))
                setMovementsList(data)

            })
            .catch(err => { console.error(err) })
    }, [update])

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number' },
        { field: 'quanty', headerName: 'Cantidad', flex: .7 },
        { field: 'type', headerName: 'Movimiento', flex: .7, type: 'number' },
        { field: 'producer', headerName: 'Productor / Empresa', flex: 1.5},
        { field: 'rut', headerName: 'Rut', flex: .8},
        { field: 'tray', headerName: 'Bandeja', flex: .8},
        { field: 'stock', headerName: 'Stock', flex: .8,  type: 'number'},
        { field: 'createdAt', headerName: 'Fecha', flex: 1, valueFormatter: (params) => (moment(params.value).format('DD-MM-YYYY HH:mm')) },
      ]

    return (
        <>
            <AppDataGrid title='Movimientos' rows={movementsList} columns={columns} height='34rem' setGridApiRef={setGridApiRef} />
        </>
    )
}


function typeMovement(value){
    let str = ''
    if(value == 0){
        str= 'Ingreso'
    } else if(value ==1){
        str='Egreso'
    }
    return str
}