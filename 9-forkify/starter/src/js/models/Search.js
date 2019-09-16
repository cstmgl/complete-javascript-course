//export default 'I am an exported string.';

import axios from 'axios';

export default class Search {

    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const herokuappProxy = 'https://cors-anywhere.herokuapp.com/';
        const apiKey = '14377cc1984efd0e7fa70ebf931184e7';
        
        try {
          const res = await axios(`${herokuappProxy}https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`);
          this.results = res.data.recipes;
//          console.log(this.results);
        } catch (error) {
          alert(error);
        }
    }
}
