import React, { Component } from 'react'
import { curry } from '../lib/fp'

import {} from './todos.css'

import TodosInput from './todos-input'
import TodosList from './todos-list'

let localStorageKey = 'todos'

export default class Todos extends Component {
    constructor() {
        super()
        window.addEventListener('storage', this.onTodosChange.bind(this));
        let todosj = window.localStorage.getItem(localStorageKey) || '[]'
        let todos = JSON.parse(todosj)

        this.state = { todos: todos }
    }
    saveTodos(todos) {
        let todosj = JSON.stringify(todos)
        window.localStorage.setItem(localStorageKey, todosj)
    }
    loadTodos() {
        let todosj = window.localStorage.getItem(localStorageKey) || '[]'
        let todos = JSON.parse(todosj)
        this.setState({ todos: todos })
    }
    onTodosChange(e) {
        console.log(e)
        // document.querySelector('.my-key').textContent = e.key;
        // document.querySelector('.my-old').textContent = e.oldValue;
        // document.querySelector('.my-new').textContent = e.newValue;
        // document.querySelector('.my-url').textContent = e.url;
        // document.querySelector('.my-storage').textContent = e.storageArea;
        if (e.key == localStorageKey) {
            this.loadTodos()
        }
    }
    addTodo(todo) {
        let todos_old = this.state.todos
        let todos = Array.prototype.concat([todo], todos_old)
        this.saveTodos(todos)
        this.setState({ todos: todos })
    }
    removeTodo(idx) {
        let todos_old = this.state.todos
        let todos_l = todos_old.slice(0, idx)
        let todos_r = todos_old.slice(idx + 1)
        let todos = Array.prototype.concat(todos_l, todos_r)
        this.saveTodos(todos)
        this.setState({ todos: todos })
    }
    changeTodo(idx, func) {
        let todos_old = this.state.todos
        let todos_l = todos_old.slice(0, idx)
        let todos_c = todos_old[idx]
        let todos_r = todos_old.slice(idx + 1)
        let todos = Array.prototype.concat(todos_l, func(todos_c), todos_r)
        this.saveTodos(todos)
        this.setState({ todos: todos })
    }
    clearCompleted() {
        let todos_old = this.state.todos
        let todos = todos_old.filter((i) => !i.completed)
        this.saveTodos(todos)
        this.setState({ todos: todos })
    }
    setCompleted(idx, isCompleted) {
        // this.changeTodo(idx, (i) => { return { 'text': i.text, 'completed': isCompleted } })
        this.changeTodo(idx, (i) => Object.assign({}, i, { completed: isCompleted }))
    }
    setCompletedAll(isCompleted) {
        let todos_old = this.state.todos
        let todos = todos_old.map((i) => Object.assign({}, i, { completed: isCompleted }))
        this.saveTodos(todos)
        this.setState({ todos: todos })
    }
    setCompletedAllHandle(evt) {
        let isCompleted = evt.target.checked
        this.setCompletedAll(isCompleted)
    }
    isAllComplete() {
        return this.state.todos.every((i) => i.completed)
    }
    render() {
        return (
            <div className="todos">
                <span className="todos-header">
                    <input type='checkbox'
                        className={'todos-checkbox' + ((this.state.todos.length == 0) ? " hidden" : "") }
                        checked={this.isAllComplete() ? true : false}
                        onChange={this.setCompletedAllHandle.bind(this) } />
                    <TodosInput addTodoHandle={this.addTodo.bind(this) } />
                </span>
                <TodosList
                    todos={ this.state.todos }
                    changeCompletedHandle={ this.setCompleted.bind(this) }
                    removeHandle={ this.removeTodo.bind(this) }
                    clearCompletedHandle={ this.clearCompleted.bind(this) } />
            </div>
        )
    }
}