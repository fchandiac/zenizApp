import electron from 'electron'
const ipcRenderer = electron.ipcRenderer

function create(name) {
    let data = { name}
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const storage = new Promise((resolve, reject) => {
        fetch(server_url + 'storages/create', {
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
    return storage
}

function findAll() {
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const storage = new Promise((resolve, reject) => {
        fetch(server_url + 'storages/findAll', {
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
    return storage
}

export {findAll, create}