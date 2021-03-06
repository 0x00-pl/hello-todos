import React, {Component} from 'react'
import {curry} from '../lib/fp'

class TLItem extends Component {
    onRemove() {
        this.props.removeHandle(this.props.idx)
    }
    changeCompletedHandle(evt) {
        let isCompleted = evt.target.checked
        this.props.changeCompletedHandle(this.props.idx, isCompleted)
    }
    render() {
        return (
            <li className='todos-list-item'>
                <input type='checkbox' className='todos-list-item-checkbox todos-checkbox'
                    checked={this.props.todo.completed}
                    onChange={this.changeCompletedHandle.bind(this) } />
                <span className='todos-list-item-text' >{ this.props.todo.text }</span>
                <button className='todos-list-item-remove'
                    onClick={this.onRemove.bind(this) } >
                    X
                </button>
            </li>
        )
    }
}

class TLFooter extends Component {
    render() {
        return (
            <div className='todos-footer'>
                <span className='todos-footer-counter' >{this.props.active_count} items left</span>
                <span className='todos-footer-filters'>
                    <button className='todos-footer-btn' onClick={this.props.showAllHandle} >All</button>
                    <button className='todos-footer-btn' onClick={this.props.showActiveHandle} >Active</button>
                    <button className='todos-footer-btn' onClick={this.props.showCompletedHandle} >Completed</button>
                </span>
                <button className={'todos-footer-btn todos-footer-btn-remove'+((this.props.completed_count==0)?" hidden":"")}
                    onClick={this.props.clearCompletedHandle}>
                    Clear completed
                    </button>
            </div>
        )
    }
}

export default class TodoList extends Component {
    constructor() {
        super()
        this.state = { showing: 'All' }
    }
    getCompleted() {
        return this.props.todos.filter((i) => i.completed)
    }
    getActive() {
        return this.props.todos.filter((i) => !i.completed)
    }
    getAll() {
        return this.props.todos
    }
    setShowing(s) {
        this.setState({ showing: s })
    }
    getShowingTodos() {
        switch (this.state.showing) {
            case 'Completed': return this.getCompleted()
            case 'Active': return this.getActive()
            default: return this.getAll()
        }
    }
    render() {
        return (
            <div className='todos-list'>
                <ul className='todos-list-list' >
                    {this.getShowingTodos().map((todo, idx) =>
                        <TLItem todo={todo} idx={todo.id} key={todo.id}
                            removeHandle={this.props.removeHandle}
                            changeCompletedHandle={this.props.changeCompletedHandle} />
                    ) }
                </ul>
                <TLFooter
                    showing={this.state.showing}
                    completed_count={this.getCompleted().length}
                    active_count={this.getActive().length}
                    showAllHandle={curry(this.setShowing.bind(this), 'All') }
                    showActiveHandle={curry(this.setShowing.bind(this), 'Active') }
                    showCompletedHandle={curry(this.setShowing.bind(this), 'Completed') }
                    clearCompletedHandle={this.props.clearCompletedHandle}/>
            </div>
        )
    }
}
