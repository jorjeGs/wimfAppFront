import React, { Component } from 'react'
import axios from 'axios'
import BeatLoader from 'react-spinners/BeatLoader'
import ClipLoader from 'react-spinners/ClipLoader'

export default class Createuser extends Component {

  state = {
    users: [],
    username: "",
    _id: "",
    service: true,
    loadingBack: true
  }

  async componentDidMount() {
    //pedimos los datos al backend en cuanto se monte el componente
    this.getUsers();
  }
  onChangeUsername = (e) => {
    console.log(e.target.value)
    this.setState({
      username: e.target.value
    })
  }
  getUsers = async () => {
    try {
      this.setState({ loadingBack: true })
      const res = await axios.get('https://wimfapp-api.onrender.com/api/users'); //axios para la comunicacion back=front
      this.setState({ users: res.data, loadingBack: false }); //se almacena en el estado el arreglo de usuarios

    } catch (e) {
      this.setState({
        loadingBack: false,
        service: false
      })
    }
  }

  onSubmit = async e => {
    e.preventDefault(); //con esta funcion evitamos reiniciar el navegador
    try {
      this.setState({ loadingBack: true })
      await axios.post('https://wimfapp-api.onrender.com/api/users', { //enviamos los datos al servidor
        username: this.state.username
      })
      this.setState({ username: '', loadingBack: false });
      this.getUsers();
    } catch (e) {
      this.setState({
        loadingBack: false
      })
    }

  }

  deleteUser = async (id) => {
    try {
      this.setState({ loadingBack: true })
      await axios.delete('https://wimfapp-api.onrender.com/api/users' + id)
      this.setState({ loadingBack: false })
      this.getUsers();

    } catch (e) {
      this.setState({
        loadingBack: false
      })
    }
  }

  Main = ({ serverOnline }) => {
    if (serverOnline) {
      return <div className="row">
        <div className="col-md-4">
          <div className="card card-body">
            <h3>Create User</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={this.state.username}
                  onChange={this.onChangeUsername}
                />
              </div>
              <button type="submit" className="btn btn-success mt-1">
                {this.state.loadingBack ? <ClipLoader color='white' loading={this.state.loadingBack} size={20} data-testid="loader" /> : <>Save</>}
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-8">
          <ul className="list-group">
            {
              this.state.users.map(user => (
                <li className="list-group-item list-group-item-action d-flex justify-content-between"
                  key={user._id}
                  onDoubleClick={() => { if (window.confirm('Are you sure you want to delete the user?')) this.deleteUser(user._id) }}
                >
                  {user.username}
                </li>)
              )
            }
          </ul>
        </div>
      </div>
    } else {
      return <h1><b>The service is offline</b>, but in <b>RECIPES PAGE</b> we have some recipes that we think you'd like...</h1>
    }
  }

  render() {
    return (
      <this.Main
        serverOnline={this.state.service}
      />
    )
  }
}