// export const add = (a,b) => a + b;
// export const multiply = (a,b) => a * b;
// export const ID = 23;

import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
    console.log('after clear ');
    console.log(elements.searchResPages);
};

const limitRecipeTile = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTile(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>    
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => {

    const numPages = type === 'prev' ? page - 1 : page + 1;
    const icon = type === 'prev' ? 'left' : 'right';

    return `
    <button class="btn-inline results__btn--${type}" data-goto=${numPages}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${icon}"></use>
        </svg>
        <span>Page ${numPages}</span>
    </button>
            `;
};

const renderPageButtons = (page, numResults, resPerPage)  => {
    const pages = Math.ceil(numResults / resPerPage);

    console.log(`my error page ${page} pages ${pages} `);
    console.log('before ');
    console.log(elements.searchResPages);
    let paginButton = '';
    if (page === 1 && pages > 1) {
        // only next button
        paginButton = createButton(page, 'next');
    } else if (page === pages && pages > 1) {
        // button back button
        paginButton = createButton(page, 'prev');
    } else if (page < pages) {
        // both buttons
        paginButton = `
            ${createButton(page, 'prev')} 
            ${createButton(page, 'next')}
        `;
    }
    console.log(`my error ${paginButton}`);
    elements.searchResPages.insertAdjacentHTML('afterbegin', paginButton);
};


export const renderResults = (recipes, page = 1, resPerPage = 5) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderPageButtons(page, recipes.length, resPerPage);

    console.log('after ');
    console.log(elements.searchResPages);
};

