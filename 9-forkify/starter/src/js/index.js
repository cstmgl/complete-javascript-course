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

import axios from 'axios';

const crossOriginProxy = 'https://crossorigin.me';
const herokuappProxy = 'https://cors-anywhere.herokuapp.com/';
const apiKey = '14377cc1984efd0e7fa70ebf931184e7';

async function getResults(query) {
  const res = await axios(`${herokuappProxy}/https://www.food2fork.com/api/search?key=${apiKey}&q=${query}`);
  console.log(res);
}
getResults('piza');