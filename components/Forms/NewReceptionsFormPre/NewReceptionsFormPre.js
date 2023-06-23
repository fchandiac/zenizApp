import {
  Grid, TextField, Autocomplete, TableContainer, TableHead, TableRow, TableCell, TableBody, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem,
  Table, InputAdornment, Divider
} from '@mui/material'
import { React, useState, useEffect } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import AppErrorSnack from '../../AppErrorSnack'
import AppPaper from '../../AppPaper'


const producers = require('../../../promises/producers')
const materials = require('../../../promises/materials')
const varietyFruits = require('../../../promises/varietyFruits')
const typeFruits = require('../../../promises/typeFruits')

export default function NewReceptionsFormPre() {

  const [openSnack, setOpenSnack] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [receptionData, setReceptionData] = useState(receptionDataDefault())
  const [producersOptions, setProducersOptions] = useState([])
  const [findProducerInput, setFindProducerInput] = useState('')
  const [varietyOptions, setVarietyOptions] = useState([])
  const [findVarietyInput, setFindVarietyInput] = useState('')
  const [typeFruitOptions, setTypeFruitOptions] = useState([])
  const [findTypeInput, setFindTypeInput] = useState('')




  useEffect(() => {
    producers.findAll()
      .then(res => {
        let data = res.map(item =>
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
      .catch(err => { console.log(err) })
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
    setReceptionData({
      ...receptionData,
      discount: ((receptionData.gross - receptionData.traysWeight) * (receptionData.impurity / 100)),
      net: ((receptionData.gross - receptionData.traysWeight) - receptionData.discount)
    })
  }, [receptionData.gross])

  useEffect(() => {
    setReceptionData({
      ...receptionData,
      discount: ((receptionData.gross - receptionData.traysWeight) * (receptionData.impurity / 100)),
      net: ((receptionData.gross - receptionData.traysWeight) - receptionData.discount)
    })
  }, [receptionData.traysWeight])

  useEffect(() => {
    setReceptionData({
      ...receptionData,
      discount: ((receptionData.gross - receptionData.traysWeight) * (receptionData.impurity / 100)),
      net: ((receptionData.gross - receptionData.traysWeight) - receptionData.discount)
    })
  }, [receptionData.impurity])

  useEffect(() => {
    setReceptionData({
      ...receptionData,
      net: ((receptionData.gross - receptionData.traysWeight) - receptionData.discount)
    })
  }, [receptionData.discount])

  useEffect(() => {
    setReceptionData({
      ...receptionData,
      pay: ((receptionData.net * receptionData.varietyFruit.price))
    })
  }, [receptionData.net])

  useEffect(() => {
    setReceptionData({
      ...receptionData,
      pay: ((receptionData.net * receptionData.varietyFruit.price))
    })
  }, [receptionData.varietyFruit.price])




  const handleOnChange = (e) => {
    setReceptionData({
      ...receptionData,
      [e.target.name]: e.target.value
    })
  }


  const submit = (e) => {
    e.preventDefault()
    // setErrorText(autocompleteValue.rut)
    // setOpenSnack(true)
    console.log(receptionData)
  }
  return (
    <>
      <AppPaper title='Nueva Recepción'>
        <form onSubmit={submit}>
          <Grid container sx={{ p: 2 }} spacing={1}>
            <Grid item xs={6} sm={6} md={6} >
              <Grid container spacing={1}>
                <Grid item xs={4} sm={4} md={4} >
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
                <Grid item xs={8} sm={8} md={8} >
                  <Autocomplete
                    inputValue={findProducerInput}
                    onInputChange={(e, newInputValue) => {
                      setFindProducerInput(newInputValue);
                    }}
                    value={receptionData.producer}
                    onChange={(e, newValue) => {
                      setReceptionData({ ...receptionData, producer: newValue })
                    }}
                    disablePortal
                    options={producersOptions}
                    renderInput={(params) => <TextField {...params} label='Nombre productor' size={'small'} fullWidth required />}
                  />
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                  <TextField label="Guia"
                    name="guide"
                    value={(receptionData.guide == null) ? '' : receptionData.guide}
                    onChange={handleOnChange}
                    type={'number'}
                    variant="outlined"
                    size={'small'}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} md={4} paddingTop={1}>
                  <Autocomplete
                    inputValue={findVarietyInput}
                    onInputChange={(e, newInputValue) => {
                      setFindVarietyInput(newInputValue);
                    }}
                    value={receptionData.varietyFruit}
                    onChange={(e, newValue) => {
                      setReceptionData({ ...receptionData, varietyFruit: newValue })
                    }}
                    disablePortal
                    options={varietyOptions}
                    renderInput={(params) => <TextField {...params} label='Variedad de fruta' size={'small'} fullWidth required />}
                  />
                </Grid>
                <Grid item xs={4} sm={4} md={4} paddingTop={1}>
                  <Autocomplete
                    inputValue={findTypeInput}
                    onInputChange={(e, newInputValue) => {
                      setFindTypeInput(newInputValue);
                    }}
                    value={receptionData.typeFruit}
                    onChange={(e, newValue) => {
                      setReceptionData({ ...receptionData, typeFruit: newValue })
                    }}
                    disablePortal
                    options={typeFruitOptions}
                    renderInput={(params) => <TextField {...params} label='Tipo de fruta' size={'small'} fullWidth required />}
                  />
                </Grid>
                <Grid item xs={4} sm={4} md={4} >
                  <TextField
                    label='Precio por Kg'
                    value={(receptionData.varietyFruit == null) ? '' : receptionData.varietyFruit.price}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant={'outlined'}
                    size={'small'}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} md={4} >
                  <TextField
                    label='Cantidad de Bandejas'
                    value={receptionData.traysQuanty}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant={'outlined'}
                    size={'small'}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={4} sm={4} md={4} >
                  <TextField
                    label='% Impuresas'
                    name='impurity'
                    value={receptionData.impurity}
                    onChange={handleOnChange}
                    inputProps={{ step: "0.1" }}
                    type={'number'}
                    variant={'outlined'}
                    size={'small'}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} paddingTop={1} paddingBottom={1}>
                  <Divider light />
                </Grid>


                <Grid item xs={4} sm={4} md={4} >
                  <TextField
                    label='Kg Bruto'
                    name='gross'
                    value={receptionData.gross}
                    onChange={handleOnChange}
                    type={'number'}
                    variant={'outlined'}
                    size={'small'}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} md={4} >
                  <TextField
                    label='Kg Bandejas (-)'
                    value={receptionData.traysWeight}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant={'outlined'}
                    size={'small'}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} md={4} >
                  <TextField
                    label='Kg Descuento (-)'
                    name='discount'
                    value={receptionData.discount}
                    InputProps={{
                      readOnly: true,
                    }}
                    type={'number'}
                    variant={'outlined'}
                    size={'small'}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} md={4} >

                </Grid>

                <Grid item xs={4} sm={4} md={4} >
                  <TextField
                    label='Kg Neto'
                    name='net'
                    value={receptionData.net}
                    InputProps={{
                      readOnly: true,
                    }}
                    type={'number'}
                    variant={'outlined'}
                    size={'small'}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} md={4} >
                  <TextField
                    label='A pagar'
                    name='pay'
                    value={receptionData.pay}
                    InputProps={{
                      readOnly: true,
                    }}
                    type={'number'}
                    variant={'outlined'}
                    size={'small'}
                    fullWidth
                  />

                </Grid>

              </Grid>
              <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                <Button variant={'contained'} type='submit'>guardar</Button>
              </Grid>
            </Grid>
            <Grid item xs={6} sm={6} md={6} >
              <Grid item xs={12} sm={12} md={12} >
                <TraysReceived receptionData={receptionData} setReceptionData={setReceptionData} />
              </Grid>

              <Grid item xs={12} sm={12} md={12} >
                <TraysDelivered receptionData={receptionData} setReceptionData={setReceptionData} />
              </Grid>

            </Grid>



          </Grid>
        </form>
      </AppPaper>
      <AppErrorSnack openSnack={openSnack} setOpenSnack={setOpenSnack} errorText={errorText}></AppErrorSnack>
    </>
  )
}


