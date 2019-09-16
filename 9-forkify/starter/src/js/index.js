//import str from './models/Search';

//import {add, multiply, ID} from './views/searchView';
//import {add as a , multiply as m, ID} from './views/searchView';
//import * as searchView from './views/searchView';

//console.log(`Using imported functions! ${add(ID, 2)} and ${multiply(3, 5)}. ${str}`);
//console.log(`Using imported functions! ${a(ID, 2)} and ${m(3, 5)}. ${str}`);
//console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(3, 5)}. ${str}`);

// ACTUAL APPLICATION CODE

//API key 14377cc1984efd0e7fa70ebf931184e7
//https://www.food2fork.com/api/search
//https://www.food2fork.com/api/get
//crossorigin.me

// import axios from 'axios';

// const crossOriginProxy = 'https://crossorigin.me';
// const herokuappProxy = 'https://cors-anywhere.herokuapp.com/';
// const apiKey = '14377cc1984efd0e7fa70ebf931184e7';

// async function getResults(query) {
//   try {
//     const res = await axios(`${herokuappProxy}https://www.food2fork.com/api/search?key=${apiKey}&q=${query}`);
//     const recipes = res.data.recipes;
//     console.log(recipes);
//   } catch (error) {
//     alert(error);
//   }
// }
// getResults('tomato pasta');

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

// global state of the application
// - search object
// - current recipe object
// - shopping list object
// - liked recipes
const state = {};

const controlSearch = async() => {
  //1 get query from view
  const query = searchView.getInput(); // get from view

  if (query) {
    //2 new search object and add to state
    state.search = new Search(query);

    //3a prepare UI for results
    searchView.clearInput();

    //3b clear UI results
    searchView.clearResults();

    //3c activate loader widget
    renderLoader(elements.searchRes);

    //4a preform search
    await state.search.getResults();
    //4b stop loader
    clearLoader(elements.searchRes);


    //5 render results on UI
    searchView.renderResults(state.search.results);

  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

