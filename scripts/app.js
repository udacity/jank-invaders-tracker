var App = (function() {
  var playerName = "";
  var playerTime = 0;
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
        if (fail) fail(e);
      } else {
        if (succ) succ();
      }
      Firebase.goOffline();
    });
  }

  function pullFb(value, succ, fail) {
    fb = new Firebase(firebasePath);
    var query = fb.limitToLast(5).orderByChild(value).once('value', function(data) {
      Firebase.goOffline();
      data.forEach(function(v) {
        console.log(v.val());
      })
      if (succ) succ(data);
    },
    function(err) {
      Firebase.goOffline();
      if (fail) fail(err);
    })
  }

  return {
    playerName: playerName,
    playerTime: playerTime,
    getUid: getUid,
    pushFb: pushFb,
    pullFb: pullFb
  }
})();