import { Grid, TextField, Button, Switch, FormControlLabel, Autocomplete } from '@mui/material'
import { React, useState } from 'react'
import AppErrorSnack from '../../AppErrorSnack/AppErrorSnack'
import AppPaper from '../../AppPaper'
import { useRouter } from 'next/router'
import { updateTrays } from '../../../promises/pallets'

const trays = require('../../../promises/trays')
const records = require('../../../promises/records')

export default function NewMaterialForm(props) {
    const { updateGrid } = props
    const router = useRouter()
    const [userId, setUserId] = useState(router.query.userId)
    const [openErrorSnack, setOpenErrorSnack] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [materialData, setMaterialData] = useState(materialDataDefault())

    const handleOnChange = (e) => {
        setMaterialData({
            ...materialData,
            [e.target.name]: e.target.value
        })
    }

    const submit = (e) => {
        e.preventDefault()
        trays.create(
            materialData.name,
            materialData.weight
        )
            .then(res => {
                records.create(
                    'materiales',
                    'crea',
                    'material ' + res.id + ', ' + materialData.name,
                    userId
                )
                    .then(() => {
                        setMaterialData(materialDataDefault())
                        updateGrid()
                    })
                    .catch(err => { console.log(err) })
            })
            .catch(err => {
                console.log(err)
                if (err.errors[0].message == 'name must be unique') {
                    setErrorText('El nombre del material ya existe')
                    setOpenErrorSnack(true)
                }
            })
    }

    return (
        <>
            <AppPaper title='Nueva bandeja'>
                <form onSubmit={submit}>
                    <Grid container={true} spacing={1} direction="column" sx={{ p: 2 }}>
                        <Grid item>
                            <TextField label="Nombre"
                                name="name"
                                value={materialData.name}
                                onChange={handleOnChange}
                                type={'text'}
                                variant="outlined"
                                size={'small'}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item paddingTop={1}>
                            <TextField label="Peso Kg"
                                name="weight"
                                value={materialData.weight}
                                onChange={handleOnChange}
                                type={'number'}
                                inputProps={{ step: "0.01" }}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item paddingTop={1} textAlign={'right'}>
                            <Button variant={'contained'} type='submit' >Guardar</Button>
                        </Grid>
                    </Grid>
                </form>
            </AppPaper>
            <AppErrorSnack openSnack={openErrorSnack} setOpenSnack={setOpenErrorSnack} errorText={errorText} />
        </>
    )
}

function materialDataDefault() {
    return ({
        name: '',
        weight: 0.0

    })
}
