import { Grid, TextField, Button, Autocomplete, FormControl, Select, MenuItem, InputLabel } from '@mui/material'
import { React, useState, useEffect } from 'react'
import AppErrorSnack from '../../AppErrorSnack'
import AppPaper from '../../AppPaper'

const trays = require('../../../promises/trays')
const producers = require('../../../promises/producers')

export default function NewTrayMovementForm(props) {
    const { updateGrid } = props
    const [trayOptions, setTrayOptions] = useState([])
    const [trayInput, setTrayInput] = useState('')
    const [producersOptions, setProducersOptions] = useState([])
    const [producerInput, setProducerInput] = useState('')
    const [movementData, setMovementData] = useState(movementDataDefault())

    useEffect(() => {
        producers.findAll()
            .then(res => {
                let data = res.map(item =>
                ({
                    key: item.id,
                    id: item.id,
                    label: item.name,
                    rut: item.rut,
                }))

                setProducersOptions(data)
            })
            .catch(err => { console.log(err) })
    }, [])

    useEffect(() => {
        trays.findAll()
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    id: item.id,
                    label: item.name,
                    weight: item.weight
                }))
                setTrayOptions(data)
            })
            .catch(err => { console.error(err) })
    }, [])

    const submit = (e) => {
        e.preventDefault()
        if (movementData.type == 0) {
            trays.inputStock(movementData.tray.id, movementData.quanty, movementData.producer.id)
                .then(() => {
                    setMovementData(movementDataDefault())
                    updateGrid()
                })
                .catch(err => { console.error(err) })
        } else if (movementData.type == 1) {
            trays.outputStock(movementData.tray.id, movementData.quanty, movementData.producer.id)
                .then(() => {
                    setMovementData(movementDataDefault())
                    updateGrid()
                })
                .catch(err => { console.error(err) })
        }
    }

    return (
        <>
            <AppPaper title={'Nuevo movimiento'}>
                <form onSubmit={submit}>
                    <Grid container spacing={1} padding={1} direction={'column'}>
                        <Grid item>
                            <Autocomplete
                                inputValue={producerInput}
                                onInputChange={(e, newInputValue) => {
                                    setProducerInput(newInputValue);
                                }}
                                value={movementData.producer}
                                isOptionEqualToValue={(option, value) => null || option.id === value.id}
                                getOptionLabel={(option) => option.label}
                                onChange={(e, newValue) => {
                                    setMovementData({ ...movementData, producer: newValue })
                                }}
                                disablePortal
                                options={producersOptions}
                                renderInput={(params) => <TextField {...params} label='Productor' size={'small'} fullWidth required />}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label='Rut'
                                value={(movementData.producer == null) ? '' : movementData.producer.rut}
                                InputProps={{
                                    readOnly: true,
                                }}
                                size={'small'}
                                variant={'outlined'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <Autocomplete
                                inputValue={trayInput}
                                onInputChange={(e, newInputValue) => {
                                    setTrayInput(newInputValue);
                                }}
                                value={movementData.tray}
                                isOptionEqualToValue={(option, value) => null || option.id === value.id}
                                getOptionLabel={(option) => option.label}
                                onChange={(e, newValue) => {
                                    setMovementData({ ...movementData, tray: newValue })
                                }}
                                disablePortal
                                options={trayOptions}
                                renderInput={(params) => <TextField {...params} label='Bandeja' size={'small'} fullWidth required />}
                            />
                        </Grid>
                        <Grid item>
                            <FormControl fullWidth size={'small'} required>
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    value={movementData.type}
                                    label="tipo"
                                    onChange={(e) => { setMovementData({ ...movementData, type: e.target.value }) }}
                                >
                                    <MenuItem value={0}>Ingreso</MenuItem>
                                    <MenuItem value={1}>Egreso</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <TextField label="Cantidad de bandejas"
                                value={(movementData.quanty == null) ? '' : movementData.quanty}
                                onChange={(e) => {
                                    setMovementData({ ...movementData, quanty: e.target.value })
                                }}
                                InputProps={{ inputProps: { min: 0 } }}
                                type={'number'}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item textAlign={'right'}>
                            <Button variant='contained' type='submit'>guardar</Button>
                        </Grid>
                    </Grid>
                </form>
            </AppPaper>
        </>
    )
}

function movementDataDefault() {
    return ({
        quanty: null,
        type: 0,
        tray: null,
        producer: null

    })
}



