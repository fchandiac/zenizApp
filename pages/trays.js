import { Grid } from '@mui/material'
import { React, useState } from 'react'
import NewMaterialForm from '../components/Forms/NewMateriaForm/NewMaterialForm'
import NewTrayMovementForm from '../components/Forms/NewTrayMovementForm/NewTrayMovementForm'
import MaterialsGrid from '../components/Grids/MaterialsGrid'
import TraysMovementsGrid from '../components/Grids/TraysMovementsGrid'
import Layout from '../components/Layout'
import MaterialsTab from '../components/Tabs/MaterialsTab'

export default function materialsBank(props) {
    const { receptionBlock, setReceptionBlock } = props
    return (
        <Layout pageTitle='Bandejas' receptionBlock={receptionBlock}>
            <MaterialsTab

                materialsContent={MaterialsContent()}

                movementsContent={MovementsContent()}

            />
        </Layout>
    )
}


function MaterialsContent() {
    const [materialGridState, setMaterialGridState] = useState(false)

    const updateMaterialGrid = () => {
        let gridState = materialGridState == false ? true : false
        setMaterialGridState(gridState)
    }
    return (
        <Grid container={true} spacing={1} >
            <Grid item xs={4} sm={4} md={4}>
                <NewMaterialForm updateGrid={updateMaterialGrid} />
            </Grid>
            <Grid item xs={8} sm={8} md={8}>
                <MaterialsGrid update={materialGridState} />
            </Grid>
        </Grid>
    )
}

function MovementsContent() {
    const [movementsGridState, setMovementsGridState] = useState(false)

    const updateMovementsGridState = () => {
        let gridState = movementsGridState == false ? true : false
        setMovementsGridState(gridState)
    }
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={3} sm={3} md={3}>
                    <NewTrayMovementForm updateGrid={updateMovementsGridState}/>
                </Grid>
                <Grid item xs={9} sm={9} md={9}>
                    <TraysMovementsGrid update={movementsGridState}/>
                </Grid>
            </Grid>
        </>
    )

}