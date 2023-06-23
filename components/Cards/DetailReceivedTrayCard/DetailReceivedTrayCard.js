import { Card, Grid, Typography } from '@mui/material'
import React from 'react'
const utils = require('../../../utils')

export default function DetailReceivedTrayCard(props) {
    const { id, name, quanty, traysWeight, gross, net, impurity, discount, pay } = props
    return (
        <>

            <Grid container spacing={.4} sx={{ borderColor: 'black', border: 'solid', borderWidth: '1px', borderRadius: '5px' }}>
                <Grid item container xs={12} sm={12} md={12} sx={{ borderBottom: 'solid', borderWidth: '1px' }}>
                    <Grid item xs={4} sm={4} md={4}>
                        <Typography fontSize={12}>
                            Nº {id}
                        </Typography>
                    </Grid>
                    <Grid item xs={8} sm={8} md={8}>
                        <Typography fontSize={10}>
                            tipo bandeja: {name}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Typography fontSize={10}>
                        cant: {quanty}
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Typography fontSize={10}>
                        kg bandejas: {traysWeight}
                    </Typography>
                </Grid>
                <Grid item xs={3} sm={3} md={3}>
                    <Typography fontSize={10}>
                        kg bruto: {gross}
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Typography fontSize={10}>
                        kg neto: {net}
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Typography fontSize={10}>
                        % impurezas: {impurity}
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Typography fontSize={10}>
                        descuento: {discount}
                    </Typography>
                </Grid>
                <Grid item xs={8} sm={8} md={8}>
                    <Typography fontSize={10}>
                        subtotal a pagar: {utils.renderMoneystr(pay)}
                    </Typography>
                </Grid>
            </Grid>
        </>
    )
}
