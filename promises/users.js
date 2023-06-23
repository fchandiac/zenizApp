import electron from 'electron'
const ipcRenderer = electron.ipcRenderer

function create(user, pass, name, mail, profile_id) {
    let data = {'user':user, 'pass':pass, 'name':name, 'mail':mail, 'profile_id':profile_id}
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const _user = new Promise((resolve, reject) => {
        fetch(server_url + 'users/create', {
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
        }).catch(err => {reject(err)})
    })

    return _user
}


function findOneByUser(user) {
    let data = {'user':user}
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const _user = new Promise((resolve, reject) => {
        fetch(server_url + 'users/findOneByUser', {
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
        }).catch(err => {reject(err)})
    })

    return _user
}


function findAll() {
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const _user = new Promise((resolve, reject) => {
        fetch(server_url + 'users/findAll', {
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

    return _user
}

function findOneById(id) {
    let data = {'id':id}
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const _user = new Promise((resolve, reject) => {
        fetch(server_url + 'users/findOneById', {
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
        }).catch(err => {reject(err)})
    })

    return _user
}



export {findOneByUser, create, findAll, findOneById}