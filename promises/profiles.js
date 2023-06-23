import electron from 'electron'
const ipcRenderer = electron.ipcRenderer

function findAll() {
    let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const profile = new Promise((resolve, reject) => {
        fetch(server_url + 'profiles/findAll', {
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

    return profile
}

export {findAll}