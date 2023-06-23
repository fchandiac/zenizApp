import electron from 'electron'
const ipcRenderer = electron.ipcRenderer

function create(
    trays_quanty,
    trays_weight,
    impurity,
    kg_impurity,
    gross,
    discount,
    net,
    pay,
    pallet_id,
    tray_id,
    reception_id
) {
    let data = {
        trays_quanty,
        trays_weight,
        impurity,
        kg_impurity,
        gross,
        discount,
        net,
        pay,
        pallet_id,
        tray_id,
        reception_id
    }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'receptionsDetails/create', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return pallet
}

function findOneById(id) {
    let data = { id }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'receptionsDetails/findOneById', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return pallet
}

function findOneByReceptionId(reception_id) {
    let data = { reception_id }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'receptionsDetails/findOneByReceptionId', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return pallet
}


function findAllByPalletId(pallet_id) {
    let data = { pallet_id }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'receptionsDetails/findAllByPalletId', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return pallet
}



export {create, findOneById, findOneByReceptionId, findAllByPalletId }