class CalorieTracker{
    constructor(){
        //Storage is a static method and we can call it on a class
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories(0);
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();

        document.getElementById('limit').value = this._calorieLimit;
    }


    // Public Methods/API

    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);
        this._render();
        
    }

    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveWorkout(workout);
        this._displayNewWorkout(workout);
        this._render();
    }

    removeMeal(id){
    //we are looping the meals array and finding the index meal where the meal.id is equal to the id
    // If there is no match it will negative one
        const index = this._meals.findIndex((meal) => meal.id === id);

        if(index !== -1){
            const meal = this._meals[index];
            this._totalCalories -= meal.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._meals.splice(index,1);
            Storage.removeMeal(id);
            this._render();

        }
    }

    removeWorkout(id){
        //we are looping the workouts array and finding the index meal where the workout.id is equal to the id
        // If there is no match it will negative one
            const index = this._workouts.findIndex((workout) => workout.id === id);
    
            if(index !== -1){
                const workout = this._workouts[index];
                this._totalCalories += workout.calories;
                Storage.updateTotalCalories(this._totalCalories);
                this._workouts.splice(index,1);
                Storage.removeWorkout(id);
                this._render();
    
            }
        }

    reset(){
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        Storage.clearAll();
        this._render();
    }

    setLimit(calorieLimit){
        this._calorieLimit = calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this._displayCaloriesLimit();
        this._render();
    }

    //We want to display the actual items to be visible in the page
    loadItems(){
        this._meals.forEach((meal) => this._displayNewMeal(meal));
        this._workouts.forEach((workout) => this._displayNewWorkout(workout));
    }

    

    // Private methods

    _displayCaloriesTotal() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
    }

    _displayCaloriesLimit() {
        const calorieLimitEl = document.getElementById('calories-limit');
        calorieLimitEl.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');

        const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0);

        caloriesConsumedEl.innerHTML = consumed;
        
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');

        const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);

        caloriesBurnedEl.innerHTML = burned;
        
    }

    _displayCaloriesRemaining(){
        const caloriesRemainingEl = document.getElementById('calories-remaining');
        const progressEl = document.getElementById('calorie-progress');

        const remaining = this._calorieLimit - this._totalCalories;

        caloriesRemainingEl.innerHTML = remaining;

       //In case we get to minus with calorieLimit

        if(remaining <= 0){
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
            

            progressEl.classList.remove('bg-success');
            progressEl.classList.add('bg-danger');


        }  else {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');

            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');


        }
    }

    _displayCaloriesProgress(){
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage, 100);
        progressEl.style.width = `${width}%`;
    }

    _displayNewMeal(meal){
        const mealsEl = document.getElementById('meal-items');
        const divMealEl = document.createElement('div');
        divMealEl.classList.add('card','my-2');
        divMealEl.setAttribute('data-id',meal.id);
        divMealEl.innerHTML = `
        <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${meal.name}</h4>
            <div
                class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
            </div>
            <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    </div>`;

    //We are adding it to the DOM
    mealsEl.appendChild(divMealEl);
    }

    _displayNewWorkout(workout){
        const workoutsEl = document.getElementById('workout-items');
        const divWorkoutEl = document.createElement('div');
        divWorkoutEl.classList.add('card','my-2');
        divWorkoutEl.setAttribute('data-id',workout.id);
        divWorkoutEl.innerHTML = `
    <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${workout.name}</h4>
            <div
                class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
            </div>
            <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    </div>`;

    workoutsEl.appendChild(divWorkoutEl);
    }

    _render(){
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
    
}

