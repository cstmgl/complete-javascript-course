//export default 'I am an exported string.';

import axios from 'axios';

import {herokuappProxy as proxy, apiKey as key } from '../config';

export default class Search {

    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
          const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
console.log(res);
          if (res.data.error && res.data.error === "limit") {
            alert('Limit of API uses reached');
          } else {
            this.results = res.data.recipes;
          }
        } catch (error) {
          alert(error);
        }
    }
}
