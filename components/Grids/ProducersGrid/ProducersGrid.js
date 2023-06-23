import { React, useState, useEffect } from 'react'
import AppDataGrid from '../../AppDataGrid'
import AppDialog from '../../AppDialog/AppDialog'
import { Grid, TextField, Button } from '@mui/material'
import { GridActionsCellItem } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import UpdateProducerForm from '../../Forms/UpdateProducerForm'
import { useRouter } from 'next/router'

const producers = require('../../../promises/producers')
const records = require('../../../promises/records')

export default function ProducersGrid(props) {
    const { update, updateState } = props
    const router = useRouter()
    const [userId, setUserId] = useState(router.query.userId)
    const [producersList, setproducersList] = useState([])
    const [selectedId, setSelectedId] = useState(0)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [selectedProducer, setSelectedProducer] = useState(selectedProducerDataDefault())
    const [gridApiRef, setGridApiRef] = useState(null)

    useEffect(() => {
        producers.findAll()
            .then(res => {
                let data = res.map(item => ({
                    id: item.id,
                    rut: item.rut,
                    name: item.name,
                    phone: item.phone,
                    mail: item.mail,
                    address: item.address,
                    type: typeProducer(item.type)
                }))
                setproducersList(data)
            })
            .catch(err => {
                console.log(err)
            })

    }, [updateState])

    useEffect(() => {
        producers.findOneById(selectedId)
            .then(res => {
                if (res != null) {
                    setSelectedProducer({
                        id: res.id,
                        rut: res.rut,
                        name: res.name,
                        phone: res.phone,
                        mail: res.mail,
                        address: res.address
                    })

                }
            })
            .catch(err => { console.log(err) })
    }, [selectedId])

    const closeEditDialog = () => {
        setOpenEditDialog(false)
    }

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', hide: true },
        { field: 'rut', headerName: 'Rut', flex: 1 },
        { field: 'name', headerName: 'Nombre', flex: 2.5 },
        { field: 'phone', headerName: 'Teléfono', flex: .55 },
        { field: 'address', headerName: 'Dirección', flex: 1.5 },
        { field: 'mail', headerName: 'Mail', flex: 1.3, hide: true },
        { field: 'type', headerName: 'tipo', flex: 1.3},
        {
            field: 'actions',
            headerName: '',
            type: 'actions', flex: 1, getActions: (params) => [
                <GridActionsCellItem
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => { setSelectedId(params.id), setOpenDeleteDialog(true) }}
                />,
                <GridActionsCellItem
                    label='update'
                    icon={<EditIcon />}
                    onClick={() => { setSelectedId(params.id), setOpenEditDialog(true) }}
                />

            ]
        }

    ]

    const destroyProducer = () => {
        producers.destroy(selectedId)
            .then(() => {
                records.create('productores', 'elimina', 'productor ' + selectedId + ', ' + selectedProducer.name, userId)
                    .then(() => {
                        update()
                        setOpenDeleteDialog(false)
                    })
                    .catch(err => {console.log(err)})
            })
            .catch(err => { console.log(err) })
    }





    return (
        <>
            <AppDataGrid title='Productores' rows={producersList} columns={columns} height='37rem' setGridApiRef={setGridApiRef}></AppDataGrid>
            <AppDialog
                openDialog={openDeleteDialog}
                closeDialog={() => { setOpenDeleteDialog(false) }}
                title='Eliminar productor'
                renderActions={true}
                actions={<Button variant={'contained'} onClick={destroyProducer}>Eliminar</Button>}
            >
                <Grid container paddingTop={1} paddingLeft={1} paddingRight={1}>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            label='Rut'
                            value={selectedProducer.rut}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="standard"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            label='Nombre'
                            value={selectedProducer.name}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="standard"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} paddingTop={1} textAlign='right'>
                    </Grid>
                </Grid>
            </AppDialog>
            <AppDialog
                openDialog={openEditDialog}
                closeDialog={() => { setOpenEditDialog(false) }}
                title='Editar productor'
                renderActions={false}
            >
                <UpdateProducerForm closeDialog={closeEditDialog} producerData={selectedProducer} setProducerData={setSelectedProducer} updateGrid={update}></UpdateProducerForm>
            </AppDialog>
        </>
    )
}

function selectedProducerDataDefault() {
    return ({
        id: 0,
        rut: '',
        name: '',
        phone: '',
        mail: '',
        address: ''
    })
}


function typeProducer(value) {
    let str = ''
    if (value == 0) {
        str = 'Productor'
    } else if (value == 1) {
        str = 'Empresa'
    }

    return str
}