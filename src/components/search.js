import React, { Component } from 'react'
import axios from 'axios'
import ClipLoader from 'react-spinners/ClipLoader'
import BeatLoader from 'react-spinners/BeatLoader'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

//del formulario, se guardara tambien el usuario, formulario por pasos, primero elegir usuario o crear uno, link a createuser
//segundo elegir los ingredientes
//tercero cantidad de recetas
//presionar generar busqueda y de ahi, mandar a otro componente para elegir entre las recetas SearchResults/:id, este mandaria
//cuando se selecciona la receta, ahora si se obtiene el id desde params y se hace la consulta updateUser con el id de la recipe


export default class search extends Component {
    state = {
        users: [],
        ingredientsList: [],
        selectedUser: '',
        ingredients: '',
        searchNumber: '1',
        results: [],
        search: false,
        service: true,
        foodServiceDown: false,
        loading: false,
        loadingBack: true
    }

    async componentDidMount() {
        //implementacion de TOLERANCIA A FALLAS, para ocultar al cliente tiempo de carga o que se congele la aplicacion web tras la consulta
        try {
            this.setState({ loadingBack: true })
            const res = await axios.get('https://wimfapp-api.onrender.com/api/users');
            const ingr = await axios.get('https://wimfapp-api.onrender.com/api/ingredients')
            this.setState({
                users: res.data,
                ingredientsList: ingr.data,
                selectedUser: res.data[0].username,
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
        console.log(this.state.ingredients + ', userselected: ' + this.state.selectedUser + ', numrec: ' + this.state.searchNumber)
    }
    onIngredientchange = (e) => {
        var updated = ''
        var checks = document.querySelectorAll('.quiz_checkbox')
        checks.forEach((check) => {
            if (check.checked == true) {
                if (updated == '') { updated = check.value }
                else {
                    updated = updated + ',' + check.value
                }
            }
        })
        this.setState({
            ingredients: updated
        })
        console.log(this.state.ingredients)
    }
    onSubmit = async e => {
        e.preventDefault();
        const options = {
            method: 'GET',
            url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients',
            params: {
                ingredients: this.state.ingredients,
                number: this.state.searchNumber,
                ignorePantry: 'true',
                ranking: '1'
            },
            headers: {
                'X-RapidAPI-Key': '99a67bbd1cmsh02fb55dc79a4625p186d8cjsncbad1445fcd3',
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        };
        try {
            this.setState({ loading: true })
            const res = await axios.request(options)
            this.setState({
                results: res.data,
                search: true,
                loading: false
            })
            console.log(this.state.results)
        } catch (e) {
            console.log('Error de consulta de resultados')
            this.setState({
                foodServiceDown: true,
                loading: false
            })
        }
    }
    //se crea la receta ()y la guarda guarda en el usuario
    saveRecipe = async (id) => {
        console.log("creating recipe")
        //creando receta en BD
        try {
            this.setState({loading: true})
            const req = { recipeid: id }
            const res = await axios.post('https://wimfapp-api.onrender.com/api/recipes', req)
            this.setState({loading: false})
            //anexando a usuario con id de la BD
            console.log('created Recipe')

            this.setState({loading: true})
            const updateUser = { recipeid: res.data._id, username: this.state.selectedUser }
            const savedOnUser = await axios.put('https://wimfapp-api.onrender.com/api/users', updateUser)
            this.setState({loading: false})
            console.log("adding new recipe " + id + " to " + this.state.selectedUser)
            console.log(savedOnUser)
        }catch (e) {
            console.log('Error aaa')
        }

    }
    //renderizado condicional, una vez que el usuario hizo una busqueda
    Results = ({ didsearch }) => {
        if (didsearch) {
            return this.state.results.map(recipe => (
                <div className="col-sm-6" key={recipe.id}>
                    <div className="card">
                        <img src={recipe.image} className="img-thumbnail" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">{recipe.title}</h5>
                            <button
                                className="btn btn-success"
                                onClick={() => { if (window.confirm('Are you sure you want to save the recipe?')) this.saveRecipe(recipe.id) }}
                            >
                                Add Recipe
                            </button>
                        </div>
                    </div>
                </div>
            ))
        }
        else {
            return <h2>Here you will find your recipes</h2> //redireccionar a RECETAS, el componente tendra un arreglo de jsons con 10 recetas que seran
        }
    }

    FoodService = ({ foodServiceDown }) => {
        if (foodServiceDown) {
            return <h2><b>The recipe search service is offline</b>, you can try seeing your last results on <b>RECIPES</b> </h2>
        }
        else {
            return <this.Results didsearch={this.state.search} />
        }
    }

    Carousel = () => {
        const responsive = {
            desktop: {
                breakpoint: { max: 2500, min: 1024 },
                items: 3
            }
        };

        return (
            <Carousel responsive={responsive} itemClass='carousel-item-padding-0-px'>
                {this.state.ingredientsList.map(ingredient =>
                    <div className="quiz_card_area">
                        <input className="quiz_checkbox" type="checkbox" id={ingredient._id} value={ingredient.name} onChange={this.onIngredientchange} />
                        <div className="single_quiz_card">
                            <div className="quiz_card_content">
                                <div className="quiz_card_icon">
                                    <img src={ingredient.imgurl} className="img-thumbnail" alt="..." />
                                </div>
                                <div className="quiz_card_title">
                                    <h3><i className="fa fa-check" aria-hidden="true"></i>{ingredient.name}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Carousel >
        )
    }

    Main = ({ serverOnline }) => {
        if (serverOnline) {
            return <div className='container-fluid'>
                <div className='row'>
                    <div className='col-6'>
                        <h1>What are we cooking?</h1>
                        <p>Follow the steps, click on <b>Search</b> and, !Let's cook!</p>
                        <div className='form-group'>
                            <div className='row mt-5'>
                                <div className='col'>
                                    <h4>1</h4>
                                </div>
                                <div className='col-11 text-align-left'>
                                    <p>Select user, or <b>create one</b></p>
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
                                            <option key={user._id} value={user.username}>
                                                {user.username}
                                            </option>)
                                    }
                                </select>
                            }

                            <div className='row mt-5'>
                                <div className='col'>
                                    <h4>2</h4>
                                </div>
                                <div className='col-11 text-align-left'>
                                    <p>Click on the <b>ingredients</b> in your fridge</p>
                                </div>
                            </div>
                            <div className='row mt-2'>
                                <div className='col-12'>
                                    {this.state.loadingBack ? <BeatLoader color="#00EC27" loading={this.state.loadingBack} size={25} data-testid="loader" /> : <this.Carousel />}
                                </div>
                            </div>
                            <div className='row mt-3'>
                                <div className='col'>
                                    <h4>3</h4>
                                </div>
                                <div className='col-11 text-align-left'>
                                    <p>Select <b>how many</b> recipes, <b>max. 4</b></p>
                                </div>
                            </div>
                            <select className='form-select' aria-label='multiple select example' name='searchNumber' onChange={this.onInputChange} >
                                <option defaultValue='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                                <option value='4'>4</option>
                            </select>
                            <div className='row mt-4'>
                                <div className='col mt-2'>
                                    <h4>4</h4>
                                </div>
                                <div className='col-11 text-align-left'>
                                    <form onSubmit={this.onSubmit}>
                                        <button type="submit" className="btn btn-success mt-2">
                                            {this.state.loading ? <ClipLoader color='white' loading={this.state.loading} size={20} data-testid="loader" /> : <>Search</>}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-6 text-center mt-5'>
                        <div className='row'>
                            <this.FoodService foodServiceDown={this.state.foodServiceDown} />
                        </div>
                    </div>
                </div>
            </div>
        }
        else {
            return <h1><b>The service is offline</b>, but on <b>RECIPES</b> we have some of them that we think you'd like...</h1> //redireccionar a RECETAS, el componente tendra un arreglo de jsons con 10 recetas que seran
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