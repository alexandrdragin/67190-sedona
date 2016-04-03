'use strict';

(function() {

  var buttonCl = document.querySelector('.main-nav__button--close');
  var buttonOp = document.querySelector('.main-nav__button--open');
  var nav = document.querySelector('.main-nav');

  buttonCl.addEventListener('click', closeFun);
  buttonOp.addEventListener('click', openFun);

  function closeFun() {
   nav.style.display = "none";
   buttonCl.style.display = "none";
   buttonOp.style.display = "block";
  };

  function openFun() {
    nav.style.display = "flex";
    buttonCl.style.display = "block";
    buttonOp.style.display = "none";
  };

  })();
