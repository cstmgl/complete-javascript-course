import Search from './models/Search';
import Recipe from './models/Recipe';
import IngredientList from './models/IngredientList';
import FavouriteList from './models/FavouriteList';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as ingredientListView from './views/ingredientListView';
import * as favouriteListView from './views/favouriteListView';
import { elements, renderLoader, clearLoader } from './views/base';

// global state of the application
// - search object
// - current recipe object
// - shopping list object
// - liked recipes
const state = {};
window.state = state; //for testing

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

    // highlight selected search
    if (state.search) {
      searchView.highlightSelected(id);
    }

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
    recipeView.renderRecipe(
      state.curRec, 
      (state.likes ? state.likes.isLiked(id) : false)
    );
  }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

/**
 * List Controller
 */
const controlList = () => {
  if (!state.ingredientList) {
    state.ingredientList = new IngredientList();
  }
  
  // add each ingredient to the list and user interface
  state.curRec.ingredients.forEach(el => {
    const item = state.ingredientList.addItem(el.count, el.unit, el.ingredient);
    ingredientListView.renderItem(item);
  });
}

elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  // delete items from list
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // delete from state
    state.ingredientList.deleteItem(id);

    // delete from UI
    ingredientListView.deleteItem(id);

  // manage the shopping count
  } else if (e.target.matches('.shopping__count--value, .shopping__count--value *')) {
    const val = parseFloat(e.target.value, 10);
    state.ingredientList.updateCount(id, val);
  }
});


/**
 * Like Controller
 */
const updateLikes = () => {
  if(!state.likes) {
    state.likes = new FavouriteList();
  }

  // user has not liked?
  if (!state.likes.isLiked(state.curRec.id)) {
    // add to list
    state.likes.addLike(state.curRec);
    favouriteListView.renderLike(state.curRec);

    // change icon
    favouriteListView.toggleLikeBtn(true);

  } 
  else {
    // remove from list
    state.likes.removeLike(state.curRec.id);
    favouriteListView.deleteLike(state.curRec.id);

    // change icon
    favouriteListView.toggleLikeBtn(false);
  }

  favouriteListView.toggleLikeMenu(state.likes.getNumLikes());
}


// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  // manage the servings
  if (e.target.matches('.btn-dec, .btn-dec *')) {
    // Decrease button is clicked
    if (state.curRec.servings > 1)  {
      state.curRec.updateServings('dec');
      recipeView.udpdateServingsIngredients(state.curRec);
    }
  } else if (e.target.matches('.btn-inc, .btn-inc *')) {
    // Increase button is clicked
    state.curRec.updateServings('inc');
    recipeView.udpdateServingsIngredients(state.curRec);
  }
  
  // add ingredients to the list
  else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } 
  // manage the likes/favourites
  else if (e.target.matches('.recipe__love, .recipe__love *')){
    updateLikes();
  }
});

