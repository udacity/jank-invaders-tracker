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

  // grab the input element and add an onsubmit handler

  // grey out submit button on submit

  // give indication that score was sent

  // time must be an int

  // name must be a single char

  var submit = document.querySelector('button.submit');
  var isLetter = /[a-zA-Z]/;

  var initials = getDomNodeArray('.name');
  initials.forEach(function(elem, index, arr) {
    elem.valid = true;
    elem.onchange = function() {
      var valid = (elem.value.length <= 1 && elem.value.match(isLetter)) || elem.value === "";
      valid ? valid = true : valid = false;
      elem.valid = valid;
      outlineInitial(elem);
    }
  })

  var playerName = "";
  submit.onclick = function() {
    var playerNameHasAtLeastOneChar = false;
    var allValidChars = initials.every(function(elem, index, arr) {
      if (elem.value !== "" && typeof elem.value === "string") playerNameHasAtLeastOneChar = true;
      playerName = playerName + elem.value.toUpperCase();
      return elem.valid;
    })

    if (allValidChars && playerNameHasAtLeastOneChar) {
      submit.setAttribute('disabled', null);
      // FIRE OFF THAT SHIT, THEN SHUT THAT SHIT DOWN WITH A CALLBACK
      // fb = new Firebase(firebasePath);
      console.log(playerName);
      console.log(Firebase)
    } else {
    }

    // pop a "THANKS FOR SUBMITTING DUDEEEEE" thingy
  };
  


  var obj = {"name": "BEN", "time": 1, "timestamp": Date.now()}

  // fb.push(obj);

})();