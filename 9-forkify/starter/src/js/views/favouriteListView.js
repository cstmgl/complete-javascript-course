import { elements } from './base';
import { limitRecipeTile } from './searchView'

export const clearList = () => {
    elements.likesList.innerHTML = '';
};

export const renderLike = item => {
    const markup = `
        <li>
            <a class="likes__link" href="#${item.id}">
                <figure class="likes__fig">
                    <img src="${item.image}" alt="${item.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTile(item.title)}</h4>
                    <p class="likes__author">${item.author}</p>
                </div>
            </a>
        </li>    
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const item = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if (item) {
        item.parentElement.removeChild(item);
    }
};

export const toggleLikeBtn = isLiked => {
    const icon = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href',`img/icons.svg#${icon}`);
}

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}