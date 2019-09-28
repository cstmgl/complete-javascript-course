import { elements } from './base';
import { Fraction } from 'fractional';

export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};

const formatCount = count => {
    if (count) {
        // 2.75
        const [int, dec] = count.toString().split('.').map(el => parseInt(el,10));
        if (!dec) {
            return count;
        } else if (int == 0) {
            const fr = new Fraction(count);
            return `${fr.numerator}/${fr.denominator}`;
        } else {
            const fr = new Fraction(count - int);
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }
    }
    else {
        return count;
    }
}

const renderRecipeImage = recipe => {
    const markup = `
    <figure class="recipe__fig">
    <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img">
    <h1 class="recipe__title">
        <span>${recipe.title}</span>
    </h1>
    </figure>
        `;
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

const renderRecipeDetails = recipe => {
    const markup = `
    <div class="recipe__details">
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
        <span class="recipe__info-text"> minutes</span>
    </div>
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-man"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text"> servings</span>
    
        <div class="recipe__info-buttons">
            <button class="btn-tiny btn-dec">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-minus"></use>
                </svg>
            </button>
            <button class="btn-tiny btn-inc">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-plus"></use>
                </svg>
            </button>
        </div>
    
    </div>
    <button class="recipe__love">
        <svg class="header__likes">
            <use href="img/icons.svg#icon-heart-outlined"></use>
        </svg>
    </button>
    </div>
        `;
    elements.recipe.insertAdjacentHTML('beforeend', markup);
};

const renderRecipeIngredient = item => {
    const markup = `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(item.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${item.unit}</span>
            ${item.ingredient}
        </div>
    </li>
        `;
    return markup;
};

const renderRecipeIngredients = recipe => {
    const markup = `
    <div class="recipe__ingredients">
    <ul class="recipe__ingredient-list">
        ${recipe.ingredients.map(el => renderRecipeIngredient(el)).join('')}
    </ul>

    <button class="btn-small recipe__btn">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-shopping-cart"></use>
        </svg>
        <span>Add to shopping list</span>
    </button>
    </div>
        `;
    elements.recipe.insertAdjacentHTML('beforeend', markup);
};

const renderRecipeInstructions = recipe => {
    const markup = `
    <div class="recipe__directions">
    <h2 class="heading-2">How to cook it</h2>
    <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
    </p>
    <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
    </a>
    </div>
        `;
    elements.recipe.insertAdjacentHTML('beforeend', markup);
};

export const renderRecipe = recipe => {
    // render the image
    renderRecipeImage(recipe);
    // render the details
    renderRecipeDetails(recipe);
    // render the ingredients
    renderRecipeIngredients(recipe);
    // render the instructions
    renderRecipeInstructions(recipe);
}

export const udpdateServingsIngredients = recipe => {
    // Update servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;
    
    // Update Ingredients
    const countElements = Array.from(document.querySelectorAll('.recipe__count'));
    countElements.forEach((el, i) => {
        el.textContent = formatCount(recipe.ingredients[i].count);
    });
}
