import electron from 'electron'
const ipcRenderer = electron.ipcRenderer

function create(guide,price,trays_quanty,trays_weight,gross,discount,net,producer_id,variety_id,type_id) {
    let data = { guide,price,trays_quanty,trays_weight,gross,discount,net,producer_id,variety_id,type_id }
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/create', {
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
    return reception
}
function findOneById(id) {
    let data = { id}
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/findOneById', {
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
    return reception
}



export {create, findOneById}