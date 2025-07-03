'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

///////////////////////////////////////////////// Wykład 249 -Refactoring for Project Architercture
console.log('-------Wykład 249 - Refactoring for Project Architercture');

///////////////////////////////////////////////// Wykład 250 - Creating a New Workout
console.log('-------Wykład 250 - Creating a New Workout');

///////////////////////////////////////////////// Wykład 251 - Rendering Workouts
console.log('-------Wykład 251 - Rendering Workouts');

// WYKŁAD w całym przerobionym do tej pory kodem, oraz dalsze wykłady W NOWYM PLIKU script-refactored.js !!!

// CLASSES

class Workout {
  date = new Date();
  // warto skrzystać z bilbiotek do tworzenia nowych id
  id = (Date.now() + '').slice(-10); // ostatnie 10 liczb

  constructor(coords, distance, duration) {
    this.coords = coords; // [latitude, longitude]
    this.distance = distance; // w km
    this.duration = duration; // w min
  }

  _setDescription() {
    // ponizej: sposób na zignorowanie automatycznego formatowania przez Prettier w następnej linijce
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()} `;
  }
}

class Running extends Workout {
  type = 'running'; // fields

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    // this.type = 'running' // to samo co linijka 34
    this.calcPace();
    this._setDescription(); // dajemy tutaj bo Running ma dotęp do workout.type!
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
    this._setDescription(); // dajemy tutaj bo Cycling ma dotęp do workout.type!
  }

  calcSpeed() {
    // km/h (aby miec h musimy podzielić duration przez 60!)
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycle1 = new Cycling([39, -12], 25, 95, 521);
// console.log(run1, cycle1);

//////////////////////////////////////////////////////
// APPLICATION ARCHITECTURE

class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this)); // ma wskazywać na instancję App (app)

    // zmiana pola formularza w zalezności od opcji: running, lub cycling
    inputType.addEventListener('change', this._toggleElevationField); // nie uzywa nigdzie this więc nie trzeba go maulanie przypisaywać do app przy pomocy bind()
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get you position');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 16);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus(); // automatyczny focus na pole które będzie uzupełniane jako pierwsze
  }

  _hideForm() {
    // Empty the inputs:
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // Hide the form
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(event) {
    const validInputs = (...inputs) =>
      inputs.every(input => Number.isFinite(input));

    const allPositive = (...inputs) => inputs.every(input => input > 0);

    event.preventDefault();
    // console.log(this); -> wskazuje na el do którego jest dołączony (form) -> linijka 29

    // get data from form:
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // if running, create running object:
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // check is data is valid:
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers!');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // if cycling, create cycling object:
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      // check is data is valid:
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers!');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // add the new object to the workout array:
    this.#workouts.push(workout);
    console.log(workout);

    // Render workout on map as marker:
    this._renderWorkoutMarker(workout);

    // Render workout on list:
    this._renderWorkout(workout);

    // Hide the form and clear input fields:
    this._hideForm();
  }

  _renderWorkoutMarker(workout) {
    // console.log(this.#mapEvent);
    // const { lat, lng } = this.#mapEvent.latlng; // mamy to w linijce 144 bo potrzebbowaliśmy tam zmienne lat i lang
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
        `;

    if (workout.type === 'running')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>`;

    if (workout.type === 'cycling')
      html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(2)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevation}</span>
        <span class="workout__unit">m</span>
      </div>
    </li>`;

    form.insertAdjacentHTML('afterend', html);
  }
}

const app = new App();
