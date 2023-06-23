import {
    Grid, TextField, Autocomplete, Button, IconButton, Box, Icon, Card, Typography, Dialog, DialogTitle,
    DialogContent, DialogActions, Divider, Paper, TableContainer, TableRow, Table, TableBody, TableCell
} from '@mui/material'
import { DataGrid, esES, GridToolbarQuickFilter, useGridApiContext } from '@mui/x-data-grid'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import PrintIcon from '@mui/icons-material/Print'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { GridActionsCellItem } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { React, useState, useEffect, useRef } from 'react'
import AppPaper from '../../AppPaper'
import AppErrorSnack from '../../AppErrorSnack'
import DetailReceivedTrayCard from '../../Cards/DetailReceivedTrayCard/DetailReceivedTrayCard'
import ReactToPrint from 'react-to-print'
import moment from 'moment'
import electron from 'electron'
import { useRouter } from 'next/router'
const ipcRenderer = electron.ipcRenderer || false

const Barcode = require('react-barcode')


const producers = require('../../../promises/producers')
const varietyFruits = require('../../../promises/varietyFruits')
const typeFruits = require('../../../promises/typeFruits')
const trays = require('../../../promises/trays')
const utils = require('../../../utils')
const pallets = require('../../../promises/pallets')
const storages = require('../../../promises/storages')
const receptions = require('../../../promises/receptions')
const receptionsDetails = require('../../../promises/receptionsDetails')

