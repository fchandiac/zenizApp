import { Grid, DialogActions, Button, TextField } from '@mui/material'
import { React, useState, useEffect } from 'react'
import AppErrorSnack from '../../AppErrorSnack/AppErrorSnack'
import { useRouter } from 'next/router'
const utils = require('../../../utils')

const producers = require('../../../promises/producers')
const records = require('../../../promises/records')

export default function UpdateProducerForm(props) {
    const { closeDialog, updateGrid, producerData, setProducerData } = props
    const router = useRouter()
    const [userId, setUserId] = useState(router.query.userId)
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')


    const handleRutOnChange = (e) => {
        e.target.value = utils.formatRut(e.target.value)
        handleOnChange(e)
    }


    const handleOnChange = (e) => {
        setProducerData({
            ...producerData,
            [e.target.name]: e.target.value
        })
    }


    const submit = (e) => {
        e.preventDefault()
        producers.update(
            producerData.id,
            producerData.rut,
            producerData.name,
            producerData.phone,
            producerData.mail,
            producerData.address
        ).then(() => {
            records.create(
                'productores',
                'actualiza',
                'productor ' + producerData.id,
                userId
            ).then(() => {
                updateGrid()
                closeDialog()
            }).catch(err => { console.log(err) })
        }).catch(err => {
            console.log(err)
            if (err.errors[0].message == 'rut must be unique') {
                setErrorText('El Rut ya existe en los registros')
                setOpenSnack(true)

            } else if (err.errors[0].message == 'name must be unique') {
                setErrorText('El Nombre ya existe en los registros')
                setOpenSnack(true)
            }
        })

    }

    return (
        <>
            <form onSubmit={submit}>
                <Grid container paddingTop={1} paddingLeft={1} paddingRight={1}>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField label="Rut"
                            name="rut"
                            value={producerData.rut}
                            onChange={handleRutOnChange}
                            variant="outlined"
                            size={'small'}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                        <TextField label="Nombre"
                            name="name"
                            value={producerData.name}
                            onChange={handleOnChange}
                            variant="outlined"
                            size={'small'}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                        <TextField label="Teléfono"
                            name="phone"
                            value={producerData.phone}
                            onChange={handleOnChange}
                            variant="outlined"
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                        <TextField label="Dirección"
                            name="address"
                            value={producerData.address}
                            onChange={handleOnChange}
                            variant="outlined"
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                        <TextField label="Mail"
                            name="mail"
                            value={producerData.mail}
                            onChange={handleOnChange}
                            variant="outlined"
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} marginTop={2.5} marginBottom={-1}>
                        <DialogActions sx={{ paddingRight: 0, paddingBottom: 0 }}>
                            <Button type='submit' variant='contained'>Actualizar</Button>
                            <Button variant={'outlined'} type='submit' onClick={() => { closeDialog() }}>cerrar</Button>
                        </DialogActions>
                    </Grid>

                </Grid>

            </form>
            <AppErrorSnack openSnack={openSnack} errorText={errorText} setOpenSnack={setOpenSnack}></AppErrorSnack>

        </>

    )
}

function producerDataDefault() {
    return ({
        id: 0,
        rut: '',
        name: '',
        phone: '',
        mail: '',
        address: ''
    })
}