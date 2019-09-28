export default class FavouriteList {
    constructor() {
        this.likes = [];
    }

    // I'll just use the recipe object
    addLike(recipe) {
        this.likes.push(recipe);
        return recipe;
    }

    removeLike (id) {
        const index = this.likes.findIndex( el => el.id === id);
        return this.likes.splice(index, 1); 
    }

    isLiked (id) {
        return this.likes.findIndex( el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }
}
