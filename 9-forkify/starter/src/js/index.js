import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

// global state of the application
// - search object
// - current recipe object
// - shopping list object
// - liked recipes
const state = {};

/**
 * Search Controller
 */
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

    try {
      //4a preform search
      await state.search.getResults();
      console.log(state);

    } catch (err) {
      clearLoader(elements.searchRes);
      alert('Error preforming search');
      console.log(err);
    }
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

elements.searchResPages.addEventListener('click', e => {

  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.results, goToPage);

  }
});

/**
 * Recipe Controller
 */
const controlRecipe = async () => {
  const id = window.location.hash.replace('#','');
  if (id) {
    // cleanup UI
    recipeView.clearRecipe();

    // start loader
    renderLoader(elements.recipe);

    // create new recipe
    state.curRec = new Recipe(id);

    try {
      // get recipe data
      await state.curRec.getRecipe();
      state.curRec.calcTime();
      state.curRec.calcServings();
      state.curRec.parseIngredients();

      state.curRecRawData = state.curRec.rawData;
      console.log(state);
    } catch (err) {
      alert('Error requesting new Recipe');
      console.log(err);
    }

    // clear loader
    clearLoader(elements.recipe);

    // render recipe to UI
    recipeView.renderRecipe(state.curRec);
  }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));