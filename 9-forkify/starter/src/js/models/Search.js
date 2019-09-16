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
          this.results = res.data.recipes;
        } catch (error) {
          alert(error);
        }
    }
}
