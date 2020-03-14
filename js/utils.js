'use strict';

(function () {
  var MAX_OBJECTS = 25;

  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';

  var POST_TEMPLATE = document.querySelector('#picture').content.children[0];
  var PICTURES_BLOCK = document.querySelector('.pictures');
  var BIG_PICTURE = document.querySelector('.big-picture');
  var BIG_PICTURE_CLOSE = BIG_PICTURE.querySelector('#picture-cancel');
  var BODY_SELECTOR = document.querySelector('body');

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

  window.utils = {
    ESC_KEY: ESC_KEY,
    ENTER_KEY: ENTER_KEY,
    flags: flags,
    MAX_OBJECTS: MAX_OBJECTS,
    POST_TEMPLATE: POST_TEMPLATE,
    PICTURES_BLOCK: PICTURES_BLOCK,
    BIG_PICTURE_CLOSE: BIG_PICTURE_CLOSE,
    BODY_SELECTOR: BODY_SELECTOR,
    BIG_PICTURE: BIG_PICTURE,
    pickRandomNumber: pickRandomNumber,
    pickRandomNumberWithRepeat: pickRandomNumberWithRepeat,
  };
})();
