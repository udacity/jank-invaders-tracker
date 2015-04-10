(function() {
  var submit = document.querySelector('button.submit');
  var initials = getDomNodeArray('.name');
  var times = getDomNodeArray('.time');
  var playerName = "";
  var playerTime = 0;

  function getDomNodeArray(selector) {
    var elemCollection = document.querySelectorAll(selector);
    var elemArray = Array.prototype.slice.apply(elemCollection);
    return elemArray;
  };
  function outlineInitial(elem, valid) {
    if (!elem.valid) {
      elem.style.outline = "red solid 2px";
    } else if (elem.valid) {
      elem.style.outline = "";
    }
  }
  // TODO: cleaner regex logic
  var hasLetter = /[a-zA-Z]/;
  var hasNumber = /[0-9]/;
  initials.forEach(function(elem, index, arr) {
    elem.valid = true;
    elem.onchange = function() {
      var valid = (elem.value.length <= 1 && elem.value.match(hasLetter)) || elem.value === "";
      valid ? valid = true : valid = false;
      elem.valid = valid;
      outlineInitial(elem);
    }
  })
  times.forEach(function(elem, index, arr) {
    elem.valid = true;
    elem.onchange = function() {
      var valid = (elem.value.match(hasNumber) && !elem.value.match(hasLetter)) || elem.value === "";
      if (elem.value === "") elem.value = 0;
      if (elem.id === 'ms' && elem.value > 999) valid = false;
      if (elem.id === 'secs' && elem.value > 59) valid = false;
      elem.valid = valid;
      outlineInitial(elem);
    }
  })
  function nameLooksGood() {
    var playerNameHasAtLeastOneChar = false;
    var allValidChars = initials.every(function(elem, index, arr) {
      if (elem.value !== "" && typeof elem.value === "string") playerNameHasAtLeastOneChar = true;
      playerName = playerName + elem.value.toUpperCase();
      return elem.valid;
    })
    return allValidChars && playerNameHasAtLeastOneChar;
  };

  function timeLooksGood() {
    var allValidTimes = times.every(function(elem, index, arr) {
      if (elem.value === "") elem.value = 0;
      if (elem.id === 'mins') playerTime = playerTime + (parseInt(elem.value) * 60000);
      if (elem.id === 'secs') playerTime = playerTime + (parseInt(elem.value) * 1000);
      if (elem.id === 'ms') playerTime = playerTime + parseInt(elem.value);
      return elem.valid;
    })
    return allValidTimes && (playerTime > 0);
  }
  function popSubmissionMessage(data) {
    var message = data.message;
    var cssClass = data.cssClass;

    var d = document.querySelector('.submission-message');
    if (!d) {
      d = document.createElement('div');
      d.classList.add('submission-message');
      document.querySelector('.score-entry').appendChild(d);
    }
    
    // TODO: ewwww
    if (d.classList.contains('congrats')) d.classList.remove('congrats');
    if (d.classList.contains('error')) d.classList.remove('error');
    if (d.classList.contains('user-error')) d.classList.remove('user-error');
    d.classList.add(cssClass);

    d.innerHTML = message;
  }
  function popConfirmation() {
    popSubmissionMessage({
      "message": "Your score has been submitted! At the end of the lesson we'll show you how it stacks up against your classmates! Click 'Next' to continue.",
      "cssClass": "congrats"
    })
  }
  function popError() {
    popSubmissionMessage({
      "message": "Looks like something went wrong :( Please try again later. In the meantime, click 'Next' to learn more about building performant web apps!",
      "cssClass": "error"
    })
  }
  function popUserProblemWithSubmission() {
    popSubmissionMessage({
      "message": "Something doesn't look right? Did you fill in at least one initial and your time?",
      "cssClass": "user-error"
    })
  }

  submit.onclick = function() {
    playerName = "";
    playerTime = 0;
    if (nameLooksGood() && timeLooksGood()) {
      var timestamp = Date.now();
      var uid = App.getUid();

      var playerData = {
        "name": playerName,
        "time": playerTime,
        "timestamp": timestamp,
        "uid": uid
      }
      App.pushFb(playerData, function() {
        popConfirmation();
        submit.setAttribute('disabled', null);
      }, popError);
    } else {
      popUserProblemWithSubmission();
    }
  };
})();