import axios from 'axios';
import {herokuappProxy as proxy, apiKey as key } from '../config';

export default class Recipe {

    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
          const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
          console.log(res);
          if (res.data.error && res.data.error === "limit") {
            alert('Limit of API uses reached');
          } else {
            this.rawData = res.data.recipe;
            this.image = this.rawData.image_url;
            this.title = this.rawData.title;
            this.ingredients = this.rawData.ingredients;
            this.url = this.rawData.source_url;
            this.author = this.rawData.publisher;
          }
        } catch (error) {
          alert(error);
        }
    }

    calcTime() {
      // asumming 15 minutes for each 3 ingredients
      const numIng = this.ingredients.length;
      const periods = Math.ceil(numIng/3);
      this.time = periods * 15;
    }

    calcServings() {
      this.servings = 4;
    }

    parseIngredients() {
      const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
      const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
      const units = [...unitsShort,'kg','g','mg','l','dl','ml','cl'];

      const newIngredients = this.ingredients.map(el => {
        // uniform units
        let ingredient = el.toLowerCase();
        unitsLong.forEach((unit, i) => {
          ingredient = ingredient.replace(unit, units[i]);
        });

        // remove special chars
        ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

        // parse ingrediants into count, unit and ingredient
        const arrIng = ingredient.split(' ');
        const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

        let objIng;
        if (unitIndex > -1) {
          // this is a unit
          const arrCount = arrIng.slice(0, unitIndex);
          let count;
          
          if (arrCount.length === 1) {
            count = eval(arrIng[0].replace('-','+'));
          } else {
            // filter for non numbers
            const units = arrIng.slice(0, unitIndex).filter(el => {return !isNaN(parseFloat(el))});
            count = eval(units.join('+'));
          }

          objIng = {
            count,
            unit: arrIng[unitIndex],
            ingredient: arrIng.slice(unitIndex + 1).join(' ')
          }
        } else if (parseInt(arrIng[0],10)) {
          // this is a number
          objIng = {
            count: parseInt(arrIng[0],10),
            unit: '',
            ingredient: arrIng.slice(1).join(' ')
          }
        } else if (unitIndex === -1) {
          // not a unit and not a number
          objIng = {
            count: 1,
            unit: '',
            ingredient
          }
        } 

        return objIng;
      });
      this.ingredients = newIngredients;
    }

    updateServings(type) {
      
      //Servings
      const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

      // Ingredients
      this.ingredients.forEach(ing => {
        ing.count = ing.count * (newServings / this.servings);
      });

      this.servings = newServings;

    }
}