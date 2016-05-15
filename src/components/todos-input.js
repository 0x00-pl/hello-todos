import React, { Component } from 'react'
import { LocalStorage } from '../lib/storage'


let localStorageKey = 'todos_history'

export default class TodosInput extends Component {
    constructor() {
        super()
        this.state = { history: [], todo_text: '' }
        new LocalStorage(this.onHistoryChange.bind(this), localStorageKey, (storage) => {
            this.storage = storage
        })

        setTimeout(this.onHistoryChange.bind(this), 10)
    }
    addHistory(todo_text) {
        if (this.state.history.every((i) => { return i.text != todo_text })) {
            this.storage.addData({ text: todo_text }, () => { })
        }
    }
    onHistoryChange() {
        this.storage.getDatas((history) => {
            this.setState({ history: history })
        })
    }

    filteHistory(starts) {
        starts = starts || this.state.todo_text
        if (starts.length < 3) { return [] }
        let needed = this.state.history.filter((i) => { return i.text.startsWith(starts) })
        return needed.map((i) => { return i.text })
    }
    // onAddTodo(todo_text) {
    // this.props.addTodoHandle({ text: todo_text, completed: false })
    // let history = Array.prototype.concat(todo_text, this.state.history)
    // this.addHistory(todo_text)
    // this.setState({ history: history })
    // }
    onInputChangeHandle(evt) {
        let todo_text = evt.target.value
        this.setState({ todo_text: todo_text })
    }
    onKeyDown(evt) {
        let key_code = evt.keyCode
        switch (key_code) {
            case 13: //enter
                this.props.addTodoHandle({ text: this.state.todo_text, completed: false })
                this.addHistory(this.state.todo_text)
                evt.target.value = ''
                this.setState({ todo_text: '' })
                evt.preventDefault()
                break
            case 9: //table
                let target_text = this.filteHistory()[0] || this.state.todo_text
                evt.target.value = target_text
                this.setState({ todo_text: evt.target.value })
                evt.preventDefault()
                break
        }
    }
    render() {
        return (
            <span className='todos-input'>
                <input className='todos-input-input' type='text'
                    onKeyDown={ this.onKeyDown.bind(this) }
                    onChange={ this.onInputChangeHandle.bind(this) }/>
                <div className='todos-input-input-hint'>
                    {this.filteHistory().map((i) => {
                        return (
                            <div className='todos-input-input-hint-item'>
                                { i }
                            </div>
                        )
                    }) }
                </div>
            </span>
        )
    }
}