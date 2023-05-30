import React, { Component } from 'react'
import axios from 'axios'
import BeatLoader from 'react-spinners/BeatLoader'
import ClipLoader from 'react-spinners/ClipLoader'


export default class Recipes extends Component {
  state = {
    users: [],
    recipesList: [],
    selectedUser: "",
    selectedId: "",
    searchUser: [],
    service: true,
    loading: false,
    loadingBack: true,
    search: false
  }

  async componentDidMount() {
    //implementacion de TOLERANCIA A FALLAS, para ocultar al cliente tiempo de carga o que se congele la aplicacion web tras la consulta
    try {
      this.setState({ loadingBack: true })
      const res = await axios.get('https://wimfapp-api.onrender.com/api/users');
      this.setState({
        users: res.data,
        selectedUser: res.data[0]._id,
        loadingBack: false
      })
    } catch (e) {
      console.log('Ocurrio un error obteniendo los, si no se puede esto ps ni modo')
      this.setState({
        service: false,
        loadingBack: false
      })
    }
  }

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
    console.log(this.state.selectedUser + " a" + this.state.selectedId)
  }

  onSubmit = async e => {
    e.preventDefault();
    try {
      this.setState({ loading: true })
      console.log("doing search with this user: " + this.state.selectedUser)
      const res = await axios.get('https://wimfapp-api.onrender.com/api/users/' + this.state.selectedUser).then((res) => { console.log(res.data.recipes); this.setState({ searchUser: res.data.recipes }) })
      this.setState({
        loading: false,
        search: true
      })
      console.log('usuario rescatado: ' + this.state.selectedUser)
      console.log(this.state.searchUser)
    } catch (e) {
      console.log('Error de consulta de resultados')
      this.setState({
        loading: false
      })
    }
  }

  LoadResults = ({ didsearch }) => {
    if (didsearch) {
      return this.state.searchUser.map(recipe => (
        <div className="card mb-3">
          <div className="row g-0">
            <div className="col-md-4">
              <img src={recipe.image} className="img-thumbnail" alt="..." />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>
                <p className="card-text">{recipe.preparation}</p>
                <p className="card-text"><small className="text-muted"> Ready in: {recipe.readyIn} min.</small></p>
              </div>
            </div>
          </div>
        </div>
      ))
    }
    else {
      return <h2>Here you will see your saved recipes!</h2>
    }
  }

  Main = ({ serverOnline }) => {
    if (serverOnline) {
      return <div className='container-fluid'>
        <div className='row'>
          <h1>Your recipes, by user search!</h1>
        </div>
        <div className='row'>
          <div className='form-group'>
            <div className='row mt-5'>
              <div className='col-11 text-align-left'>
                <h3>Select user, or <b>create one</b></h3>
              </div>
            </div>
            {this.state.loadingBack ? <BeatLoader color="#00EC27" loading={this.state.loadingBack} size={25} data-testid="loader" /> :
              <select
                className="form-control"
                name="selectedUser"
                onChange={this.onInputChange}
                value={this.state.selectedUser}
              >
                {
                  this.state.users.map(user =>
                    <option key={user._id} value={user._id} onClick={() => { console.log('hola') }}>
                      {user.username}
                    </option>)
                }
              </select>
            }
            <form onSubmit={this.onSubmit}>
              <button type="submit" className="btn btn-success mt-2 mb-2">
                {this.state.loading ? <ClipLoader color='white' loading={this.state.loading} size={20} data-testid="loader" /> : <>Search</>}
              </button>
            </form>
          </div>
        </div>
        <div className="row">
          <this.LoadResults
            didsearch={this.state.search}
          />
        </div>
      </div>
    }
    else {
      return <h1><b>The service is offline</b>, but <b>here</b> we have some recipes that we think you'd like...</h1> //mapear recipesList backup
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