export default function NewReceptionForm(props) {
    const { setReceptionBlock } = props
    const [receptionData, setReceptionData] = useState(receptionDataDefault())
    const [producersOptions, setProducersOptions] = useState([])
    const [producerInput, setProducerInput] = useState('')
    const [varietyOptions, setVarietyOptions] = useState([])
    const [varietyInput, setVarietyInput] = useState('')
    const [typeFruitOptions, setTypeFruitOptions] = useState([])
    const [typeInput, setTypeInput] = useState('')
    const [receivedTrays, setReceivedTrays] = useState([])
    const [updateGrid, setUpdateGrid] = useState(false)
    const [openPrintDialog, setOpenPrintDialog] = useState(false)
    const [varietyDisable, setVarietyDisable] = useState(false)
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [returnedTrays, setReturnedTrays] = useState([])
    const [openReturnedTraysDialog, setOpenReturnedTraysDialog] = useState(false)
    const [returnedTotal, setReturnedTotal] = useState(0)

    useEffect(() => {
        let total = 0
        returnedTrays.map(item => {
            total = total + parseInt(item.quanty)
        })

        setReturnedTotal(total)
    }, [returnedTrays])


    useEffect(() => {
        setReceptionBlock(receivedTrays.length >= 1 ? true : false)
    }, [receivedTrays])

    useEffect(() => {
        producers.findAll()
            .then(res => {
                let dataFilt = res.filter(item => item.type == 0)
                let data = dataFilt.map(item =>
                ({
                    key: item.id,
                    id: item.id,
                    label: item.name,
                    rut: item.rut
                })
                )
                setProducersOptions(data)
            })
            .catch(err => { console.log(err) })
    }, [])

    useEffect(() => {
        varietyFruits.findAll()
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    id: item.id,
                    label: item.name,
                    price: item.price
                }))
                setVarietyOptions(data)
            })
            .catch(err => { console.error(err) })
    }, [])

    useEffect(() => {
        typeFruits.findAll()
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    id: item.id,
                    label: item.name
                }))
                setTypeFruitOptions(data)
            })
            .catch(err => { console.log(err) })
    }, [])

    useEffect(() => {
        setUpdateGrid(updateGrid == false ? true : false)
    }, [receptionData.varietyFruit])

    useEffect(() => {
        let traysQuanty = 0
        let traysWeight = 0
        let gross = 0
        let net = 0
        let discount = 0
        let pay = 0
        receivedTrays.map(item => {
            traysQuanty = traysQuanty + parseInt(item.quanty)
            traysWeight = traysWeight + parseFloat(item.traysWeight)
            gross = gross + parseFloat(item.gross)
            net = net + parseFloat(item.net)
            discount = discount + (item.discount)
            pay = pay + parseInt(item.pay)

        })
        setReceptionData({ ...receptionData, traysQuanty: traysQuanty, traysWeight: traysWeight, gross: gross, net: net, discount: discount, pay: pay })
    }, [receivedTrays])

    const addReturnedTrays = () => {

    }


    const reStart = () => {
        if (receivedTrays.length >= 1) {
            let promiseList = []
            receivedTrays.map(item => {
                console.log(item)
                promiseList.push(restorePalletPromise(item.palletId, item.quanty))
            })
            Promise.all(promiseList)
                .then(() => {
                    setVarietyDisable(varietyDisable == true ? false : true)
                    setReceptionData(receptionDataDefault())
                    setReceivedTrays([])
                })
                .catch(err => { console.error(err) })
        } else {
            setVarietyDisable(varietyDisable == true ? false : true)
            setReceptionData(receptionDataDefault())

        }
        console.log(receivedTrays)
    }

    const finishSaveEvent = () => {
        setReceptionData(receptionDataDefault())
        setReturnedTotal(0)
        setVarietyDisable(false)
        setReceivedTrays([])
        setReturnedTrays([])
    }

    const submit = (e) => {
        e.preventDefault()
        if (receptionData.producer == null) {
            setErrorText('Debe seleccionar un productor')
            setOpenSnack(true)
        } else if (receptionData.varietyFruit == null) {
            setErrorText('Debe seleccionar una variedad de fruta')
            setOpenSnack(true)
        } else if (receptionData.traysQuanty <= 0) {
            setErrorText('Debe agregar bandejas a la recepción')
            setOpenSnack(true)
        } else {
            setOpenPrintDialog(true)
        }
    }

    return (
        <>
            <Grid container spacing={1} padding={1}>
                <Grid container spacing={1} item xs={12} sm={12} md={12}>
                    <Grid item xs={6} sm={6} md={6}>
                        <Autocomplete
                            inputValue={producerInput}
                            onInputChange={(e, newInputValue) => {
                                setProducerInput(newInputValue);
                            }}
                            value={receptionData.producer}
                            onChange={(e, newValue) => {
                                setReceptionData({ ...receptionData, producer: newValue })
                            }}
                            isOptionEqualToValue={(option, value) => value === null || option.id === value.id}
                            disablePortal
                            noOptionsText="Productor no encontrado"
                            options={producersOptions}
                            renderInput={(params) => <TextField {...params} label='Nombre productor' size={'small'} fullWidth required />}
                        />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} >
                        <TextField
                            label='Rut'
                            value={(receptionData.producer == null) ? '' : receptionData.producer.rut}
                            InputProps={{
                                readOnly: true,
                            }}
                            size={'small'}
                            variant={'outlined'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3}>
                        <TextField label="Guia"
                            name="guide"
                            value={(receptionData.guide == null) ? '' : receptionData.guide}
                            onChange={(e) => {
                                setReceptionData({ ...receptionData, guide: e.target.value })
                            }}
                            type={'number'}
                            variant="outlined"
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3}>
                        <Autocomplete
                            inputValue={varietyInput}
                            onInputChange={(e, newInputValue) => {
                                setVarietyInput(newInputValue)
                            }}
                            disabled={varietyDisable}
                            isOptionEqualToValue={(option, value) => null || option.id === value.id}
                            value={receptionData.varietyFruit}
                            onChange={(e, newValue) => {
                                setReceptionData({ ...receptionData, varietyFruit: newValue })
                                setVarietyDisable(varietyDisable == true ? false : true)

                            }}
                            disablePortal
                            options={varietyOptions}
                            renderInput={(params) => <TextField {...params} label='Variedad de fruta' size={'small'} fullWidth required />}
                        />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} >
                        <TextField
                            label='precio'
                            value={receptionData.varietyFruit == null ? '$ 0' : utils.renderMoneystr(receptionData.varietyFruit.price)}
                            InputProps={{
                                readOnly: true,
                            }}
                            size={'small'}
                            variant={'outlined'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3}>
                        <Autocomplete
                            inputValue={typeInput}
                            onInputChange={(e, newInputValue) => {
                                setTypeInput(newInputValue);
                            }}
                            value={receptionData.typeFruit}
                            isOptionEqualToValue={(option, value) => null || option.id === value.id}
                            getOptionLabel={(option) => option.label}
                            onChange={(e, newValue) => {
                                setReceptionData({ ...receptionData, typeFruit: newValue })
                            }}
                            disablePortal
                            options={typeFruitOptions}
                            renderInput={(params) => <TextField {...params} label='Tipo de fruta' size={'small'} fullWidth required />}
                        />
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}>
                        <IconButton onClick={reStart}><RestartAltIcon /></IconButton>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} textAlign={'right'} alignSelf={'center'}>
                        <Button variant={'contained'} onClick={submit}>Guardar</Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} paddingTop={2}>
                    <Typography fontSize={20}>
                        Detalle
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} paddingBottom={2}>
                    <TraysGrid
                        receivedTrays={receivedTrays}
                        setReceivedTrays={setReceivedTrays}
                        updateGrid={updateGrid}
                        price={receptionData.varietyFruit == null ? 0 : receptionData.varietyFruit.price}
                        receptionData={receptionData}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6}>
                            <Paper elevation={0} variant="outlined" >
                                <Grid container paddingLeft={1} paddingTop={1}>
                                    <Grid item>
                                        <IconButton onClick={() => { setOpenReturnedTraysDialog(true) }}><AddCircleIcon /></IconButton>
                                    </Grid>
                                    <Grid item alignSelf={'center'} paddingLeft={1}>
                                        <Typography>
                                            Bandejas devueltas al productor
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <Grid container spacing={1} padding={1}>
                                            {returnedTrays.map((item) => {
                                                return (
                                                    <Grid item xs={4} sm={4} md={4}>
                                                        <Card variant={'outlined'}>
                                                            <Typography paddingLeft={1}>
                                                                {item.tray.label}
                                                            </Typography>
                                                            <Typography paddingLeft={1}>
                                                                {item.quanty}
                                                            </Typography>
                                                        </Card>
                                                    </Grid>
                                                )
                                            })}

                                        </Grid>
                                    </Grid>
                                    <Grid item paddingLeft={1}>
                                        <Typography fontSize={20}>
                                            Total {returnedTotal}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6}>
                            <AppPaper title={'Totales'}>
                                <Grid container spacing={.5} direction={'column'} paddingLeft={2}>
                                    <Grid item >
                                        <Typography fontSize={15}>
                                            Cantidad de bandejas: {receptionData.traysQuanty}
                                        </Typography>
                                    </Grid>
                                    <Grid item >
                                        <Typography fontSize={15}>
                                            Kg bandejas: {receptionData.traysWeight}
                                        </Typography>
                                    </Grid>
                                    <Grid item >
                                        <Typography fontSize={15}>
                                            Kg bruto: {receptionData.gross}
                                        </Typography>
                                    </Grid>
                                    <Grid item >
                                        <Typography fontSize={15}>
                                            Kg neto: {receptionData.net}
                                        </Typography>
                                    </Grid>
                                    <Grid item >
                                        <Typography fontSize={15}>
                                            Kg descuentos: {receptionData.discount}
                                        </Typography>
                                    </Grid>
                                    <Grid item paddingRight={2} paddingBottom={2}>
                                        <Typography fontSize={20} textAlign={'right'}>
                                            Total a pagar: {utils.renderMoneystr(receptionData.pay)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </AppPaper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <AddReturnedTraysDialog
                openDialog={openReturnedTraysDialog}
                closeDialog={() => { setOpenReturnedTraysDialog(false) }}
                returnedTrays={returnedTrays}
                setReturnedTrays={setReturnedTrays}
            />
            <PrintDialog
                openDialog={openPrintDialog}
                closeDialog={() => setOpenPrintDialog(false)}
                receptionData={receptionData}
                receivedTrays={receivedTrays}
                returnedTrays={returnedTrays}
                returnedTotal={returnedTotal}
                finishSaveEvent={finishSaveEvent}
            />
            <AppErrorSnack openSnack={openSnack} setOpenSnack={setOpenSnack} errorText={errorText}></AppErrorSnack>
        </>
    )
}

