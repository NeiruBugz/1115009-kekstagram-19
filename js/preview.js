'use strict';

(function () {
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

  fillBigPicturePost(0, window.gallery.posts, window.utils.BIG_PICTURE);

  var createBigPhotoView = function (DOMElement, source) {
    var bigPhotoImage = DOMElement.querySelector('.big-picture__img img');
    var bigPhotoLikes = DOMElement.querySelector('.likes-count');
    var bigPhotoCommentsCount = DOMElement.querySelector('.comments-count');

    bigPhotoImage.src = source.url;
    bigPhotoLikes.textContent = source.likes;
    bigPhotoCommentsCount.textContent = String(source.comments.length);
  };

  var createBigPhotoComments = function (DOMElement, source) {
    var commentsList = DOMElement.querySelector('.social__comment');
    for (var i = 0; i < source.comments.length; i++) {
      var commentAvatar = commentsList.querySelector('.social__picture');
      commentAvatar.src = source.comments[i].avatar;
      commentAvatar.alt = source.comments[i].name;
      var commentContent = commentsList.querySelector('.social__text');
      commentContent.textContent = source.comments[i].message;
    }
  };

  var onPhotoClick = function (evt) {
    var photo = evt.target.closest('.picture');
    if (photo) {
      var photoImg = photo.querySelector('.picture__img');
      if (photoImg) {
        for (var i = 0; i < window.gallery.posts.length; i++) {
          if (photoImg.src.includes(window.gallery.posts[i].url)) {
            createBigPhotoView(window.utils.BIG_PICTURE, window.gallery.posts[i]);
            createBigPhotoComments(window.utils.BIG_PICTURE, window.gallery.posts[i]);
            window.utils.BIG_PICTURE.classList.remove('hidden');
            return;
          }
        }
      }
    }
  };

  var closePhoto = function () {
    window.utils.BIG_PICTURE.classList.add('hidden');
  };

  window.utils.PICTURES_BLOCK.addEventListener('click', function (evt) {
    onPhotoClick(evt);
  });

  window.utils.PICTURES_BLOCK.addEventListener('keydown', function (evt) {
    if (evt.key === window.utils.ENTER_KEY) {
      onPhotoClick(evt);
    }
  });

  window.utils.BIG_PICTURE_CLOSE.addEventListener('click', closePhoto);
  document.addEventListener('keydown', function (evt) {
    if (evt.key === window.utils.ESC_KEY) {
      closePhoto();
    }
  });
})();
