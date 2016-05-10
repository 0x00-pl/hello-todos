import React, {Component} from 'react'


let localStorageKey = 'todos_history'

export default class TodosInput extends Component {
    constructor() {
        super()
        this.state = { history: [] }
    }
    saveHistory(history) { }
    loadHistory() { }


    onAddTodo(todo_text) {
        this.props.addTodoHandle({ text: todo_text, completed: false })
        let history = Array.prototype.concat(todo_text, this.state.history)
        this.saveHistory(history)
        this.setState({ history: history })
    }
    onKeyDown(evt) {
        let key_code = evt.keyCode
        switch (key_code) {
            case 13: //enter
                let todo_text = evt.target.value
                evt.target.value = ''
                this.onAddTodo(todo_text)
                break;
            case 9: //table

                break;
        }
    }
    render() {
        return (
            <span className='todos-input'>
                <input className='todos-input-input' type='text'
                    onKeyDown={this.onKeyDown.bind(this) } />
            </span>
        )
    }
}