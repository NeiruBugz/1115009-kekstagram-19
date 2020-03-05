'use strict';

var MAX_OBJECTS = 25;
var DEFAULT_SCALE_VALUE = 100;
var MAX_SCALE_VALUE = DEFAULT_SCALE_VALUE;
var MIN_SCALE_VALUE = 25;
var SCALE_STEP = 25;
var currentScaleValue = DEFAULT_SCALE_VALUE;
var ESC_KEY = 'Escape';


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

var uploadFile = document.querySelector('#upload-file');
var cancelUpload = document.querySelector('#upload-cancel');
var photoEditDialog = document.querySelector('.img-upload__overlay');
var photoHashtags = photoEditDialog.querySelector('.text__hashtags');
var photoDescription = photoEditDialog.querySelector('.text__description');

var hashtagsValidation = function (hashtags) {
  if (hashtags.length > 5) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }

  for (var i = 0; i < hashtags.length; i++) {
    var hashtag = hashtags[i];
    if (hashtag[0] !== '#') {
      return 'Укажите символ # в начале хэштега';
    }
    if (hashtag.length <= 1 || hashtag.length > 20) {
      return 'Длина хэштега должна быть от 1 до 20 символов';
    }
    var hashtagValidator = hashtag.match(new RegExp('[\\d\\wа-я]', 'ug')) || [];
    if (hashtag.slice(1) !== hashtagValidator.join('')) {
      return 'Строка после решётки должна состоять только из букв и чисел';
    }
    if (hashtags.indexOf(hashtag, i + 1) !== -1) {
      return 'Нельзя использовать один и тот же хэштег два и более раз';
    }
  }
  return '';
};

photoHashtags.addEventListener('input', function (evt) {
  var inputElement = evt.target;
  var hashtags = inputElement.value.trim().toLowerCase();
  if (hashtags.length <= 0) {
    return;
  }
  hashtags = hashtags.split(' ');

  var errorMessage = hashtagsValidation(hashtags);
  inputElement.setCustomValidity(errorMessage);
  inputElement.reportValidity();
});

var onEscPress = function (evt) {
  if (evt.key === ESC_KEY) {
    closeDialog();
  }
};

var openDialog = function () {
  photoEditDialog.classList.remove('hidden');
  document.addEventListener('keydown', onEscPress);
};

var closeDialog = function () {
  uploadFile.value = '';
  photoEditDialog.classList.add('hidden');
  document.removeEventListener('keydown', onEscPress);
};

uploadFile.addEventListener('change', openDialog);
cancelUpload.addEventListener('click', closeDialog);

var imageScaleContainer = document.querySelector('.scale');
var decrementScaleButton = imageScaleContainer.querySelector('.scale__control--smaller');
var incrementScaleButton = imageScaleContainer.querySelector('.scale__control--bigger');
var imageScaleValue = imageScaleContainer.querySelector('.scale__control--value');
var imageContainer = photoEditDialog.querySelector('.img-upload__preview img');

imageScaleValue.value = DEFAULT_SCALE_VALUE + '%';

var scaleImage = function () {
  imageScaleValue.value = currentScaleValue + '%';
  imageContainer.style.transform = 'scale(' + currentScaleValue / 100 + ')';
};

decrementScaleButton.addEventListener('click', function () {
  if (currentScaleValue > MIN_SCALE_VALUE) {
    currentScaleValue -= SCALE_STEP;
    scaleImage();
  }
});

incrementScaleButton.addEventListener('click', function () {
  if (currentScaleValue < MAX_SCALE_VALUE) {
    currentScaleValue += SCALE_STEP;
    scaleImage();
  }
});

var effectValue = photoEditDialog.querySelector('.effect-level__value');
var effectLine = photoEditDialog.querySelector('.effect-level__line');
var effectPin = photoEditDialog.querySelector('.effect-level__pin');
var effectDepthLine = photoEditDialog.querySelector('.effect-level__depth');

effectPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  var prevPinCoords = {
    x: evt.clientX,
  };

  var onPinMove = function (mouseEvt) {
    mouseEvt.preventDefault();
    var pinShift = {
      x: prevPinCoords.x - mouseEvt.clientX,
    };

    prevPinCoords = {
      x: mouseEvt.clientX,
    };

    var newPinPos = effectPin.offsetLeft - pinShift.x;

    if (newPinPos < 0) {
      newPinPos = 0;
    }

    if (newPinPos > effectLine.offsetWidth) {
      newPinPos = effectLine.offsetWidth;
    }

    effectPin.style.left = newPinPos + 'px';

    var proportion = newPinPos / effectLine.offsetWidth;

    effectValue.value = Math.round(proportion * 100);
    effectDepthLine.style.width = proportion * 100 + '%';

    if (imageContainer.className === 'effects__preview--chrome') {
      imageContainer.style.filter = 'grayscale(' + proportion + ')';
    }

    if (imageContainer.className === 'effects__preview--sepia') {
      imageContainer.style.filter = 'sepia(' + proportion + ')';
    }

    if (imageContainer.className === 'effects__preview--marvin') {
      imageContainer.style.filter = 'invert(' + proportion + ')';
    }

    if (imageContainer.className === 'effects__preview--phobos') {
      imageContainer.style.filter = 'blur(' + proportion * 3 + 'px)';
    }

    if (imageContainer.className === 'effects__preview--heat') {
      imageContainer.style.filter = 'brightness(' + (1 + proportion * (2 - 1)) + ')';
    }
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onPinMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onPinMove);
  document.addEventListener('mouseup', onMouseUp);
});

var effectsContainer = document.querySelector('.effects');
var effectsControls = effectsContainer.querySelectorAll('.effects__radio');
var effectLevelValue = document.querySelector('.effect-level');

var switchFilter = function (control) {
  control.addEventListener('change', function () {
    var filter = 'effects__preview--' + control.value;
    if (control.value !== 'none') {
      effectLevelValue.classList.remove('hidden');
    } else {
      effectLevelValue.classList.add('hidden');
    }
    imageContainer.className = filter;
    imageContainer.style.filter = '';
    effectPin.style.left = '0px';
    effectDepthLine.style.width = '0px';
  });
};

for (var k = 0; k < effectsControls.length; k++) {
  switchFilter(effectsControls[k]);
}


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

// BIG_PICTURE.classList.remove('hidden');
BODY_SELECTOR.classList.add('modal-open');
