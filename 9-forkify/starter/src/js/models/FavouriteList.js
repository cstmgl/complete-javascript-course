export default class FavouriteList {
    constructor() {
        this.likes = [];
        this.getPersistData();
    }

    // I'll just use the recipe object
    addLike(recipe) {
        this.likes.push(recipe);

        // persist the data in local storage
        this.persistData();

        return recipe;
    }

    removeLike (id) {
        const index = this.likes.findIndex( el => el.id === id);
        const item = this.likes.splice(index, 1); 

        // persist the data in local storage
        this.persistData();

        return item;
    }

    isLiked (id) {
        return this.likes.findIndex( el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    getPersistData() {
        const likes = JSON.parse(localStorage.getItem('likes'));
        // if there was data in the local storage store it in the likes
        if (likes) {
            this.likes = likes;
        }
    }
}
