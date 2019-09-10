//function constructor

class Person {
    constructor(name, yearOfBirth, job) {
        this.name = name;
        this.yearOfBirth = yearOfBirth;
        this.job = job;
    }
}

Person.prototype.calculateAge = function() {
    const today = new Date();
    const thisYear = today.getFullYear();
    console.log(thisYear - this.yearOfBirth);
}

var john = new Person ('John', 1990, 'teacher');
//john.calculateAge();

var jane = new Person ('Jane', 1969, 'designer');

var mark = new Person ('Mark', 1948, 'retired');


var personProto = {
    calculateAge: function() {
        console.log(2016 - this.yearOfBirth);
    }
};

var newJohn = Object.create(personProto);
newJohn.name = 'john';
newJohn.yearOfBirth = 1990;
newJohn.job = 'teacher';


// Functions returning functions

function interviewQuestion(job) {
    if (job === 'designer') {
        return function(name) {
            console.log(name + ', can you please explain what UX design is?');
        }
    } else if (job === 'teacher') {
        return function(name) {
            console.log('What subject do you teach, ' + name + "?");
        }
    } else {
        return function(name) {
            console.log('Hello ' + name + ", what do you do?");
        }
    }
}

var teacherQuestion = interviewQuestion('teacher');
teacherQuestion('John');

var designerQuestion = interviewQuestion('designer');
designerQuestion('John');

interviewQuestion('teacher')('Mark');


// IIFE

/*
function game() {
    var score = Math.random() * 10;
    console.log(score >= 5);
}
game();*/

(function () {
    var score = Math.random() * 10;
    console.log(score >= 5);
})();

(function (goodLuck) {
    var score = Math.random() * 10;
    console.log(score >= 5 - goodLuck);
})(5);




//closures
function retirement(retirementAge) {
    var a = ' years left until retirement.';
    return function(yearOfBirth) {
        var age = 2019 - yearOfBirth;
        console.log((retirementAge - age) + a);
    }
}

retirement(66)(1990);

var retirementGermany = retirement(65);
var retirementUS = retirement(66);
var retirementIceland = retirement(67);

retirementGermany(1990);
retirementUS(1990);
retirementIceland(1990);

function interviewQuestion(job) {
    return function(name) {
        if (job === 'designer') {
            console.log(name + ', can you please explain what UX design is?');
        } else if (job === 'teacher') {
            console.log('What subject do you teach, ' + name + "?");
        }
        else {
            console.log('Hello ' + name + ", what do you do?");
        }
    }
}

interviewQuestion('teacher')('John');


// Bind, call and apply

var john = {
    name: 'John',
    age: 26,
    job: 'teacher',
    presentation: function(style, timeOfDay) {
        if (style === 'formal') {
            console.log('Good '+ timeOfDay 
            + ', Ladies and gentement! I\'m '
            + this.name + ', I\'m a ' + this.job + ' and I\'m '
            + this.age + ' years old.');
        } else if (style === 'friendly') {
            console.log('Hey! What\'s up? '+ 'I\'m '
            + this.name + ', I\'m a ' + this.job + ' and I\'m '
            + this.age + ' years old. Have a nice ' + timeOfDay + '.'
            );
        }
    }
}

var emily = {
    name: 'Emily',
    age: 35,
    job: 'designer'
}

john.presentation('formal','morning');

john.presentation.call(emily,'friendly','afternoon');

var johnFriendly = john.presentation.bind(john, 'friendly');

johnFriendly('morning');
johnFriendly('night');

var emilyFormal = john.presentation.bind(emily, 'formal');
emilyFormal('afternoon');


// challenge
class Question {
    constructor(question, answers, correct) {
        this.question = question;
        this.answers = answers;
        this.correct = correct;
    }
}

Question.prototype.displayQuestion = function() {
    console.log(this.question);

    for (var i =0; i < this.answers.length; i++) {
        console.log(i + ': ' + this.answers[i]);
    }
}

Question.prototype.correctAnswer = function(answer, keepScore) {
    var answer = this.correct == parseInt(answer);
    keepScore(answer);
    console.log(answer ? 'You are correct.' : 'You are wrong!');
    this.displayScore(keepScore);
}

Question.prototype.displayScore = function(keepScore) {
    console.log('Your score is : ' + keepScore());
}

var q1 = new Question('Is JavaScript the coolest programming language in the world?', ['Yes','No'], 0);
var q2 = new Question('What is the name of this course\'s teacher?', ['John','Micheal', 'Jonas'], 2);
var q3 = new Question('What does best describe coding?', ['Boring','Hard', 'Fun', 'Tediuos'], 2);

var questions =[q1,q2,q3];

function score() {
    var sc = 0;
    return function(correct) {
        if (correct) {
            sc++;
        }
        return sc;
    }
}

var keepScore = score();

function nextQuestion() {

    var randomQuestion = Math.floor(Math.random() * questions.length);
    
    questions[randomQuestion].displayQuestion();
    
    var answer = prompt('Please select the correct answer.');
    if (answer !== 'exit') {
        questions[randomQuestion].correctAnswer(answer, keepScore);
        nextQuestion();
    } 
}

nextQuestion();