function restorePalletPromise(palletId, traysQuanty) {
    const palletPromise = new Promise((resolve, reject) => {
        pallets.findOneById(palletId)
            .then(res => {
                let restoreTray = res.trays - parseInt(traysQuanty)
                pallets.updateTrays(palletId, restoreTray)
                    .then(() => { resolve() })
                    .catch(err => { reject(err) })
            })
            .catch(err => { reject(err) })
    })
    return palletPromise
}

function receptionDataDefault() {
    return ({
        guide: null,
        traysQuanty: 0,
        traysWeight: 0,
        gross: 0,
        discount: 0,
        net: 0,
        pay: 0,
        producer: null,
        varietyFruit: null,
        typeFruit: null,
        // inputMaterial: {mateial_id, quanty},
        // outMaterial: {mateial_id, quanty}
    })
}

///////// RRECIBEB TRAYS GRID ////////

function TraysGrid(props) {
    const { receivedTrays, setReceivedTrays, updateGrid, price, receptionData } = props
    const [openAddTraysDialog, setOpenAddTraysDialog] = useState(false)
    const [data, setData] = useState([])
    const [height, setHeight] = useState('')
    const [rowData, setRowData] = useState([])

    useEffect(() => {
        let data = receivedTrays.map((item, index) => {
            let quanty = item.quanty
            let gross = item.gross
            let trayWeightUnit = item.tray.weight
            let traysWeight = item.tray.weight * item.quanty
            let impurity = item.impurity
            let preNet = gross - traysWeight
            let kg_impurity = preNet * (impurity / 100)
            let discount = kg_impurity + traysWeight
            let net = gross - discount
            return ({
                id: index + 1,
                pallet: item.pallet,
                tray: item.tray,
                quanty: quanty,
                gross: gross,
                name: item.tray.label,
                trayWeightUnit: trayWeightUnit,
                traysWeight: traysWeight,
                impurity: impurity,
                kg_impurity: kg_impurity,
                discount: discount,
                net: net,
                pay: net * price,
                palletId: item.pallet.id
            })
        })
        setData(data)
        setReceivedTrays(data)
    }, [updateGrid, receivedTrays.length])

    useEffect(() => {
        if (data.length <= 2) {
            setHeight('25vh')
        } else {
            let value = (data.length * 5.3) + 12
            let valueStr = value.toString()
            setHeight(valueStr + 'vh')
        }
    }, [data])

    const destroy = (id) => {
        let deleteTray = data.filter(item => item.id == parseInt(id))
        deleteTray = deleteTray[0]
        pallets.findOneById(deleteTray.palletId)
            .then(res => {
                let restoreTray = res.trays - parseInt(deleteTray.quanty)
                pallets.updateTrays(res.id, restoreTray)
                    .then(() => {
                        let filt = data.filter(item => item.id != parseInt(id))
                        setReceivedTrays(filt)
                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => { console.error(err) })
    }

    const columns = [
        { field: 'id', headerName: '#', flex: 0.1 },
        { field: 'palletId', headerName: 'Pallet', flex: 0.12 },
        { field: 'name', headerName: 'Tipo bandeja', flex: 0.25 },
        { field: 'trayWeightUnit', headerName: 'Peso Bj', flex: .22, type: 'number' },
        { field: 'quanty', headerName: 'Cant', flex: .18, type: 'number' },
        { field: 'traysWeight', headerName: 'Kg Bjs (-)', flex: .25, type: 'number' },
        { field: 'impurity', headerName: '% Imp', flex: .22, type: 'number' },
        { field: 'kg_impurity', headerName: 'Imp (-)', flex: .22, type: 'number' },
        { field: 'gross', headerName: 'Kg Br', flex: .15, type: 'number' },
        { field: 'discount', headerName: 'Desc (-)', flex: .22, type: 'number' },
        { field: 'net', headerName: 'Kg Nt', flex: .15, type: 'number' },
        { field: 'pay', headerName: 'Pago Subtotal', flex: .22, valueFormatter: (params) => (utils.renderMoneystr(Math.floor(params.value))) },
        {
            field: 'actions',
            headerName: '',
            type: 'actions', flex: .1, getActions: (params) => [
                <GridActionsCellItem
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => destroy(params.row.id)}
                />
            ]
        }
    ]


    return (
        <Box width={'100%'} height={height}>
            <DataGrid
                localeText={esESGrid}
                rows={data}
                columns={columns}
                density='compact'
                components={{ Toolbar: CustomToolbar, Footer: CustomFooter }}
                componentsProps={{
                    toolbar: {
                        openAddTraysDialog: openAddTraysDialog,
                        closeDialog: () => { setOpenAddTraysDialog(false) },
                        setOpenAddTraysDialog: setOpenAddTraysDialog,
                        receivedTrays: receivedTrays,
                        setReceivedTrays: setReceivedTrays,
                        receptionData: receptionData

                    }
                }}
            />
        </Box>
    )
}

function CustomToolbar(props) {
    const { openAddTraysDialog, closeDialog, setOpenAddTraysDialog, receivedTrays, setReceivedTrays, receptionData } = props
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')

    const openDialogButton = () => {
        if (receptionData.varietyFruit == null) {
            setErrorText('Debe seleccionar una variedad de fruta')
            setOpenSnack(true)
        } else {
            setOpenAddTraysDialog(true)
        }
    }


    return (
        <>
            <Grid container paddingLeft={1} paddingTop={1}>
                <Grid item>
                    <IconButton onClick={openDialogButton}><AddCircleIcon /></IconButton>
                </Grid>
                <Grid item alignSelf={'center'} paddingLeft={1}>
                    <Typography>
                        Bandejas recibidas del productor
                    </Typography>
                </Grid>
            </Grid>

            <AddTraysDialog
                openDialog={openAddTraysDialog}
                closeDialog={closeDialog}
                receivedTrays={receivedTrays}
                setReceivedTrays={setReceivedTrays}
                receptionData={receptionData}

            />

            <AppErrorSnack openSnack={openSnack} setOpenSnack={setOpenSnack} errorText={errorText}></AppErrorSnack>
        </>

    )
}

function CustomFooter() {
    return (
        <Box></Box>
    )
}


const esESGrid = {
    // Root
    noRowsLabel: 'Sin filas',
    noResultsOverlayLabel: 'Ningún resultado encontrado.',
    errorOverlayDefaultLabel: 'Ha ocurrido un error.',
    // Density selector toolbar button text
    toolbarDensity: 'Densidad',
    toolbarDensityLabel: 'Densidad',
    toolbarDensityCompact: 'Compacta',
    toolbarDensityStandard: 'Standard',
    toolbarDensityComfortable: 'Comoda',
    // Columns selector toolbar button text
    toolbarColumns: 'Columnas',
    toolbarColumnsLabel: 'Seleccionar columnas',
    // Filters toolbar button text
    toolbarFilters: 'Filtros',
    toolbarFiltersLabel: 'Mostrar filtros',
    toolbarFiltersTooltipHide: 'Ocultar filtros',
    toolbarFiltersTooltipShow: 'Mostrar filtros',
    toolbarFiltersTooltipActive: count => count > 1 ? `${count} filtros activos` : `${count} filtro activo`,
    // Quick filter toolbar field
    toolbarQuickFilterPlaceholder: 'Buscar...',
    toolbarQuickFilterLabel: 'Buscar',
    // toolbarQuickFilterDeleteIconLabel: 'Clear',
    // Export selector toolbar button text
    toolbarExport: 'Exportar',
    toolbarExportLabel: 'Exportar',
    toolbarExportCSV: 'Descargar como CSV',
    // toolbarExportPrint: 'Print',
    // toolbarExportExcel: 'Download as Excel',
    // Columns panel text
    columnsPanelTextFieldLabel: 'Columna de búsqueda',
    columnsPanelTextFieldPlaceholder: 'Título de columna',
    columnsPanelDragIconLabel: 'Reorder columna',
    columnsPanelShowAllButton: 'Mostrar todo',
    columnsPanelHideAllButton: 'Ocultar todo',
    // Filter panel text
    filterPanelAddFilter: 'Agregar filtro',
    filterPanelDeleteIconLabel: 'Borrar',
    // filterPanelLinkOperator: 'Logic operator',
    filterPanelOperators: 'Operadores',
    // TODO v6: rename to filterPanelOperator
    filterPanelOperatorAnd: 'Y',
    filterPanelOperatorOr: 'O',
    filterPanelColumns: 'Columnas',
    filterPanelInputLabel: 'Valor',
    filterPanelInputPlaceholder: 'Valor de filtro',
    // Filter operators text
    filterOperatorContains: 'contiene',
    filterOperatorEquals: 'es igual',
    filterOperatorStartsWith: 'comienza con',
    filterOperatorEndsWith: 'termina con',
    filterOperatorIs: 'es',
    filterOperatorNot: 'no es',
    filterOperatorAfter: 'es posterior',
    filterOperatorOnOrAfter: 'es en o posterior',
    filterOperatorBefore: 'es anterior',
    filterOperatorOnOrBefore: 'es en o anterior',
    filterOperatorIsEmpty: 'está vacío',
    filterOperatorIsNotEmpty: 'no esta vacío',
    filterOperatorIsAnyOf: 'es cualquiera de',
    // Filter values text
    filterValueAny: 'cualquiera',
    filterValueTrue: 'verdadero',
    filterValueFalse: 'falso',
    // Column menu text
    columnMenuLabel: 'Menú',
    columnMenuShowColumns: 'Mostrar columnas',
    columnMenuFilter: 'Filtro',
    columnMenuHideColumn: 'Ocultar',
    columnMenuUnsort: 'Desordenar',
    columnMenuSortAsc: 'Ordenar asc',
    columnMenuSortDesc: 'Ordenar desc',
    // Column header text
    columnHeaderFiltersTooltipActive: count => count > 1 ? `${count} filtros activos` : `${count} filtro activo`,
    columnHeaderFiltersLabel: 'Mostrar filtros',
    columnHeaderSortIconLabel: 'Ordenar',
    // Rows selected footer text
    footerRowSelected: count => count > 1 ? `${count.toLocaleString()} filas seleccionadas` : `${count.toLocaleString()} fila seleccionada`,
    // Total row amount footer text
    footerTotalRows: 'Filas Totales:',
    // Total visible row amount footer text
    footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
    // Checkbox selection text
    // checkboxSelectionHeaderName: 'Checkbox selection',
    // checkboxSelectionSelectAllRows: 'Select all rows',
    // checkboxSelectionUnselectAllRows: 'Unselect all rows',
    // checkboxSelectionSelectRow: 'Select row',
    // checkboxSelectionUnselectRow: 'Unselect row',
    // Boolean cell text
    booleanCellTrueLabel: 'Si',
    booleanCellFalseLabel: 'No',
    // Actions cell more text
    actionsCellMore: 'más' // Column pinning text
    // pinToLeft: 'Pin to left',
    // pinToRight: 'Pin to right',
    // unpin: 'Unpin',
    // Tree Data
    // treeDataGroupingHeaderName: 'Group',
    // treeDataExpand: 'see children',
    // treeDataCollapse: 'hide children',
    // Grouping columns
    // groupingColumnHeaderName: 'Group',
    // groupColumn: name => `Group by ${name}`,
    // unGroupColumn: name => `Stop grouping by ${name}`,
    // Master/detail
    // detailPanelToggle: 'Detail panel toggle',
    // expandDetailPanel: 'Expand',
    // collapseDetailPanel: 'Collapse',
    // Row reordering text
    // rowReorderingHeaderName: 'Row reordering',

}

///////// Add ReturnedTrays Dialog ////////

function AddReturnedTraysDialog(props) {
    const { openDialog, closeDialog, returnedTrays, setReturnedTrays } = props
    const [traysOptions, setTraysOptions] = useState([])
    const [trayInput, setTrayInput] = useState('')
    const [addTrayData, setAddTrayData] = useState(addTrayDataDefault())
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')

    useEffect(() => {
        trays.findAll()
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    id: item.id,
                    label: item.name,
                    weight: item.weight
                }))
                setTraysOptions(data)
            })
    }, [])

    const close = () => {
        closeDialog()
        setAddTrayData(addTrayDataDefault())
    }

    const submit = (e) => {
        if (addTrayData.quanty <= 0) {
            setErrorText('La cantidad de bandejas no puede ser menor o igual a 0')
            setOpenSnack(true)
        } else {
            e.preventDefault()
            setReturnedTrays([...returnedTrays, addTrayData])
            close()
        }
    }

    return (
        <>
            <Dialog open={openDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle>
                    Agregar bandejas devueltas
                </DialogTitle>
                <form onSubmit={submit}>
                    <DialogContent>
                        <Grid container direction={'column'} spacing={1} paddingTop={1}>
                            <Grid item>
                                <Autocomplete
                                    inputValue={trayInput}
                                    onInputChange={(e, newInputValue) => {
                                        setTrayInput(newInputValue);
                                    }}
                                    value={addTrayData.tray}
                                    onChange={(e, newValue) => {
                                        setAddTrayData({ ...addTrayData, tray: newValue })
                                    }}
                                    isOptionEqualToValue={(option, value) => null || option.id === value.id}
                                    disablePortal
                                    options={traysOptions}
                                    renderInput={(params) => <TextField {...params} label='Tipo de bandeja' size={'small'} fullWidth required />}
                                />
                            </Grid>
                            <Grid item>
                                <TextField label="Cantidad de bandejas"
                                    value={addTrayData.quanty}
                                    onChange={(e) => { setAddTrayData({ ...addTrayData, quanty: e.target.value }) }}
                                    type={'number'}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button variant={'contained'} type='submit'>agregar</Button>
                        <Button variant={'outlined'} onClick={close}>cerrar</Button>
                    </DialogActions>
                </form>
            </Dialog>


            <AppErrorSnack openSnack={openSnack} setOpenSnack={setOpenSnack} errorText={errorText}></AppErrorSnack>
        </>
    )
}

