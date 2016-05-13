
export class DummyStorage {
    constructor(onChangeHandle, cb_storage) {
        this.onChangeHandle = onChangeHandle
        cb_storage(this)
    }
    getDatas(cb_datas) {
        cb_datas([])
    }
    addData(data, cb_pk) {
        cb_pk(undefined)
    }
    getData(pk, cb_data) {
        cb_data(undefined)
    }
    removeData(pk, cb_data) {
        cb_data(undefined)
    }
    changeData(pk, data, cb_data) {
        cb_data(undefined)
    }
}


export class TempStorage {
    constructor(onChangeHandle, cb_storage) {
        this.onChangeHandle = onChangeHandle
        this.datas = []
        this.idx = 0
        cb_storage(this)
    }
    getDatas(cb_datas) {
        cb_datas(this.datas)
    }
    addData(data, cb_pk) {
        this.idx = this.idx + 1
        let data_ = Object.assign({}, data, { id: this.idx })
        this.datas = this.datas.concat(data_)
        this.onChangeHandle()
        cb_pk(this.idx)
    }
    getData(pk, cb_data) {
        let data_ = this.datas.filter((i) => i.id == pk)
        if (data_.length == 0) {
            cb_data(undefined)
        } else {
            cb_data(data_[0])
        }
    }
    removeData(pk, cb_data) {
        let data = undefined
        this.datas = this.datas.filter((i) => {
            if (i.id == pk) {
                data = i
                return false
            } else {
                return true
            }
        })
        this.onChangeHandle()
        cb_data(data)
    }
    changeData(pk, data, cb_data) {
        data.id = pk
        let data_o = undefined
        this.datas = this.datas.map((i) => {
            if (i.id == pk) {
                data_o = i
                return data
            } else {
                return i
            }
        })
        this.onChangeHandle()
        cb_data(data_o)
    }
}


export class LocalStorage {
    constructor(onChangeHandle, localStorageKey, cb_storage) {
        this.onChangeHandle = onChangeHandle
        this.localStorageKey = localStorageKey

        window.addEventListener('storage', (e) => {
            if (e.key == localStorageKey) {
                onChangeHandle()
            }
        });
        cb_storage(this)
    }
    getDatas(cb_datas) {
        let datasj = window.localStorage.getItem(this.localStorageKey) || '[]'
        let datas = JSON.parse(datasj)
        cb_datas(datas)
    }
    addData(data, cb_pk) {
        this.getDatas((datas) => {
            let pk = window.localStorage.getItem(this.localStorageKey + '_idx') || 0
            pk = pk | 0
            window.localStorage.setItem(this.localStorageKey + '_idx', pk + 1)

            data.id = pk
            let new_datas = datas.concat(data)
            let dataj = JSON.stringify(new_datas)
            window.localStorage.setItem(this.localStorageKey, dataj)
            this.onChangeHandle()
            cb_pk(pk)
        })
    }
    getData(pk, cb_data) {
        this.getDatas((datas) => {
            let data_ = datas.filter((i) => i.id == pk)
            if (data_.length == 0) {
                cb_data(undefined)
            } else {
                cb_data(data_[0])
            }
        })
    }
    removeData(pk, cb_data) {
        this.getDatas((datas) => {
            let data = undefined
            let datas_new = datas.filter((i) => {
                if (i.id == pk) {
                    data = i
                    return false
                } else {
                    return true
                }
            })
            let datasj = JSON.stringify(datas_new)
            window.localStorage.setItem(this.localStorageKey, datasj)
            this.onChangeHandle()
            cb_data(data)
        })
    }
    changeData(pk, data, cb_data) {
        this.getDatas((datas) => {
            data.id = pk
            let data_o = undefined
            let datas_new = datas.map((i) => {
                if (i.id == pk) {
                    data_o = i
                    return data
                } else {
                    return i
                }
            })
            let datasj = JSON.stringify(datas_new)
            window.localStorage.setItem(this.localStorageKey, datasj)
            this.onChangeHandle()
            cb_data(data_o)
        })
    }
}


export class RestStorage {
    constructor(onChangeHandle, rest_addr, cb_storage) {
        this.onChangeHandle = onChangeHandle
        if (!rest_addr.endsWith('/')) {
            rest_addr = rest_addr + '/'
        }
        this.rest_addr = rest_addr
        cb_storage(this)
    }
    getDatas(cb_datas) {
        this.ajax('GET', this.rest_addr, '',
            function (text) {
                let datas = JSON.parse(text)
                cb_datas(datas)
            })
    }
    addData(data, cb_pk) {
        let text = JSON.stringify(data)
        this.ajax('POST', this.rest_addr, text,
            function (text) {
                let pk = JSON.parse(text) | 0
                this.onChangeHandle()
                cb_pk(pk)
            })
    }
    getData(pk, cb_data) {
        this.ajax('GET', this.rest_addr + pk, '',
            function (text) {
                let data = JSON.parse(text)
                cb_data(data)
            })
    }
    removeData(pk, cb_data) {
        this.ajax('DELETE', this.rest_addr + pk, '',
            function (text) {
                let data = JSON.parse(text)
                this.onChangeHandle()
                cb_data(data)
            })
    }
    changeData(pk, data, cb_data) {
        let text = JSON.stringify(data)
        this.ajax('PUT', this.rest_addr + pk, text,
            function (text) {
                let data = JSON.parse(text)
                this.onChangeHandle()
                cb_data(data)
            })
    }
    ajax(protocol, url, text, cb_text) {
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            // TODO: handle errors
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                cb_text(xhttp.responseText)
            }
        }
        xhttp.open(protocol, url, true)
        xhttp.send(text)
    }
}
