import { Grid } from '@mui/material'
import {React, useState} from 'react'
import NewProducerForm from '../components/Forms/NewProducerForm'
import ProducersGrid from '../components/Grids/ProducersGrid/ProducersGrid'
import Layout from '../components/Layout'

export default function producers(props) {
    const {receptionBlock, setReceptionBlock} = props
    const [producersGridState, setProducersGridState] = useState(false)

    const updateProducersGrid = () => {
        let gridState = producersGridState == false ? true : false
        setProducersGridState(gridState)
    }
    return (
        <Layout pageTitle={'Productores / Clientes'} receptionBlock={receptionBlock}>
            <Grid container spacing={1}>
                <Grid item xs={4} sm={4} md={4}>
                    <NewProducerForm updateProducersGrid={updateProducersGrid}></NewProducerForm>
                </Grid>
                <Grid item xs={8} sm={8} md={8}>
                    <ProducersGrid updateState={producersGridState} update={updateProducersGrid}></ProducersGrid>
                </Grid>

            </Grid>
        </Layout>
    )
}
