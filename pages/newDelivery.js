import { Button, TextField, Typography } from '@mui/material'
import {React, useState} from 'react'
import Layout from '../components/Layout'

export default function newDelivery(props) {
    const { receptionBlock, setReceptionBlock } = props
    const [alexName, setAlexName] = useState('')
    return (
        <>
            <Layout pageTitle={'Nuevo despacho'} receptionBlock={receptionBlock}>
                 <Typography fontSize={20}>this is Name: {alexName}</Typography>
                 <TextField 
                 value={alexName}
                 onChange={(e) => {
                    setAlexName(e.target.value)
                 }}
                 />
            </Layout>
            <Button variant={'contained'} onClick={() => {setAlexName('')}}>Borrar</Button>
        </>
    )
}

