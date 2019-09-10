/*class SmithPerson {
    constructor(first, yearOfBirth, last, nationality) {
        last ? last = last : last = 'Smith';
        nationality ? nationality = nationality : nationality = 'american';
        this.first = first;
        this.yearOfBirth = yearOfBirth;
        this.last = last;
        this.nationality = nationality;
    }
}


class DiazPerson {
    constructor(first, yearOfBirth, last = 'Diaz', nationality = 'spanish') {
        this.first = first;
        this.yearOfBirth = yearOfBirth;
        this.last = last;
        this.nationality = nationality;
    }
}

var john = new SmithPerson('John', 1990);
var emily = new SmithPerson('Emily', 1983, 'Diaz', 'spanish');


var john2 = new DiazPerson('John', 1990);
var emily2 = new DiazPerson('Emily', 1983, 'Smith', 'amercian');
*/

/*
//ES6
class Person6 {
    constructor (name, yearOfBirth, job) {
        this.name = name;
        this.yearOfBirth = yearOfBirth;
        this.job = job;
    }

    calculateAge() {
        var age = new Date().getFullYear() - this.yearOfBirth;
        console.log(age);
    }
}

class Athlete6 extends Person6 {
    constructor(name, yearOfBirth, job, olympicGames, medals) {
        super(name, yearOfBirth, job);
        this.olympicGames = olympicGames;
        this.medals = medals;
    }
    
    wonMedal() {
        this.medals++;
        console.log(this.medals);
    }
}

const johnAthlete6 = new Athlete6('John', 1990, 'swimmer', 3, 10);

johnAthlete6.wonMedal();
johnAthlete6.calculateAge();
*/

function calc(arr) {
    const sum = arr.reduce((prev, cur, index) => prev + cur, 0);

    return [sum, sum/arr.length] ;
}

/**
 * 1. Parks
 * 2. Streets
 * 
 * 3 parks and 4 streets
 * Parks and streets have name, build year
 * 
 * 1. Tree density of each part in the town
 * (number of trees/park area)
 * 2. Average age of each town's park 
 * (all ages / number of parks)
 * 3. The name of the park that has more than 1000 trees
 * 4. Total and average lenght of the towns street
 * 5. Size classification of all streets:
 * (tiny, small, normal, big, huge, normal is the default)
 * 
 * print report to output 
*/

class Item {
    constructor(name, buildYear) {
        this.name = name;
        this.buildYear = buildYear;
    }
    calculateAge() {
        const now = new Date();
        return this.buildYear > now.getFullYear() ? -1 : now.getFullYear() - this.buildYear;
    }
}

class Park extends Item{
    constructor(name, buildYear, area, trees) {
        super(name, buildYear);
        this.area = area; // km2
        this.trees = trees;
    }
    treeDensity() {
        const density = this.trees / this.area;
        console.log(`${this.name} has a tree density of ${density} trees per square km.`);
        //return density;
    }
}

class Street extends Item{

    static SIZES = {
        TINY: 1,
        SMALL: 2,
        NORMAL: 3,
        BIG: 4,
        HUGE: 5
    }

    constructor(name, buildYear, length, size = SIZES.NORMAL) {
        super(name, buildYear);
        this.length = length;
        this.size = size;
    }

    classifyStreet () {
        const classifications = new Map();
        classifications.set(1, 'Tiny');
        classifications.set(2, 'Small');
        classifications.set(3, 'Normal');
        classifications.set(4, 'Big');
        classifications.set(5, 'Huge');
        console.log(`${this.name}, built in ${this.buildYear} is a ${classifications.get(this.size)} size street`);
    }
}

class City {
    constructor (...items) {
        this.parks = [];
        this.streets = [];
        items.forEach(cur => cur instanceof Park ? this.parks.push(cur) : cur instanceof Street ? this.streets.push(cur) : undefined);
    }

    addPark(name, buildYear, area, trees){
        this.parks.push(new Park(name, buildYear, area, trees));
    }

    addStreet(name, buildYear, length, size){
        this.streets.push(new Street(name, buildYear, length, size ? size : Street.SIZES.NORMAL));
    }

    reportParks() {
        console.log('--- PARKS REPORT ---');
        this.parks.forEach(el => el.treeDensity());
        const ages = this.parks.map(el => el.calculateAge());
        const [totalAge, avgAge] = calc(ages);
        console.log(`Our ${this.parks.length} parks have an average of ${avgAge} years.`);
        const index = this.parks.map(el => el.trees).findIndex(el => el >= 1000);
        console.log(`${this.parks[index].name} has more than 1000 trees.`);
    }

    reportStreets() {
        console.log('--- STREETS REPORT ---');
        const [totalLength, avgLenght] = calc(this.streets.map(el => el.length));
        console.log(`Our ${this.streets.length} streets have a total lenght of ${totalLength} km, with an average of ${avgLenght} km.`);
        this.streets.forEach(el => el.classifyStreet());
    }    
}

const myCity = new City();

myCity.addPark('Green Park', 1987, 0.2, 215);
myCity.addPark('National Park', 1984, 2.9, 3541);
myCity.addPark('Oak Park', 1953, 0.4, 949);

myCity.addStreet('Ocean Avenue', 1999, 1.1, Street.SIZES.BIG);
myCity.addStreet('Evergreen Street', 2008, 2.7, Street.SIZES.SMALL);
myCity.addStreet('4th Street', 2015, 0.8);
myCity.addStreet('Sunset Boulevard', 1982, 2.5, Street.SIZES.HUGE);

/*

function reportParks(p) {
    console.log('--- PARKS REPORT ---');
    p.forEach(el => el.treeDensity());

    const ages = p.map(el => el.calculateAge());
    const [totalAge, avgAge] = calc(ages);

    console.log(`Our ${p.length} parks have an average of ${avgAge} years.`);

    const index = p.map(el => el.trees).findIndex(el => el >= 1000);
    
    console.log(`${p[index].name} has more than 1000 trees.`);

}

function reportStreets(s) {
    console.log('--- STREETS REPORT ---');

    const [totalLength, avgLenght] = calc(s.map(el => el.length));
    console.log(`Our ${s.length} streets have a total lenght of ${totalLength} km, with an average of ${avgLenght} km.`);

    s.forEach(el => el.classifyStreet());
}

reportParks(myCity.parks); 
reportStreets(myCity.streets);
*/
myCity.reportParks();
myCity.reportStreets();