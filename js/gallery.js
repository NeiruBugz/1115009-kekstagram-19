'use strict';

(function () {

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

  var posts = [];

  var generateMockObject = function () {
    return {
      url: 'photos/' + window.utils.pickRandomNumber(1, window.utils.MAX_OBJECTS) + '.jpg',
      description: 'Балуемся с фотиком',
      likes: window.utils.pickRandomNumberWithRepeat(15, 250),
      comments: [
        {
          avatar: 'img/avatar-' + window.utils.pickRandomNumberWithRepeat(1, 6) + '.svg',
          name: NAMES[window.utils.pickRandomNumberWithRepeat(0, 5)],
          message: COMMENTS[window.utils.pickRandomNumberWithRepeat(0, 5)]
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


  posts = generateMockData(window.utils.MAX_OBJECTS);

  var createPhotoPost = function (photoData) {
    var photoPost = window.utils.POST_TEMPLATE.cloneNode(true);
    var postPicture = photoPost.querySelector('.picture__img');
    postPicture.src = photoData.url;
    var postLikes = photoPost.querySelector('.picture__likes');
    postLikes.textContent = photoData.likes;
    var postComments = photoPost.querySelector('.picture__comments');
    postComments.textContent = String(photoData.comments.length);

    return photoPost;
  };

  var createPicturesFeed = function (DOMElement, mock) {
    for (var i = 0; i < mock.length; i++) {
      DOMElement.appendChild(createPhotoPost(mock[i]));
    }
  };


  window.httpService.load(null, null);

  createPicturesFeed(window.utils.PICTURES_BLOCK, posts);
  window.gallery = {
    posts: posts,
  };
})();
