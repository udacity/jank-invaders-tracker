(function() {
  var firebasePath = "https://burning-fire-5340.firebaseio.com/leaderboard";
  
  function getDomNodeArray(selector) {
    // get the elements as a DOM collection
    var elemCollection = document.querySelectorAll(selector);

    // coerce the DOM collection into an array
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

  // give indication that score was sent

  var submit = document.querySelector('button.submit');

  // TODO: cleaner regex logic
  var hasLetter = /[a-zA-Z]/;
  var hasNumber = /[0-9]/;

  var initials = getDomNodeArray('.name');
  initials.forEach(function(elem, index, arr) {
    elem.valid = true;
    elem.onchange = function() {
      var valid = (elem.value.length <= 1 && elem.value.match(hasLetter)) || elem.value === "";
      valid ? valid = true : valid = false;
      elem.valid = valid;
      outlineInitial(elem);
    }
  })

  var times = getDomNodeArray('.time');
  times.forEach(function(elem, index, arr) {
    elem.valid = true;
    elem.onchange = function() {
      var valid = (elem.value.match(hasNumber) && !elem.value.match(hasLetter)) || elem.value === "";
      if (elem.value === "") elem.value = 0;
      elem.valid = valid;
      outlineInitial(elem);
    }
  })

  submit.onclick = function() {
    var playerName = "";
    var playerTime = 0;
    
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

    if (nameLooksGood() && timeLooksGood()) {
      var timestamp = Date.now();

      var playerData = {
        "name": playerName,
        "time": playerTime,
        "timestamp": timestamp
      }

      try {
        fb = new Firebase(firebasePath);
        fb.push(playerData, function(e) {
          Firebase.goOffline();
          popConfirmation();
        });
        submit.setAttribute('disabled', null);
      } catch (e) {
        popError();
      }
    } else {
      popProblemWithSubmission();
    }

    // pop a "THANKS FOR SUBMITTING DUDEEEEE" thingy
  };
  


})();