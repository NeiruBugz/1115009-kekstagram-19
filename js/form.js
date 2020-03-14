'use strict';

(function () {
  var MIN_HASHTAG_LENGTH = 1;
  var MAX_HASHTAG_LENGTH = 20;
  var MAX_HASHTAG_AMOUNT = 5;

  var MAX_COMMENT_LENGTH = 140;

  var DEFAULT_SCALE_VALUE = 100;
  var MAX_SCALE_VALUE = DEFAULT_SCALE_VALUE;
  var MIN_SCALE_VALUE = 25;
  var SCALE_STEP = 25;
  var currentScaleValue = DEFAULT_SCALE_VALUE;

  var uploadFile = document.querySelector('#upload-file');
  var cancelUpload = document.querySelector('#upload-cancel');
  var photoEditDialog = document.querySelector('.img-upload__overlay');
  var photoHashtags = photoEditDialog.querySelector('.text__hashtags');
  var photoComment = window.utils.BIG_PICTURE.querySelector('.social__footer-text');

  var imageScaleContainer = document.querySelector('.scale');
  var decrementScaleButton = imageScaleContainer.querySelector('.scale__control--smaller');
  var incrementScaleButton = imageScaleContainer.querySelector('.scale__control--bigger');
  var imageScaleValue = imageScaleContainer.querySelector('.scale__control--value');
  var imageContainer = photoEditDialog.querySelector('.img-upload__preview img');

  var onEscPress = function (evt) {
    if (evt.key === window.utils.ESC_KEY) {
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

  var commentValidation = function (comment) {
    if (comment.length > MAX_COMMENT_LENGTH) {
      return 'Длина комментария не должна превышать 140 символов';
    }

    return '';
  };

  photoComment.addEventListener('input', function (evt) {
    var inputElement = evt.target;
    var inputValue = inputElement.value;

    if (inputValue.length <= 0) {
      return;
    }

    var errorMessage = commentValidation(inputValue);
    inputElement.setCustomValidity(errorMessage);
    inputElement.reportValidity();
  });

  var hashtagsValidation = function (hashtags) {
    if (hashtags.length > MAX_HASHTAG_AMOUNT) {
      return 'Нельзя указать больше пяти хэш-тегов';
    }

    for (var i = 0; i < hashtags.length; i++) {
      var hashtag = hashtags[i];
      if (hashtag[0] !== '#') {
        return 'Укажите символ # в начале хэштега';
      }
      if (hashtag.length <= MIN_HASHTAG_LENGTH || hashtag.length > MAX_HASHTAG_LENGTH) {
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
})();
