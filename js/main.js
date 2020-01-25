'use strict';

var MAX_OBJECTS = 25;

var NAMES = [
  'Валера',
  'Виталик',
  'Ксюша',
  'Вадим',
  'Настя',
  'Алена',
];

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var POST_TEMPLATE = document.querySelector('#picture').content.children[0];
var PICTURES_BLOCK = document.querySelector('.pictures');

var posts = [];
var flags = [];

var generateArrayOfFlags = function (length) {
  var resultFlags = [];
  for (var i = 0; i < length; i++) {
    resultFlags.push(false);
  }

  return resultFlags;
};

flags = generateArrayOfFlags(MAX_OBJECTS);

var pickRandomNumber = function (min, max) {
  var index = Math.floor(min + Math.random() * (max + 1 - min));
  if (flags[index]) {
    return pickRandomNumber(min, max);
  } else {
    flags[index] = true;
    return index;
  }
};

var pickRandomNumberWithRepeat = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var generateMockObject = function () {
  return {
    url: 'photos/' + pickRandomNumber(1, MAX_OBJECTS) + '.jpg',
    description: '',
    likes: pickRandomNumberWithRepeat(15, 250),
    comments: [
      {
        avatar: 'img/avatar-' + pickRandomNumberWithRepeat(1, 6) + '.svg',
        name: NAMES[pickRandomNumberWithRepeat(0, 5)],
        message: COMMENTS[pickRandomNumberWithRepeat(0, 5)]
      }
    ],
  };
};

var generateMockData = function (dataLength) {
  var mock = [];
  for (var i = 0; i < dataLength; i++) {
    mock.push(generateMockObject());
  }

  return mock;
};

var createPhotoPost = function (photoData) {
  var photoPost = POST_TEMPLATE.cloneNode(true);
  var postPicture = photoPost.querySelector('.picture__img');
  postPicture.src = photoData.url;
  var postLikes = photoPost.querySelector('.picture__likes');
  postLikes.textContent = photoData.likes;
  var postComments = photoPost.querySelector('.picture__comments');
  postComments.textContent = photoData.comments.length;

  return photoPost;
};

var createPicturesFeed = function (DOMElement, mock) {
  for (var i = 0; i < mock.length; i++) {
    DOMElement.appendChild(createPhotoPost(mock[i]));
  }
};

posts = generateMockData(MAX_OBJECTS);

createPicturesFeed(PICTURES_BLOCK, posts);
