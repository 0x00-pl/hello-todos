import React, { Component } from 'react'
import { curry } from '../lib/fp'
import { DummyStorage, TempStorage, LocalStorage, RestStorage } from '../lib/storage'

import {} from './todos.css'

import TodosInput from './todos-input'
import TodosList from './todos-list'

let localStorageKey = 'todos'


export default class Todos extends Component {
    constructor() {
        super()
        new LocalStorage(this.onTodosChangeHandle.bind(this), localStorageKey, (s) => {
            this.storage = s
        })
        this.state = { todos: [] }
        
        setTimeout(this.onTodosChangeHandle.bind(this), 10)
    }
    onTodosChangeHandle() {
        this.storage.getDatas((todos) => {
            this.setState({ todos: todos })
        })
    }
    getTodos(cb_todos) {
        this.storage.getDatas((todos) => {
            this.setState({ todos: todos })
            cb_todos(todos)
        })
    }
    addTodo(todo) {
        this.storage.addData(todo, () => { })
    }
    removeTodo(pk) {
        this.storage.removeData(pk, () => { })
    }
    changeTodo(pk, func) {
        this.storage.getData(pk, (todo_o) => {
            let todo = func(todo_o)
            this.storage.changeData(pk, todo, () => { })
        })
    }
    clearCompleted() {
        this.getTodos((todos) => {
            let todos_unused = todos.filter((i) => i.completed)
            todos_unused.map((i) => {
                this.storage.removeData(i.id, () => { })
            })
        })
    }
    setCompleted(idx, isCompleted) {
        this.changeTodo(idx, (i) => Object.assign({}, i, { completed: isCompleted }))
    }
    setCompletedAll(isCompleted) {
        this.getTodos((todos) => {
            todos.map((i) => {
                let todo = Object.assign({}, i, { completed: isCompleted })
                this.storage.changeData(i.id, todo, () => { })
            })
        })
    }
    onSetCompletedAllHandle(evt) {
        let isCompleted = evt.target.checked
        this.setCompletedAll(isCompleted)
    }
    isAllComplete() {
        return this.state.todos.every((i) => i.completed)
    }
    render() {
        return (
            <div className= "todos" >
                <span className="todos-header">
                    <input type='checkbox'
                        className={'todos-checkbox' + ((this.state.todos.length == 0) ? " hidden" : "") }
                        checked={this.isAllComplete() ? true : false}
                        onChange={this.onSetCompletedAllHandle.bind(this) } />
                    <TodosInput addTodoHandle={this.addTodo.bind(this) } />
                </span>
                <TodosList
                    todos={ this.state.todos }
                    changeCompletedHandle={ this.setCompleted.bind(this) }
                    removeHandle={ this.removeTodo.bind(this) }
                    clearCompletedHandle={ this.clearCompleted.bind(this) } />
            </div >
        )
    }
}