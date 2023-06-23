import { Button, TextField, Grid } from '@mui/material'
import { React, useState, useEffect } from 'react'
import { GridActionsCellItem } from '@mui/x-data-grid'
import InfoIcon from '@mui/icons-material/Info'
import DeleteIcon from '@mui/icons-material/Delete'
import AppDialog from '../../AppDialog/AppDialog'
import AppDataGrid from '../../AppDataGrid'
import { useRouter } from 'next/router'



const users = require('../../../promises/users')
const records = require('../../../promises/records')

export default function UsersGrid(props) {
    const { updateState } = props
    const router = useRouter()
    const [userId, setUserId] = useState(router.query.userId)
    const [usersList, setUsersList] = useState([])
    const [selectedId, setSelectedId] = useState(0)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [selectedUser, setSelectedUser] = useState(selectedUserDataDefault())
    const [gridApiRef, setGridApiRef] = useState(null)


    useEffect(() => {
        users.findAll()
            .then(res => {
                let data = res.map(item =>
                ({
                    id: item.id,
                    user: item.user,
                    name: item.name,
                    phone: item.phone,
                    mail: item.mail,
                    address: item.addres,
                    profileName: item.Profile.name
                })
                )
                setUsersList(data)
            })

    }, [updateState])

    useEffect(() => {
        users.findOneById(selectedId)
            .then(res => {
                setSelectedUser({
                    user: res.user,
                    name: res.name
                })
            })
            .catch(err => {
                console.log(err)
            })

    }, [selectedId])


    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', hide: true },
        { field: 'user', headerName: 'Usuario', flex: 1 },
        { field: 'name', headerName: 'Nombre', flex: 2.5 },
        { field: 'phone', headerName: 'Teléfono', flex: .55 },
        { field: 'profileName', headerName: 'Perfil', flex: 1 },
        { field: 'address', headerName: 'Dirección', flex: 1.5 },
        { field: 'mail', headerName: 'Mail', flex: 1.3, hide: true },
        {
            field: 'actions',
            headerName: '',
            type: 'actions', flex: 1, getActions: (params) => [
                <GridActionsCellItem
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => { setSelectedId(params.id), setOpenDeleteDialog(true) }}
                />
            ]
        }

    ]


    return (
        <>
            <AppDataGrid title='Usuarios' rows={usersList} columns={columns} height='34rem' setGridApiRef={setGridApiRef}></AppDataGrid>
            <AppDialog
                openDialog={openDeleteDialog}
                closeDialog={() => { setOpenDeleteDialog(false) }}
                title='Eliminar usuario'
                renderActions={true}
                actions={<Button variant={'contained'}>Eliminar</Button>}
            >
                <Grid container paddingTop={1}>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            label='user'
                            value={selectedUser.user}
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
                            value={selectedUser.name}
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
        </>

    )
}

function selectedUserDataDefault() {
    return ({
        user: '',
        name: ''
    })
}
