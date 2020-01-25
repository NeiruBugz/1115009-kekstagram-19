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
var BIG_PICTURE = document.querySelector('.big-picture');
var BODY_SELECTOR = document.querySelector('body');

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
    description: 'Балуемся с фотиком',
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

var fillBigPicturePost = function (index, mock, DOMElement) {
  var bigPictureImage = DOMElement.querySelector('.big-picture__img');
  bigPictureImage.children[0].src = mock[index].url;
  var likesCount = DOMElement.querySelector('.likes-count');
  likesCount.textContent = mock[index].likes;
  var commentsCount = DOMElement.querySelector('.comments-count');
  commentsCount.textContent = String(mock[index].comments.length);
  var commentsList = DOMElement.querySelector('.social__comment');
  for (var i = 0; i < mock[index].comments.length; i++) {
    var commentAvatar = commentsList.querySelector('.social__picture');
    commentAvatar.src = mock[index].comments[i].avatar;
    commentAvatar.alt = mock[index].comments[i].name;
    var commentContent = commentsList.querySelector('.social__text');
    commentContent.textContent = mock[index].comments[i].message;
  }

  var socialCaption = DOMElement.querySelector('.social__caption');
  socialCaption.textContent = mock[index].description;

  var commentsCountGlobal = DOMElement.querySelector('.social__comment-count');
  commentsCountGlobal.classList.add('hidden');
  var commentsLoader = DOMElement.querySelector('.comments-loader');
  commentsLoader.classList.add('hidden');
};

posts = generateMockData(MAX_OBJECTS);

createPicturesFeed(PICTURES_BLOCK, posts);
fillBigPicturePost(0, posts, BIG_PICTURE);

BIG_PICTURE.classList.remove('hidden');
BODY_SELECTOR.classList.add('modal-open');
