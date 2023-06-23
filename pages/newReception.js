import React from 'react'
import NewReceptionForm from '../components/Forms/NewReceptionForm'
import Layout from '../components/Layout'

export default function newReception(props) {
    const {receptionBlock, setReceptionBlock} = props
   
    return (
        <>
            <Layout pageTitle='Nueva Recepción' receptionBlock={receptionBlock}>
                <NewReceptionForm setReceptionBlock={setReceptionBlock}/>
            </Layout>
        </>
    )
}
