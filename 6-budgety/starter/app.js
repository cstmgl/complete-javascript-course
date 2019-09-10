//budget controller
var budgetController = (function() {

    var Income = function (id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
    var Expense = function (id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };
  
    var idIncome = 0;
    var idExpense = 0;
  
    var calculateTotal = function (type) {
      var sum = 0;
      data.allItems[type].forEach(function(cur) {
        sum = sum + cur.value;
      });
      data.totals[type] = sum;
    }
  
    var data = {
      allItems: {
        exp: [],
        inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      }, 
      budget: 0,
      percentage: -1
    };
  
    return {
      addItem: function(type, des, val) {
        var newItem = {};
  
        if (type === 'inc') {
          idIncome = idIncome + 1;
          newItem = new Income(idIncome, des, val);
        } else if (type === 'exp') {
          idExpense = idExpense + 1;
          newItem = new Expense(idExpense, des,val);
        }
  
        data.allItems[type].push(newItem);
        return newItem;
      },
  
      delItem: function(type, id) {
        var ids = data.allItems[type].map(function(current){
          return current.id;
        });
  
        var index = ids.indexOf(id);
  
        if (index !== -1) {
          data.allItems[type].splice(index, 1);
        }
      },
  
      calculateBudget: function() {
        calculateTotal('exp');
        calculateTotal('inc');
  
        data.budget = data.totals.inc - data.totals.exp;
  
        if (data.totals.inc > 0) {
          data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
          data.percentage = -1;
        }
      },
  
      getBudget: function() {
        return {
          budget: data.budget,
          totalIncome: data.totals.inc,
          totalExpenses: data.totals.exp,
          percentage: data.percentage
        }
      }
    }
  
  })();
  
  //ui module
  var uiController = (function() {
  
    const DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      expensesPercLabel: '.budget__expenses--percentage',
      budgetContainer: '.container'
    };
  
    return {
      getInput: function() {
        return {
          type: document.querySelector(DOMstrings.inputType).value, //inc or exp
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
        }
      },
  
      addListItem: function(item, type) {
        var html, newHtml, element;
  
        // Create HTML string with placeholder text
        if (type === 'inc') {
          element = DOMstrings.incomeContainer;
          html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
        } else if (type === 'exp') {
          element = DOMstrings.expensesContainer;
          html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">- %value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
        }
  
        // Replace the placeholder text with the data from item
        newHtml = html.replace('%id%', item.id);
        newHtml = newHtml.replace('%description%', item.description);
        newHtml = newHtml.replace('%value%', item.value);
  
        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
  
      },
  
      delListItem: function(itemId) {
        var el = document.getElementById(itemId);
        el.parentNode.removeChild(el);
      },
  
      clearInputs: function(){
        var fields = document.querySelectorAll(DOMstrings.inputDescription + ', '+ DOMstrings.inputValue);
  
        var fieldsArray = Array.prototype.slice.call(fields);
  
        fieldsArray.forEach(function(current, index, array) {
          current.value = "";
        });
  
        fieldsArray[0].focus();
      },
  
      displayBudget: function(budgetTotals) {
        document.querySelector(DOMstrings.budgetLabel).textContent = budgetTotals.budget;
        document.querySelector(DOMstrings.incomeLabel).textContent = budgetTotals.totalIncome;
        document.querySelector(DOMstrings.expensesLabel).textContent = budgetTotals.totalExpenses;
        if (budgetTotals.percentage > 0) {
          document.querySelector(DOMstrings.expensesPercLabel).textContent = budgetTotals.percentage + ' %';
        } else {
          document.querySelector(DOMstrings.expensesPercLabel).textContent = '---';
        }
      },
  
      getDOMstrings: function() {
        return DOMstrings;
      }
    };
  
  })();
  
  //application controller
  var appController = (function(budgetCtrl, uiCtrl) {
  
    var setupEventListeners = function () {
      var DOM = uiCtrl.getDOMstrings();
  
      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
  
      document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          ctrlAddItem();
        }
      });
  
      document.querySelector(DOM.budgetContainer).addEventListener('click', ctrlDelItem);
    }
  
    var updateBudget = function() {
      // calculate budget
      budgetCtrl.calculateBudget();
  
      // return the budget
      var budget = budgetCtrl.getBudget();
  
      // display the budget on the UI
      uiCtrl.displayBudget(budget);
  
    }
  
    var ctrlAddItem = function() {
      var input = uiCtrl.getInput();
  
      if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
  
        uiCtrl.addListItem(newItem, input.type);
    
        uiCtrl.clearInputs();
    
        updateBudget();
      }
    }
  
    var ctrlDelItem = function(event) {
      var itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
  
      if (itemId) {
        var splitItem;
        splitItem = itemId.split('-');
        budgetCtrl.delItem(splitItem[0],parseInt(splitItem[1]));
  
        uiCtrl.delListItem(itemId);
  
        updateBudget();
  
      }
    }
  
    return {
      init: function() {
        console.log('starting application.');
        setupEventListeners();
        updateBudget();
      }
    }
  
  })(budgetController, uiController);
  
  appController.init();
  
  
  