import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class Landing extends Component {
  render() {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-6 mt-5'>
            <h1>What are we cookin' today?</h1>
            <p>Search for recipes based on your ingredients at home!</p>
            <Link className='btn btn-success mt-2' to={"/search"}>Get Started!</Link>
          </div>
          <div className='col-6'>
            <img src={require("./pngegg.png")} className='img-begin' alt='...' />
          </div>
        </div>
      </div>
    )
  }
}
