import axios from 'axios';
import {herokuappProxy as proxy, apiKey as key } from '../config';

export default class recipe {

    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
          const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
          this.recipe = res.data.recipe;
        } catch (error) {
          alert(error);
        }
    }

    calcTime() {
      // asumming 15 minutes for each 3 ingredients
      const numIng = this.recipe.ingredients.length;
      const periods = Math.ceil(numIng/3);
      this.time = periods * 15;
    }

    calcServings() {
      this.servings = 4;
    }
}