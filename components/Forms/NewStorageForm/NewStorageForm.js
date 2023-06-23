import { Button, Grid, TextField } from '@mui/material'
import { React, useState } from 'react'
import AppErrorSnack from '../../AppErrorSnack'
import AppPaper from '../../AppPaper'

const storages = require('../../../promises/storages')

export default function NewStorageForm(props) {
    const {updateStragesOptions, setUpdateStragesOptions} = props
    const [storageData, setStorageData] = useState(storageDataDefault())
    const [textError, setTextError] = useState('')
    const [openSnack, setOpenSnack] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        storages.create(storageData.name)
        .then(() => {
            let updateStorage = updateStragesOptions == false? true: false
            setUpdateStragesOptions(updateStorage)
            setStorageData(storageDataDefault())
        })
        .catch(err => {
            console.error(err)
            if (err.errors[0].message == 'name must be unique') {
                setTextError('El nombre de bodega ya esta ocupado')
                setOpenSnack(true)
            }
        })

    }
    return (
        <>
            <AppPaper title={'Nueva bodega'}>
                <form onSubmit={submit}>
                    <Grid padding={1} container spacing={1} direction={'column'}>
                        <Grid item>
                            <TextField
                                label='Nombre'
                                value={storageData.name}
                                onChange={(e) => setStorageData({...storageData, name: e.target.value})}
                                size={'small'}
                                variant={'outlined'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item textAlign={'right'}>
                            <Button variant={'contained'} type={'submit'}>guardar</Button>
                        </Grid>
                    </Grid>
                </form>
            </AppPaper>
            <AppErrorSnack openSnack={openSnack} setOpenSnack={setOpenSnack} errorText={textError} />
        </>
    )
}

function storageDataDefault() {
    return ({
        name: ''
    })
}
