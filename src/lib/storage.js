
class DummyStorage {
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


class TempStorage {
    constructor(onChangeHandle, cb_storage) {
        this.onChangeHandle = onChangeHandle
        this.datas = []
        cb_storage(this)
    }
    getDatas(cb_datas) {
        cb_datas(this.datas)
    }
    addData(data, cb_pk) {
        let pk = this.datas.length
        this.datas = this.datas.concat(data)
        this.onChangeHandle()
        cb_pk(pk)
    }
    getData(pk, cb_data) {
        cb_data(this.datas[pk])
    }
    removeData(pk, cb_data) {
        let data_l = this.datas.slice(0, pk)
        let data = this.datas[pk]
        let data_r = this.datas.slice(pk + 1)
        this.datas = Array.prototype.concat(data_l, data_r)
        this.onChangeHandle()
        cb_data(data)
    }
    changeData(pk, data, cb_data) {
        let data_l = this.datas.slice(0, pk)
        let data_o = this.datas[pk]
        let data_r = this.datas.slice(pk + 1)
        this.datas = Array.prototype.concat(data_l, [data], data_r)
        this.onChangeHandle()
        cb_data(data_0)
    }
}


class LocalStorage {
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
        let datas = this.GetDatas()
        let pk = datas.length
        let new_datas = datas.concat(data)
        window.localStorage.setItem(this.localStorageKey, new_datas)
        this.onChangeHandle()
        cb_pk(pk)
    }
    getData(pk, cb_data) {
        let datas = this.GetDatas()
        let data = datas[pk]
        cb_data(data)
    }
    removeData(pk, cb_data) {
        let datas = this.GetDatas()
        let data_l = this.datas.slice(0, pk)
        let data = this.datas[pk]
        let data_r = this.datas.slice(pk + 1)
        this.datas = Array.prototype.concat(data_l, data_r)

        let datasj = JSON.stringify(datas)
        window.localStorage.setItem(localStorageKey, this.datasj)
        this.onChangeHandle()
        cb_data(data)
    }
    changeData(pk, data, cb_data) {
        let datas = this.GetDatas()
        let data_l = this.datas.slice(0, pk)
        let data_o = this.datas[pk]
        let data_r = this.datas.slice(pk + 1)
        this.datas = Array.prototype.concat(data_l, [data], data_r)

        let datasj = JSON.stringify(datas)
        window.localStorage.setItem(localStorageKey, this.datasj)
        this.onChangeHandle()
        cb_data(data_o)
    }
}


class RestStorage {
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
                cb_data(data)
            })
    }
    changeData(pk, data, cb_data) {
        let text = JSON.stringify(data)
        this.ajax('PUT', this.rest_addr + pk, text,
            function (text) {
                let data = JSON.parse(text)
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
