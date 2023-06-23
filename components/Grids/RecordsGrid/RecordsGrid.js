import { React, useState, useEffect } from 'react'
import AppDataGrid from '../../AppDataGrid'
import moment from 'moment'

const records = require('../../../promises/records')


export default function RecordsGrid() {

    const [recordsList, setRecordsList] = useState([])
    const [gridApiRef, setGridApiRef] = useState(null)

    useEffect(() => {
        records.findAll()
            .then(res => {
                let data = res.map(item =>
                ({
                    id: item.id,
                    table: item.table,
                    action: item.action,
                    description: item.description,
                    user: item.User.name,
                    createdAt: moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')
                })
                )
                setRecordsList(data)
            })
    }, [])

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number' },
        { field: 'table', headerName: 'Registro', flex: 1 },
        { field: 'action', headerName: 'Acción', flex: 1 },
        { field: 'description', headerName: 'Descripción', flex: 2.5 },
        { field: 'user', headerName: 'Nombre de usuario', flex: 1.5 },
        { field: 'createdAt', headerName: 'Fecha', flex: 1 }
    ]

    return (
        <>
            <AppDataGrid title='Registros' rows={recordsList} columns={columns} height='37rem' setGridApiRef={setGridApiRef}></AppDataGrid>
        </>
    )
}
