'use strict';
(function () {
  var URL = 'https://js.dump.academy/kekstagram/data';
  var STATUS_OK = 200;
  var TIMEOUT_REQUEST = 10000;

  var onRequest = function (onSuccessCallback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_REQUEST;

    var eventLoadXHRHandler = function () {
      if (xhr.status === STATUS_OK) {
        onSuccessCallback(xhr.response);
      } else {
        throw new Error('Ошибка запроса данных ' + xhr.status);
      }
    };

    xhr.addEventListener('load', eventLoadXHRHandler);

    return xhr;
  };

  var load = function (callback) {
    var xhr = onRequest(callback);
    xhr.open('GET', URL);
    xhr.send();
  };

  window.httpService = {
    load: load
  };

})();
