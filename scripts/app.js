var App = (function() {
  var firebasePath = "https://burning-fire-5340.firebaseio.com/leaderboard";

  function getUid() {
    var jiUid = "";
    if (docCookies.hasItem('ji-uid')) {
      jiUid = docCookies.getItem('ji-uid')
    } else {
      jiUid = playerName + playerTime + Date.now();
      docCookies.setItem('ji-uid', jiUid);
    }
    return jiUid || "missing";
  }

  function pushFb(data, succ, fail) {
    fb = new Firebase(firebasePath);
    fb.push(data, function(e) {
      if (e) {
        fail();
      } else {
        succ();
      }
      Firebase.goOffline();
    });
  }

  function pullFb(data) {
    console.log("trying to pull...!")
  }

  return {
    getUid: getUid,
    pushFb: pushFb,
    pullFb: pullFb
  }
})();