// When we call addMeal or addWorkout object we are gonna pass Meal or workout object
class Meal{
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout{
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

// We want to initialized a class in order to tracker inherit the properties
/* const tracker = new CalorieTracker();

const breakfast = new Meal('Breakfast',400);
tracker.addMeal(breakfast);
const lunch = new Meal('Lunch', 350);
tracker.addMeal(lunch);


const swim = new Workout('Morning swim',320);
tracker.addWorkout(swim);

console.log(tracker._meals);
console.log(tracker._workouts);
console.log(tracker._totalCalories);
 */

class Storage{
    static getCalorieLimit(defaultLimit = 2000){
        let calorieLimit;
        if(localStorage.getItem('calorieLimit') === null){
            calorieLimit = defaultLimit;
        } else {
            calorieLimit = +localStorage.getItem('calorieLimit');
        }
        return calorieLimit;
    }

    static setCalorieLimit(calorie){
        localStorage.setItem('calorieLimit',calorie);
    }

    static getTotalCalories(defaultCalories = 0){
        let totalCalories;
        if(localStorage.getItem('totalCalories') === null){
            totalCalories = defaultCalories;
        } else {
            totalCalories = +localStorage.getItem('totalCalories');
        }
        return totalCalories;
    }

    //when we add a meal or workout that's gonna modified the total calories
    static updateTotalCalories(calories){
        localStorage.getItem('totalCalories', calories);
    }


    static getMeals(){
        let meals;
        if(localStorage.getItem('meals') === null){
        //if it is not in local storage meals variable is gonna hold an empty array
            meals = [];
        } else {
            //we want to parse it to an array
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }

    //Method to save the meals in the local storage
    static saveMeal(meal){
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals',JSON.stringify(meals));
    }


    static removeMeal(id){
        const meals = Storage.getMeals();
        const updateMeals = meals.filter((meal) => meal.id !== id);
        localStorage.setItem('meals',JSON.stringify(updateMeals));
    }

    static getWorkouts(){
        let workouts;
        if(localStorage.getItem('workouts') === null){
            workouts = [];
        } else {
            // we are parsing it into an array
            workouts = JSON.parse(localStorage.getItem('workouts'))
        }
        return workouts;
    }

    static saveWorkout(workout){
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts',JSON.stringify(workouts));
    }

    static removeWorkout(id){
        const workouts = Storage.getWorkouts();
        const updateWorkouts = workouts.filter((workout) => workout.id !== id)
        localStorage.setItem('workouts',JSON.stringify(updateWorkouts));
    }

    static clearAll(){
        localStorage.removeItem('totalCalories');
        localStorage.removeItem('meals');
        localStorage.removeItem('workouts');

        //If you want to cleat the limit
        //localStorage.clear();


    }
}

class App{
    constructor(){
        // We are instantiating a new calorie tracker object
        this._tracker = new CalorieTracker();
        this._loadEventListeners();
        this._tracker.loadItems();
        
    
    }

    _loadEventListeners(){
        document.getElementById('meal-form').addEventListener('submit',this._newMeal.bind(this));
        document.getElementById('workout-form').addEventListener('submit',this._newWorkout.bind(this));

        document.getElementById('meal-items').addEventListener('click',this._removeItem.bind(this,'meal'));
        document.getElementById('workout-items').addEventListener('click',this._removeItem.bind(this,'workout'));

        document.getElementById('filter-meals').addEventListener('keyup',this._filterItems.bind(this,'meal'));
        document.getElementById('filter-workouts').addEventListener('keyup',this._filterItems.bind(this,'workout'));

        document.getElementById('reset').addEventListener('click',this._reset.bind(this));

        document.getElementById('limit-form').addEventListener('submit',this._setLimit.bind(this));

       

    }

    _newMeal(e){
        e.preventDefault();

        //Code validation

        const name = document.getElementById('meal-name');
        const calories = document.getElementById('meal-calories');

        if(name.value === '' || calories.value === ''){
            alert('Please insert all the fields');
            return;
        }

        const meal = new Meal(name.value,+calories.value);

        this._tracker.addMeal(meal);

        name.value = '';
        calories.value = '';

        const collapseMeal = document.getElementById('collapse-meal');
        const bsCollapse = new bootstrap.Collapse(collapseMeal,{
            toggle: true
        });
    }

    _newWorkout(e){
        e.preventDefault();

        const name = document.getElementById('workout-name');
        const calories = document.getElementById('workout-calories');

        if(name.value === '' || calories.value === ''){
            alert('Please add a workout');
            return;
        }

        const workout = new Workout(name.value,+calories.value);

        this._tracker.addWorkout(workout);

        name.value = '';
        calories.value = '';

        const collapseWorkout = document.getElementById('collapse-workout');
        const bsCollapse = new bootstrap.Collapse(collapseWorkout,{
            toggle:true
        });

    }

    _removeItem(type, e){
        if(e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')){
            if(confirm('Are you sure')){

                const id = e.target.closest('.card').getAttribute('data-id');

                if(type === 'meal'){
                    this._tracker.removeMeal(id);
                } else {
                    this._tracker.removeWorkout(id);
                }

                e.target.closest('.card').remove();
            }
        }
    }

    _filterItems(type,e){
    //we want to first get the text from the input
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
        const name = item.firstElementChild.firstElementChild.textContent;

        if(name.toLowerCase().indexOf(text) !== -1){
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    })
    }
    
    _reset(){
        this._tracker.reset();
        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('filter-meals').value = '';
        document.getElementById('filter-workouts').value = '';


    }

    _setLimit(e){
        e.preventDefault();

        const limit = document.getElementById('limit');

        if(limit.value === ''){
            alert('Please add a limit');
            return;
        }

        this._tracker.setLimit(+limit.value);
        limit.value = '';

        const modalEl = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    }
}

const app = new App();