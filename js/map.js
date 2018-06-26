'use strict';

var MAX_LOCATIONS = 8;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MAX = 5;
var GUESTS_MAX = 5;
var MAP_MIN_COORDS_X = 300;
var MAP_MAX_COORDS_X = 900;
var MAP_MIN_COORDS_Y = 150;
var MAP_MAX_COORDS_Y = 500;
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var allTypes = ['palace', 'flat', 'house', 'bungalo'];
var checkTimes = ['12:00', '13:00', '14:00'];
var allFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var nearbyLocations = [];

var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var getRndTitle = function (arr) {
  var i = getRandomInteger(0, arr.length - 1);
  var choosenElement = arr[i];
  arr.splice(i, 1);
  return choosenElement;
};

var shuffleArray = function (arr) {
  var j;
  var x;
  var i;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
};

var getRndElement = function (arr) {
  return arr[getRandomInteger(0, arr.length - 1)];
};

var getRndArrElm = function (arr) {
  var tempArr = [];
  var startPos = getRandomInteger(0, arr.length - 1);
  var j = 0;
  for (var i = startPos; i < arr.length; i++) {
    tempArr[j] = arr[i];
    j++;
  }
  return tempArr;
};

var generateObject = function (i) {
  var locationData = {
    'author': {
      'avatar': 'img/avatars/user0' + i + '.png'
    },

    'offer': {
      'title': getRndTitle(titles),
      'address': '',
      'price': getRandomInteger(PRICE_MIN, PRICE_MAX),
      'type': getRndElement(allTypes),
      'rooms': getRandomInteger(1, ROOMS_MAX),
      'guests': getRandomInteger(1, GUESTS_MAX),
      'checkin': getRndElement(checkTimes),
      'checkout': getRndElement(checkTimes),
      'features': getRndArrElm(allFeatures),
      'description': '',
      'photos': shuffleArray(photos)
    },

    'location': {
      'x': getRandomInteger(MAP_MIN_COORDS_X, MAP_MAX_COORDS_X),
      'y': getRandomInteger(MAP_MIN_COORDS_Y, MAP_MAX_COORDS_Y)
    }
  };

  locationData.offer.address = '"' + locationData.location.x + ', ' + locationData.location.y + '"';
  return locationData;
};

var getNerbyLocations = function () {
  for (var i = 0; i < MAX_LOCATIONS; i++) {
    var loc = generateObject(i + 1);
    nearbyLocations.push(loc);
  }
};

var createPinsOnMap = function () {
  var item;
  var temp;
  temp = document.getElementsByTagName('template')[0];
  item = temp.content.querySelector('.map__pin');
  for (var i = 0; i < nearbyLocations.length; i++) {
    var mapPin = item.cloneNode(true);
    var pinWidth = window.getComputedStyle(mapPin, null).width;
    var pinHeight = window.getComputedStyle(mapPin, null).height;
    mapPin.style.left = nearbyLocations[i].location.x - pinWidth / 2 + 'px';
    mapPin.style.top = nearbyLocations[i].location.y - pinHeight + 'px';
    mapPin.getElementsByTagName('img')[0].src = nearbyLocations[i].author.avatar;
    mapPin.getElementsByTagName('img')[0].alt = nearbyLocations[i].offer.title;
    document.getElementsByClassName('map__pins')[0].appendChild(mapPin);
    createCardsOnMap(i);
  }
};

var createCardsOnMap = function (i) {
  var item;
  var temp;
  temp = document.getElementsByTagName('template')[0];
  item = temp.content.querySelector('.map__card');

  var mapCard = item.cloneNode(true);
  mapCard.getElementsByClassName('popup__title')[0].textContent = nearbyLocations[i].offer.title;
  mapCard.getElementsByClassName('popup__text--address')[0].textContent = nearbyLocations[i].offer.address;
  mapCard.getElementsByClassName('popup__text--price')[0].textContent = nearbyLocations[i].offer.price + '₽/ночь';
  switch (nearbyLocations[i].offer.type) {
    case 'flat':
      mapCard.getElementsByClassName('popup__type')[0].textContent = 'Квартира';
      break;
    case 'bungalo':
      mapCard.getElementsByClassName('popup__type')[0].textContent = 'Бунгало';
      break;
    case 'house':
      mapCard.getElementsByClassName('popup__type')[0].textContent = 'Дом';
      break;
    case 'palace':
      mapCard.getElementsByClassName('popup__type')[0].textContent = 'Дворец';
      break;
  }

  mapCard.getElementsByClassName('popup__text--capacity')[0].textContent = nearbyLocations[i].offer.rooms + ' комнаты для ' + nearbyLocations[i].offer.guests + ' гостей';

  mapCard.getElementsByClassName('popup__text--time')[0].textContent = 'Заезд после ' + nearbyLocations[i].offer.checkin + ', выезд до ' + nearbyLocations[i].offer.checkout;

  var featureNode = mapCard.getElementsByClassName('popup__features')[0];
  while (featureNode.firstChild) {
    featureNode.removeChild(featureNode.firstChild);
  }
  for (var j = 0; j < nearbyLocations[i].offer.features.length; j++) {
    var featureElem = document.createElement('li');
    featureElem.className = 'popup__feature popup__feature--' + nearbyLocations[i].offer.features[j];
    featureNode.appendChild(featureElem);
  }
  mapCard.getElementsByClassName('popup__description')[0].textContent = nearbyLocations[i].offer.description;


  var photoBlock = mapCard.getElementsByClassName('popup__photos')[0];
  var imgBlock = photoBlock.getElementsByTagName('img')[0];
  for (j = 0; j < photos.length; j++) {
    var apartPhoto = imgBlock.cloneNode(true);
    apartPhoto.src = nearbyLocations[i].offer.photos[j];
    photoBlock.appendChild(apartPhoto);
  }
  photoBlock.removeChild(imgBlock);

  var avatarBlock = mapCard.getElementsByClassName('popup__avatar')[0];
  avatarBlock.src = nearbyLocations[i].author.avatar;


  document.getElementsByClassName('map__filters-container')[0].appendChild(mapCard);

};

getNerbyLocations();
createPinsOnMap();