///////// Add Trays Dialog ////////

function AddTraysDialog(props) {
    const { openDialog, closeDialog, receivedTrays, setReceivedTrays, receptionData } = props
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [addTrayData, setAddTrayData] = useState(addTrayDataDefault())
    const [traysOptions, setTraysOptions] = useState([])
    const [trayInput, setTrayInput] = useState('')
    const [palletsOptions, setPalletsOptions] = useState([])
    const [palletInput, setPalletInput] = useState('')
    const [storagesOptions, setStoragesOptions] = useState([])
    const [storagesInput, setStoragesInput] = useState('')
    const [openEditPalletDialog, setOpenEditPalletDialog] = useState(false)
    const [editPalletPass, setEditPalletPass] = useState('')
    const [palletPass, setPalletPass] = useState('')
    const [showEditPalletInputs, setShowEditPalletInputs] = useState(false)
    const [openNewPalletDialog, setOpenNewPalletDialog] = useState(false)
    const [newPalletData, setNewPalletData] = useState(newPalletDataDefault())
    const [maxPalletValue, setMaxPalletValue] = useState(0)

    useEffect(() => {
        const readConfig = ipcRenderer.sendSync('read-config', 'sync');
        setPalletPass(readConfig.pallet_pass)
    }, [])

    useEffect(() => {
        storages.findAll()
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    id: item.id,
                    label: item.name
                }))
                setStoragesOptions(data)
            })
            .catch(err => { console.error(err) })
    }, [])

    useEffect(() => {
        setAddTrayData({ ...addTrayData, pallet: null })
        updatePalletsOptionPromise(receptionData, setPalletsOptions, addTrayData)

    }, [openDialog, addTrayData.tray])

    useEffect(() => {
        if (addTrayData.pallet != null) {
            setMaxPalletValue(addTrayData.pallet.max)
        }
    }, [addTrayData.pallet])


    useEffect(() => {
        trays.findAll()
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    id: item.id,
                    label: item.name,
                    weight: item.weight
                }))
                setTraysOptions(data)
            })
            .catch(err => { console.error(err) })
    }, [])

    const close = () => {
        setAddTrayData(addTrayDataDefault())
        closeDialog()
    }

    const openNewPallet = () => {
        if (addTrayData.tray == null) {
            setErrorText('Debe seleccionar un tipo de bandeja')
            setOpenSnack(true)
        } else {
            setOpenNewPalletDialog(true)
        }
    }

    const newPallet = (e) => {
        e.preventDefault()
        pallets.create(receptionData.varietyFruit.id, addTrayData.tray.id, newPalletData.storage.id, newPalletData.weight)
            .then(() => {
                updatePalletsOptionPromise(receptionData, setPalletsOptions, addTrayData)
                    .then(() => {
                        setOpenNewPalletDialog(false)
                        setNewPalletData(newPalletDataDefault())

                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => { console.error(err) })
    }


    const openEditPallet = () => {
        if (addTrayData.pallet == null || addTrayData.pallet.label == '') {
            setErrorText('Debe seleccionar un pallet')
            setOpenSnack(true)
        } else {
            setOpenEditPalletDialog(true)
        }
    }

    const editPallet = (e) => {
        e.preventDefault()
        pallets.updateMax(addTrayData.pallet.id, maxPalletValue)
            .then(() => {
                updatePalletsOptionPromise(receptionData, setPalletsOptions, addTrayData)
                    .then(() => {
                        setOpenEditPalletDialog(false)
                        setShowEditPalletInputs(false)
                        setEditPalletPass('')
                        setAddTrayData({ ...addTrayData, pallet: null })
                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => { console.error(err) })
    }



    const submit = (e) => {
        e.preventDefault()
        if (addTrayData.impurity < 0) {
            setErrorText('El % de impureza no puede ser menor a 0')
            setOpenSnack(true)
        } else if (addTrayData.impurity > 100) {
            setErrorText('El % de impureza no puede ser superior 100%')
            setOpenSnack(true)
        } else if (addTrayData.quanty <= 0) {
            setErrorText('La cantidad de bandejas no puede ser menor o igual a 0')
            setOpenSnack(true)
        } else if (addTrayData.gross <= 0) {
            setErrorText('Los Kg bruto no pueden ser menor o igual a 0')
            setOpenSnack(true)
        } else if (parseInt(addTrayData.quanty) > addTrayData.pallet.available) {
            setErrorText('La cantidad de bandejas debe ser inferior o igual a ' + addTrayData.pallet.available)
            setOpenSnack(true)
        } else {
            let traysSum = addTrayData.pallet.trays + parseInt(addTrayData.quanty)
            pallets.updateTrays(addTrayData.pallet.id, traysSum)
                .then(() => {
                    setReceivedTrays([...receivedTrays, addTrayData])
                    close()
                })
                .catch(err => { console.error(err) })
        }
    }
    return (
        <>
            <Dialog open={openDialog} maxWidth={'md'} fullWidth>
                <DialogTitle>
                    Agregar bandejas
                </DialogTitle>
                <form onSubmit={submit}>
                    <DialogContent>
                        <Grid container direction={'column'} spacing={1} paddingTop={1}>
                            <Grid item>
                                <Autocomplete
                                    inputValue={trayInput}
                                    onInputChange={(e, newInputValue) => {
                                        setTrayInput(newInputValue);
                                    }}
                                    value={addTrayData.tray}
                                    isOptionEqualToValue={(option, value) => null || option.id === value.id}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(e, newValue) => {
                                        setAddTrayData({ ...addTrayData, tray: newValue })
                                    }}
                                    disablePortal
                                    options={traysOptions}
                                    renderInput={(params) => <TextField {...params} label='Tipo de bandeja' size={'small'} fullWidth required />}
                                />
                            </Grid>
                            <Grid item>
                                <TextField label="Cantidad de bandejas"
                                    value={addTrayData.quanty}
                                    onChange={(e) => { setAddTrayData({ ...addTrayData, quanty: e.target.value }) }}
                                    type={'number'}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label='% Impuresas'
                                    value={addTrayData.impurity}
                                    onChange={(e) => {
                                        setAddTrayData({ ...addTrayData, impurity: e.target.value })
                                    }}
                                    type={'number'}
                                    inputProps={{ max: 100, min: 0 }}
                                    variant={'outlined'}
                                    size={'small'}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label='Kg Bruto'
                                    value={addTrayData.gross}
                                    onChange={(e) => {
                                        setAddTrayData({ ...addTrayData, gross: e.target.value })
                                    }}
                                    // inputProps={{ min: 1 }}
                                    inputProps={{ step: "0.01" }}
                                    type={'number'}
                                    variant={'outlined'}
                                    size={'small'}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <Grid container spacing={1}>
                                    <Grid item xs={10} sm={10} md={10}>
                                        <Autocomplete
                                            inputValue={palletInput}
                                            onInputChange={(e, newInputValue) => {
                                                setPalletInput(newInputValue);
                                            }}
                                            isOptionEqualToValue={(option, value) => null || option.id === value.id}
                                            value={addTrayData.pallet}
                                            getOptionLabel={(option) => option.label}
                                            onChange={(e, newValue) => {
                                                setAddTrayData({ ...addTrayData, pallet: newValue })
                                            }}
                                            disablePortal
                                            options={palletsOptions}
                                            renderInput={(params) => <TextField {...params} label='Pallet' size={'small'} fullWidth required />}
                                        />
                                    </Grid>
                                    <Grid item xs={2} sm={2} md={2}>
                                        <IconButton onClick={() => { openNewPallet() }}><AddCircleIcon /></IconButton>
                                        <IconButton onClick={() => { openEditPallet() }}><EditIcon /></IconButton>
                                        <IconButton><PrintIcon /></IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button variant={'contained'} type='submit'>agregar</Button>
                        <Button variant={'outlined'} onClick={close}>cerrar</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={openEditPalletDialog} maxWidth={'xs'} fullWidth>
                <form onSubmit={editPallet}>
                    <DialogTitle>
                        Editar capacidad máxima pallet {(addTrayData.pallet == null ? '' : addTrayData.pallet.id)}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1} direction={'column'} paddingTop={1}>
                            <Grid item>
                                <TextField
                                    label='Contraseña'
                                    value={editPalletPass}
                                    onChange={(e) => {
                                        setEditPalletPass(e.target.value)
                                        if (e.target.value == palletPass) {
                                            setShowEditPalletInputs(true)
                                        } else {
                                            setShowEditPalletInputs(false)
                                        }
                                    }}
                                    type={'password'}
                                    variant={'outlined'}
                                    size={'small'}
                                    required
                                    fullWidth
                                />
                            </Grid>

                            <Grid item sx={{ ...(showEditPalletInputs === false && { display: 'none' }) }}>
                                <TextField
                                    label='Capacidad máxima'
                                    value={maxPalletValue}
                                    onChange={(e) => {
                                        setMaxPalletValue(e.target.value)
                                    }}
                                    variant={'outlined'}
                                    size={'small'}
                                    required
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button variant={'contained'} type={'submit'}>guardar</Button>
                        <Button variant={'outlined'} onClick={() => { setOpenEditPalletDialog(false), setShowEditPalletInputs(false), setEditPalletPass('') }}>cerrar</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={openNewPalletDialog} maxWidth={'xs'} fullWidth>
                <form onSubmit={newPallet}>
                    <DialogTitle>
                        Nuevo pallet
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1} direction={'column'} paddingTop={1}>
                            <Grid item>
                                <Autocomplete
                                    inputValue={storagesInput}
                                    onInputChange={(e, newInputValue) => {
                                        setStoragesInput(newInputValue);
                                    }}
                                    value={newPalletData.storage}
                                    isOptionEqualToValue={(option, value) => null || option.id === value.id}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(e, newValue) => {
                                        setNewPalletData({ ...newPalletData, storage: newValue })
                                    }}
                                    disablePortal
                                    options={storagesOptions}
                                    renderInput={(params) => <TextField {...params} label='Bodega' size={'small'} fullWidth required />}
                                />
                            </Grid>
                            <Grid item >
                                <TextField
                                    label='Peso Pallet'
                                    value={newPalletData.weight}
                                    onChange={(e) => {
                                        setNewPalletData({ ...newPalletData, weight: e.target.value })
                                    }}
                                    inputProps={{ step: "0.01" }}
                                    type={'number'}
                                    variant={'outlined'}
                                    size={'small'}
                                    required
                                    fullWidth
                                />

                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button variant={'contained'} type={'submit'} > Guardar</Button>
                        <Button variant={'outlined'} onClick={() => { setOpenNewPalletDialog(false), setNewPalletData(newPalletDataDefault()) }}>cerrar</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <AppErrorSnack openSnack={openSnack} setOpenSnack={setOpenSnack} errorText={errorText}></AppErrorSnack>
        </>
    )
}

function addTrayDataDefault() {
    return ({
        quanty: '',
        gross: '',
        impurity: '',
        tray: null,
        pallet: null
    })
}

function newPalletDataDefault() {
    return ({
        storage: null,
        weight: null
    })
}
function updatePalletsOptionPromise(receptionData, setPalletsOptions, addTrayData) {
    const pallet = new Promise((resolve, reject) => {
        if (receptionData.varietyFruit != null) {
            pallets.findAllByVariety(receptionData.varietyFruit.id)
                .then(res => {
                    let dataFilt = []
                    if (addTrayData.tray == null) {
                        dataFilt = []
                    } else {
                        dataFilt = res.filter(item => (item.max - item.trays) >= 1)
                        dataFilt = dataFilt.filter(item => item.TrayId == addTrayData.tray.id)
                        let data = dataFilt.map(item => ({
                            key: item.id,
                            id: item.id,
                            label: 'id: ' + item.id + ' - max: ' + item.max + ' - disponible: ' + (item.max - item.trays) + ' - ' + item.Tray.name + ' - ' + item.Variety.name + ' - ' + item.Storage.name,
                            trays: item.trays,
                            max: item.max,
                            available: item.max - item.trays
                        }))
                        setPalletsOptions(data)
                        resolve()
                    }
                })
                .catch(err => { reject(err) })
        } else {
            reject('Varitery null')
        }

    })
    return pallet
}

function PrintDialog(props) {
    const { openDialog, closeDialog, receptionData, receivedTrays, returnedTrays, returnedTotal, finishSaveEvent } = props
    const componentRef = useRef()
    const router = useRouter()

    const close = () => {
        //ipcRenderer.sendSync('print-cut', 'sync')
        closeDialog()
    }

    const save = (e) => {
        e.preventDefault()
        receptions.create(
            receptionData.guide,
            receptionData.varietyFruit.price,
            receptionData.traysQuanty,
            receptionData.traysWeight,
            receptionData.gross,
            receptionData.discount,
            receptionData.net,
            receptionData.producer.id,
            receptionData.varietyFruit.id,
            (receptionData.type == null ? null : receptionData.type.id))
            .then(res => {
                //CREATE RECEPTIONDETAILS
                let reception_id = res.id
                let returnedPromises = []
                returnedTrays.map(item => {
                    returnedPromises.push(trays.outputStock(item.tray.id, item.quanty, receptionData.producer.id))
                })
                Promise.all(returnedPromises)
                    .then(() => {
                        let receivedPromises = []
                        receivedTrays.map(item => {
                            receivedPromises.push(
                                receptionsDetails.create(
                                    item.quanty,
                                    item.traysWeight,
                                    item.impurity,
                                    item.kg_impurity,
                                    item.gross,
                                    item.discount,
                                    item.net,
                                    item.pay,
                                    item.palletId,
                                    item.tray.id,
                                    reception_id
                                )
                            )
                        })
                        Promise.all(receivedPromises)
                            .then(() => {
                                finishSaveEvent()
                                closeDialog()
                            })
                            .catch(err => {console.error(err)})
                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => { console.error(err) })

    }

    return (
        <>
            <Dialog open={openDialog} maxWidth={'xs'} >
                <DialogTitle sx={{ displayPrint: 'none' }}>
                    Imprimir recibo de recepción
                </DialogTitle>
                <DialogContent>
                    <Box width={'75mm'} ref={componentRef}>
                        <Grid container spacing={.5} direction={'column'} paddingTop={1} id={'receptionTicket'} padding={-1}>
                            <Grid item>
                                <Typography fontSize={18} textAlign={'center'}>
                                    Recibo de recepción
                                </Typography>
                            </Grid>
                            <Grid item textAlign={'center'}>
                                <Barcode value={'1234'} height={25} />
                            </Grid>
                            <Grid item>
                                <Typography fontSize={12}>
                                    Nombre productor: {(receptionData.producer == null ? '' : receptionData.producer.label)} {<br />}
                                    Rut productor: {(receptionData.producer == null ? '' : receptionData.producer.rut)} {<br />}
                                    Guía: {receptionData.guide} {<br />}
                                    variedad: {(receptionData.varietyFruit == null ? '' : receptionData.varietyFruit.label)} {<br />}
                                    Fecha:  {moment(new Date).format('DD-MM-YYYY HH:mm')}{<br />}
                                    Bandejas: {receptionData.traysQuanty} {<br />}
                                    Kg bandejas: {receptionData.traysWeight} {<br />}
                                    kg bruto: {receptionData.gross} {<br />}
                                    kg neto: {receptionData.net} {<br />}
                                    kg descuentos: {receptionData.discount} {<br />}
                                    Total a pagar: {utils.renderMoneystr(receptionData.pay)}
                                </Typography>
                            </Grid>
                            <Grid item paddingBottom={1} marginTop={1}>
                                <Divider sx={{ borderColor: 'black' }} />
                            </Grid>

                            <Grid item>
                                <Typography fontSize={14}>
                                    Detalle bandejas recibidas
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Grid container spacing={1} direction={'column'}>
                                    {receivedTrays.map((item, index) => {
                                        return (
                                            <Grid item xs={12} sm={12} md={12} key={index}>
                                                <DetailReceivedTrayCard
                                                    id={item.id}
                                                    name={item.name}
                                                    quanty={item.quanty}
                                                    traysWeight={item.traysWeight}
                                                    gross={item.gross}
                                                    net={item.net}
                                                    impurity={item.impurity}
                                                    discount={item.discount}
                                                    pay={item.pay}
                                                />
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </Grid>
                            <Grid item paddingBottom={1} marginTop={1}>
                                <Divider sx={{ borderColor: 'black' }} />
                            </Grid>
                            <Grid item>
                                <Typography fontSize={14}>
                                    Detalle bandejas devueltas
                                </Typography>
                            </Grid>
                            <Grid item>
                                <TableContainer sx={{ borderColor: 'black', border: 'solid', borderWidth: '1px', borderRadius: '5px' }}>
                                    <Table>
                                        <TableBody>
                                            {returnedTrays.map((item, index) => {
                                                return (
                                                    <TableRow
                                                        key={index}
                                                    >
                                                        <Typography fontSize={10} paddingLeft={1}>
                                                            {index + 1}.- {item.tray.label}: {item.quanty}
                                                        </Typography>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item>
                                <Typography fontSize={14}>Total: {returnedTotal}</Typography>
                            </Grid>
                            <Grid item paddingBottom={1} marginTop={1}>
                                <Divider sx={{ borderColor: 'black' }} />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ displayPrint: 'none' }}>
                    <Button variant={'contained'} onClick={(e) => { save(e) }}>Guardar</Button>
                    <ReactToPrint
                        trigger={() => <IconButton><PrintIcon /></IconButton>}
                        content={() => componentRef.current}
                        onAfterPrint={() => {
                            close()
                        }}
                    />
                    <Button variant={'outlined'} onClick={closeDialog}>cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}