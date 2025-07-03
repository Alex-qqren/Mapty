'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Wykład 247 (Zmienne globalne potrzebne do działania kodu)
let map, mapEvent;

// funkcje:
const clearForm = function () {
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';
};

///////////////////////////////////////////////// Wykład 244 - Using the Geolocation API, and
///////////////////////////////////////////////// Wykład 245 - Displaying a Map Using Leaflet Library

console.log('-------Wykład 244 - Using the Geolocation API and ->');
console.log('-------Wykład 245 - Displaying a Map Using Leaflet Library');

// Funkcje w tym wykładzie:
// navigator.geolocation.getCurrentPosition()

// fn przyjmuje dwa parametry:
// PIERWSZY: fn zwrotna która jest wywoływana gdy getCurrentPosition() odniesie SUKCES i prawidłowo ustali połozenie
// DRUGI : fn zwrotna która jest wywoływana gdy getCurrentPosition() zgłosi BŁĄD i nie ustali połozenia

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // console.log(position); // destrukuturyzujemy position.coords aby pozyskać potrzebne zmienne:
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      // console.log(latitude, longitude);
      // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      const coords = [latitude, longitude];

      //
      // Korzystamy z blibliotek leafletjs.com -> L. pochodzi z bliblitek leaflet -> (w tym projekcie skopwiowaliśmy sktypty do head w index.html - linijki 16 do 27)
      // więcej info na:
      // https://leafletjs.com/examples/quick-start/
      //

      //
      // gotowy kod z leaflet:
      /* 
        const map = L.map('map').setView(coords, 16);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
      */

      // Korzystamy z niego ponizej:
      map = L.map('map').setView(coords, 16); // jako pierwszy parametr dajemy nasze coords, (drugi parametr oznacza zoom)
      // console.log(map);

      // gotowy kod az do alert('Could not get you position'): - drugi arg fn navigator.geolocation.getCurrentPosition()
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // // tworzenie znacznika
      // L.marker(coords)
      //   .addTo(map)
      //   .bindPopup('A pretty CSS popup.<br> Easily customizable.')
      //   .openPopup();

      // wykład 246 - map.on() === taki eventListener() dla map zrobiony przez Leaflet - hanlder kliknięć na mapie
      map.on('click', function (mapE) {
        mapEvent = mapE; // nie potrzebujemy tutaj mapEvent więc zmieniamy jego nazwę

        // Wykład 247
        form.classList.remove('hidden');
        inputDistance.focus(); // automatyczny focus na pole które będzie uzupełniane jako pierwsze

        // // tworzenie znacznika
        // const { lat, lng } = mapEvent.latlng;
        // L.marker([lat, lng])
        //   .addTo(map)
        //   .bindPopup(
        //     L.popup({
        //       maxWidth: 250,
        //       minWidth: 100,
        //       autoClose: false,
        //       closeOnClick: false,
        //       className: 'running-popup',
        //     })
        //   )
        //   .setPopupContent('Workout')
        //   .openPopup();
      });
    },
    function () {
      alert('Could not get you position');
    }
  );

///////////////////////////////////////////////// Wykład 246 - Displaying a Map Marker
console.log('-------Wykład 246 - Displaying a Map Marker');

// zaczynamy od przyczepienia Event handlera aby uzyskać koordynaty z mapy, NIE mozemy jednak przyczepić go do div'a w którym się znajduje mapa, a więc...

// Musimy skorzystać z rozwiązania (metoda .on() )zapewnionego przez bibliotek od leaflet gdzie została określona zmienna map (linijka 37)

///////////////////////////////////////////////// Wykład 247 - Rendering Workout Input Form
console.log('-------Wykład 247 - Rendering Workout Input Form');

// Medody w tym wykładzie:
// focus() - wybiera zaznaczony element pod wipisaywanie treści
// typy eventListenera:
// 'submit'- nasłuchuje z typem wydarzenia submit (przy zatwirdzaniu przy pomocy przycisku lub klawisza "Enter")
// 'change' - nasłuchuje z typem wydarzenia change (przy wyborze option z formularza)

form.addEventListener('submit', function (event) {
  event.preventDefault();

  // Wyczyść pola formularza
  clearForm();

  // Wyświetl znacznik
  console.log(mapEvent);
  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('Workout')
    .openPopup();
});

// zmiana pola formularza w zalezności od opcji: running, lub cycling
inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});

///////////////////////////////////////////////// Wykład 248 - Project Architecture
console.log('-------Wykład 248 - Project Architecture');
// Teoria -> nie ma tego w wykładach... tylko wideo na Udemy ;(

///////////////////////////////////////////////// Wykład 249 -Refactoring for Project Architercture
console.log('-------Wykład 249 - Refactoring for Project Architercture');

// WYKŁAD w całym przerobionym do tej pory kodem, oraz dalsze wykłady W NOWYM PLIKU script-refactored.js !!!
