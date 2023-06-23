import { React, useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Button, Grid, TextField } from '@mui/material'
import electron from 'electron'
import AppPaper from '../components/AppPaper/AppPaper'
const ipcRenderer = electron.ipcRenderer || false

export default function Home(props) {
    const {receptionBlock, setReceptionBlock} = props
    const [config, setConfig] = useState(configDataDefault())

    useEffect(() => {
        const readConfig = ipcRenderer.sendSync('read-config', 'sync');
        //console.log(readConfig)
        setConfig(readConfig)
    }, [])

    const textFieldOnChange = (e) => {
        setConfig({
            ...config,
            [e.target.name]: e.target.value
        })
    }

    const saveConfig = () => {
        ipcRenderer.send('write-config', config)
    }

    return (
        <Layout pageTitle='Configuración' receptionBlock={receptionBlock}>
        <Grid container sx={{ p: 1 }}>
            <Grid item xs={4} sm={4} md={4}>
                <AppPaper title='Servidor'>
                    <Grid container sx={{ p: 1 }}>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField label='API Server url' value={config.server_url} name='server_url' onChange={textFieldOnChange} size={'small'} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                            <TextField label='images_path' value={config.images_path} name='images_path' onChange={textFieldOnChange} size={'small'} fullWidth />
                        </Grid >
                        <Grid item xs={12} sm={12} md={12} paddingTop={1} textAlign='right'>
                            <Button variant='contained' onClick={saveConfig}>guardar</Button>
                        </Grid >
                    </Grid>
                </AppPaper>

            </Grid>
        </Grid>
    </Layout>
    )
}

function configDataDefault() {
    return ({
        server_url: '',
        images_path: ''
    })
}
