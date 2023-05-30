import React, {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

import Navigation from './components/navigation'
import Search from './components/search'
import Recipes from './components/Recipes'
import CreateUser from './components/CreateUser'
import Landing from './components/Landing'

function App() {
  //uso de hooks para obtener los estados de carga
  const [isLoading, setLoading] = useState(true);

  function someRequest() { //Simulates a request; makes a "promise" that'll run for 2.5 seconds
    return new Promise(resolve => setTimeout(() => resolve(), 2500));
  } 

  useEffect(() => {//elimina el div del index.html y carga root
    someRequest().then(() => {
      const loaderElement = document.querySelector(".loader-container");
      if (loaderElement) {
        loaderElement.remove();
        setLoading(!isLoading);
      }
    });
  });

  if (isLoading) {
    return null;
  }
  
  return (
    <BrowserRouter>
      <Navigation/>
      <div className='container p-4'>
        <Routes>
          <Route path='/' Component={Landing} />
          <Route path='/users' Component={CreateUser} />
          <Route path='/recipes' Component={Recipes} />
          <Route path='/search' Component={Search} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
