import { Grid, Autocomplete, TextField } from '@mui/material'
import { React, useState, useEffect } from 'react'
import AppPaper from '../components/AppPaper'
import NewStorageForm from '../components/Forms/NewStorageForm/NewStorageForm'
import PalletsGrid from '../components/Grids/PalletsGrid/PAlletsGrid'
import Layout from '../components/Layout'
import PalletsTab from '../components/Tabs/PalletsTab'

const storages = require('../promises/storages')

export default function pallets(props) {
    const { receptionBlock, setReceptionBlock } = props



    return (
        <>
            <Layout pageTitle={'Pallets'} receptionBlock={receptionBlock}>
                <PalletsTab palletsContent={PalletsContent()} storagesContent={StoragesContent()} />

            </Layout>
        </>
    )
}


function PalletsContent() {
    return (
        <>
            <PalletsGrid />
        </>
    )
}

function StoragesContent() {
    const [storagesOptions, setStoragesOptions] = useState('')
    const [storagesInput, setStoragesInput] = useState('')
    const [storageData, setStorageData] = useState(storageDataDefault())
    const [updateStragesOptions, setUpdateStragesOptions] = useState(false)

    useEffect(() => {
        storages.findAll()
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    id: item.id,
                    label: item.name,
                    name: item.name
                }))
                setStoragesOptions(data)
            })
            .catch(err => { console.error(err) })
    }, [[], updateStragesOptions])

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={3} sm={3} md={3}>
                    <Grid container spacing={1} direction={'column'}>
                        <Grid item>
                            <NewStorageForm updateStragesOptions={updateStragesOptions} setUpdateStragesOptions={setUpdateStragesOptions}/>
                        </Grid>
                        <Grid item>
                            <AppPaper title={'Selección de bodega'}>
                                <Grid container spacing={1} direction={'column'} p={1}>
                                    <Grid item>
                                        <Autocomplete
                                            inputValue={storagesInput}
                                            onInputChange={(e, newInputValue) => {
                                                setStoragesInput(newInputValue);
                                            }}
                                            value={storageData.storage}
                                            isOptionEqualToValue={(option, value) => null || option.id === value.id}
                                            getOptionLabel={(option) => option.label}
                                            onChange={(e, newValue) => {
                                                setStorageData({ ...storageData, storage: newValue })
                                            }}
                                            disablePortal
                                            options={storagesOptions}
                                            renderInput={(params) => <TextField {...params} label='Bodega' size={'small'} fullWidth required />}
                                        />
                                    </Grid>
                                </Grid>
                            </AppPaper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={9} sm={9} md={9}>
                    <AppPaper title={'Pallets en ' + ( storageData.storage == null? 'bodega': storageData.storage.name)}>

                    </AppPaper>
                </Grid>
            </Grid>
        </>
    )
}

function storageDataDefault() {
    return ({
        storage: null
    })
}