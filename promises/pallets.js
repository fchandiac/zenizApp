import electron from 'electron'
const ipcRenderer = electron.ipcRenderer

function create(variety_id, tray_id, storage_id, weight) {
    let data = { variety_id, tray_id, storage_id, weight }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'pallets/create', {
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




function findAllByVariety(variety_id) {
    let data = { variety_id }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'pallets/findAllByVariety', {
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

function findAll() {
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'pallets/findAll', {
            method: 'GET',
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




function updateTrays(id, trays) {
    let data = { id, trays }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'pallets/updateTrays', {
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
        fetch(server_url + 'pallets/findOneById', {
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

function updateMax(id, max) {
    let data = { id, max }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'pallets/updateMax', {
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

export { create, findAllByVariety, updateTrays, findOneById, findAll, updateMax}