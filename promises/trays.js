import electron from 'electron'
const ipcRenderer = electron.ipcRenderer



function create(name, weight) {
    let data = { name, weight}
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/create', {
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
    return tray
}


function findAll() {
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/findAll', {
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
        }).catch(err => {reject(err)})
    })

    return tray
}




function destroy(id) {
    let data = { 'id':id }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/destroy', {
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
    return tray
}

function update(id, name, weight, stock) {
    let data = {id, name, weight, stock }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/update', {
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
    return tray
}

function findOneById(id) {
    let data = { 'id':id }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/findOneById', {
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
    return tray
}

function findOneByName(name) {
    let data = { 'name':name }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/findOneByName', {
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
    return tray
}

function findAllMovements() {
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/findAllMovements', {
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
    return tray
}

function createMovement(quanty, type, producer_id, tray_id, stock_balance) {
    let data = { quanty, type, producer_id, tray_id, stock_balance }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/createMovement', {
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
    return tray
}

function inputStock(tray_id, quanty, producer_id) {
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        findOneById(tray_id)
            .then(res => {
                let oldStock = res.stock
                let newStock = oldStock + parseInt(quanty) 
                update(res.id, res.name, res.weight, newStock)
                    .then(() => {
                        createMovement(quanty, 0, producer_id, tray_id, newStock)
                        .then(() => {
                            resolve()
                        })
                        .catch(err => { reject(err) })
                    })
                    .catch(err => { reject(err) })
            })
            .catch(err => { reject(err) })
    })
    return tray
}

function outputStock(tray_id, quanty, producer_id) {
    const tray = new Promise((resolve, reject) => {
        findOneById(tray_id)
            .then(res => {
                let oldStock = res.stock
                let newStock = oldStock - parseInt(quanty)
                update(res.id, res.name, res.weight, newStock)
                    .then(() => {
                        createMovement(quanty, 1, producer_id, tray_id, newStock)
                        .then(() => {
                            resolve()
                        })
                        .catch(err => { reject(err) })
                    })
                    .catch(err => { reject(err) })
            })
            .catch(err => { reject(err) })
    })
    return tray
}

export { create, findAll, destroy, update, findOneById, findOneByName, findAllMovements, createMovement, inputStock, outputStock}