function receptionDataDefault() {
  return ({
    guide: null,
    traysQuanty: 0,
    traysWeight: 0,
    impurity: 0.0,
    gross: 0.0,
    discount: 0.0,
    net: 0.0,
    pay: 0,
    producer: { key: 0, id: 0, label: '', rut: '' },
    varietyFruit: { key: 0, id: 0, label: '', price: 0 },
    typeFruit: { key: 0, id: 0, label: '' },
    // inputMaterial: {mateial_id, quanty},
    // outMaterial: {mateial_id, quanty}
  })
}


function TraysReceived(props) {
  const { receptionData, setReceptionData } = props
  const [openAddTraysDialog, setOpenAddTraysDialog] = useState(false)
  const [trays, setTrays] = useState([])

  useEffect(() => {
    setReceptionData({
      ...receptionData,
      //this reduce sum all quanty on trays array 
      traysQuanty: trays.map(item => item.quanty).reduce((prev, curr) => prev + curr, 0),
      //this reduce sum all weight on trays array
      traysWeight: trays.map(item => item.subtotal).reduce((prev, curr) => prev + curr, 0)
    })
  }, [trays])


  return (
    <>

      <AppPaper title='Bandejas recibidas'>
        <TableContainer >
          <Table size={'small'}>
            <TableHead>
              <TableRow>
                {/* <TableCell>Id</TableCell> */}
                <TableCell padding={'checkbox'}>Bandeja</TableCell>
                <TableCell padding={'checkbox'}>Cantidad</TableCell>
                <TableCell padding={'checkbox'}>Peso</TableCell>
                <TableCell padding={'checkbox'}>Subtotal</TableCell>
                <TableCell padding={'checkbox'}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontSize: '4rem' }}>
              {trays.map((row) => (
                <TableRow key={row.id} >
                  {/* <TableCell>{row.id}</TableCell> */}
                  <TableCell padding={'checkbox'} width={'100%'} >{row.name}</TableCell>
                  <TableCell padding={'checkbox'} width={'100%'}>{row.quanty}</TableCell>
                  <TableCell padding={'checkbox'} width={'100%'}>{row.weight}kg</TableCell>
                  <TableCell padding={'checkbox'} width={'100%'}>{row.subtotal}kg</TableCell>
                  <TableCell padding={'checkbox'}>
                    <IconButton
                      onClick={() => {
                        setTrays(
                          trays => trays.filter(item => item.id !== row.id)
                        )
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <IconButton size={'large'} onClick={() => setOpenAddTraysDialog(true)}>
          <AddCircleIcon />
        </IconButton>
      </AppPaper>
      <AddTraysDialog openDialog={openAddTraysDialog} closeDialog={() => setOpenAddTraysDialog(false)} trays={trays} setTrays={setTrays} />
    </>
  )
}

function TraysDelivered(props) {
  const { receptionData, setReceptionData } = props
  const [openAddTraysDialog, setOpenAddTraysDialog] = useState(false)
  const [trays, setTrays] = useState([])

  // useEffect(() => {
  //   setReceptionData({
  //     ...receptionData,
  //     //this reduce sum all quanty on trays array 
  //     traysQuanty: trays.map(item => item.quanty).reduce((prev, curr) => prev + curr, 0),
  //     //this reduce sum all weight on trays array
  //     traysWeight: trays.map(item => item.subtotal).reduce((prev, curr) => prev + curr, 0)
  //   })
  // }, [trays])


  return (
    <>

      <AppPaper title='Bandejas Entregadas'>
        <TableContainer >
          <Table size={'small'}>
            <TableHead>
              <TableRow>
                {/* <TableCell>Id</TableCell> */}
                <TableCell padding={'checkbox'}>Bandeja</TableCell>
                <TableCell padding={'checkbox'}>Cantidad</TableCell>
                <TableCell padding={'checkbox'}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontSize: '4rem' }}>
              {trays.map((row) => (
                <TableRow key={row.id} >
                  {/* <TableCell>{row.id}</TableCell> */}
                  <TableCell padding={'checkbox'} width={'100%'} >{row.name}</TableCell>
                  <TableCell padding={'checkbox'} width={'100%'}>{row.quanty}</TableCell>
                  <TableCell padding={'checkbox'}>
                    <IconButton
                      onClick={() => {
                        setTrays(
                          trays => trays.filter(item => item.id !== row.id)
                        )
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <IconButton size={'large'} onClick={() => setOpenAddTraysDialog(true)}>
          <AddCircleIcon />
        </IconButton>
      </AppPaper>
      <AddTraysDialog openDialog={openAddTraysDialog} closeDialog={() => setOpenAddTraysDialog(false)} trays={trays} setTrays={setTrays} />
    </>
  )
}

function AddTraysDialog(props) {
  const { openDialog, closeDialog, trays, setTrays } = props
  const [openErrorSnack, setOpenErrorSnack] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [traysList, setTraysList] = useState([])
  const [trayData, setTrayData] = useState(trayDataDefault())
  const [quanty, setQuanty] = useState(0)

  useEffect(() => {
    materials.findAllTrays()
      .then(res => {
        let data = res.map(item => ({
          id: item.id,
          name: item.name,
          weight: item.weight
        }))
        setTraysList(data)
      })
  }, [])

  const handleTrayOnChange = (e) => {
    materials.findOneByName(e.target.value)
      .then(res => {
        setTrayData({
          id: res.id,
          name: res.name,
          weight: res.weight
        })
      })
      .catch(err => { console.log(err) })

  }

  const close = () => {
    setTrayData(trayDataDefault())
    setQuanty(0)
    closeDialog()
  }

  const add = () => {
    if (trayData.name == '') {
      setErrorText('Debe seleccionar una bandeja')
      setOpenErrorSnack(true)
    } else if (quanty <= 0) {
      setErrorText('la cantidad debe ser superior a 0')
      setOpenErrorSnack(true)
    } else {
      let tray = { id: trayData.id, name: trayData.name, quanty: quanty, weight: trayData.weight, subtotal: (quanty * trayData.weight) }
      let findThisTray = trays.filter(item => item.id == tray.id)
      if (findThisTray.length == 0) {
        setTrays([...trays, tray])
        setQuanty(0)
        setTrayData(trayDataDefault())
        closeDialog()
      } else {
        let replaceTrays = trays.map(item => {
          if (item.id === tray.id) {
            let quanty = item.quanty + tray.quanty
            return { ...item, quanty: quanty, subtotal: quanty * item.weight }
          } else {
            return item
          }
        })
        setTrays(replaceTrays)
        setTrayData(trayDataDefault())
        setQuanty(0)
        closeDialog()
      }
    }
  }

  return (
    <>
      <Dialog open={openDialog} maxWidth={'xs'} fullWidth>
        <DialogTitle>
          Agregar Bandejas
        </DialogTitle>
        <DialogContent>
          <Grid spacing={1} direction="column">
            <Grid item paddingTop={1}>
              <FormControl fullWidth size={'small'} variant="outlined">
                <InputLabel>Bandeja</InputLabel>
                <Select
                  label="Bandeja"
                  value={trayData.name}
                  onChange={handleTrayOnChange}
                >
                  {traysList.map(item => (
                    <MenuItem key={item.id} value={item.name} >{item.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item paddingTop={2}>
              <TextField label="Cantidad"
                value={quanty}
                onChange={(e) => { setQuanty(parseInt(e.target.value)) }}
                type={'number'}
                variant="outlined"
                size={'small'}
                fullWidth
              />

            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant={'contained'} onClick={add}>Agregar</Button>
          <Button onClick={close}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      <AppErrorSnack openSnack={openErrorSnack} setOpenSnack={setOpenErrorSnack} errorText={errorText} />
    </>
  )
}

function trayDataDefault() {
  return ({
    id: '',
    name: '',
    weight: 0,
  })
}
