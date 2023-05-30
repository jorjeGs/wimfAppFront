import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navigation extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className='nav-link' to='/'>
                                    <h5>WELCOME</h5>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className='nav-link' to='/search'>
                                    <h5>SEARCH</h5>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className='nav-link' to='/recipes'>
                                    <h5>RECIPES</h5>
                                </Link>
                            </li>
                            <li className="nav-item ">
                                <Link className='nav-link' to='/users'>
                                    <h5>USERS</h5>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}