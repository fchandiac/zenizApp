import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { React, useState } from 'react'
import AppErrorSnack from '../../AppErrorSnack/AppErrorSnack'
import AppPaper from '../../AppPaper'
import { useRouter } from 'next/router'

const utils = require('../../../utils')
const producers = require('../../../promises/producers')
const records = require('../../../promises/records')

export default function NewProducerForm(props) {
    const { updateProducersGrid } = props
    const router = useRouter()
    const [userId, setUserId] = useState(router.query.userId)
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [producerData, setProducerData] = useState(producerDataDefault())


    const submit = (e) => {
        e.preventDefault()
        producers.create(producerData.rut, producerData.name, producerData.phone, producerData.mail, producerData.address, producerData.type)
            .then(() => {
                records.create('productores', 'crea', 'productor ' + producerData.name, userId)
                    .then(() => {
                        setProducerData(producerDataDefault())
                        updateProducersGrid()
                    })
                    .catch(err => { console.log(err) })
            })
            .catch(err => {
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
            <AppPaper title='Nuevo Productor / Cliente'>
                <form onSubmit={submit}>
                    <Grid container spacing={1} direction={'column'} padding={1}>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField label="Rut"
                                value={producerData.rut}
                                onChange={(e) => { setProducerData({ ...producerData, rut: utils.formatRut(e.target.value) }) }}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item>
                            <TextField label="Nombre"
                                value={producerData.name}
                                onChange={(e) => {setProducerData({...producerData, name: e.target.value})}}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item>
                            <TextField label="Teléfono"
                                value={producerData.phone}
                                onChange={(e => {setProducerData({...producerData, phone: e.target.value})})}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField label="Dirección"
                                name="address"
                                value={producerData.address}
                                onChange={(e) => {setProducerData({...producerData, address: e.target.value})}}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item >
                            <TextField label="Mail"
                                value={producerData.mail}
                                onChange={(e) => {setProducerData({...producerData, mail: e.target.value})}}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <FormControl fullWidth size={'small'} required>
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    value={producerData.type}
                                    label="tipo"
                                    onChange={(e) => { setProducerData({ ...producerData, type: e.target.value }) }}
                                >
                                    <MenuItem value={0}>Productor</MenuItem>
                                    <MenuItem value={1}>Empresa</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid paddingTop={1} textAlign={'right'}>
                            <Button variant='contained' type='submit'>Guardar</Button>
                        </Grid>

                    </Grid>
                </form>
            </AppPaper>
            <AppErrorSnack openSnack={openSnack} errorText={errorText} setOpenSnack={setOpenSnack}></AppErrorSnack>
        </>
    )
}


function producerDataDefault() {
    return ({
        rut: '',
        name: '',
        phone: '',
        address: '',
        mail: '',
        type: 0
    })
}