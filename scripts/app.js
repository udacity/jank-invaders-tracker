var App = (function() {
  var firebasePath = "https://burning-fire-5340.firebaseio.com/leaderboard";
  var playerName = "";
  var playerTime = 0;
  var fb = undefined;

  function getUid(val1, val2) {
    var jiUid = "";
    if (docCookies.hasItem('ji-uid')) {
      jiUid = docCookies.getItem('ji-uid')
    } else {
      jiUid = val1 + val2 + Date.now();
      docCookies.setItem('ji-uid', jiUid);
    }
    return jiUid || "missing";
  }

  function pushFb(data, succ, fail) {
    if (!fb) fb = new Firebase(firebasePath);
    fb.push(data, function(e) {
      if (e) {
        if (fail) fail(e);
      } else {
        if (succ) succ();
      }
      dropFbConnection();
    });
  }

  function pullSome(value, num, succ, fail) {
    if (!fb) fb = new Firebase(firebasePath);
    var query = fb.limitToLast(num).orderByChild(value).once('value', function(data) {
      if (succ) succ(data);
    },
    function(err) {
      if (fail) fail(err);
    })
  }

  function pullClosest(uid, value, succ, fail) {

    // needs some startAt, endAt values
    if (!fb) fb = new Firebase(firebasePath);
    var total = null;
    var position = null;
    var query = fb.orderByChild(value).once('value', function(data) {
      total = data.numChildren();
      var index = 0;
      data.forEach(function(v) {
        index += 1;
        if (v.val().uid === uid) {
          return true;
        }
      })
      var obj = {
        total: total,
        position: index,
        data: data
      }
      if (succ) succ(obj);
    },
    function(err) {
      if (fail) fail(err);
    })
  }

  function dropFbConnection() {
    Firebase.goOffline();
  }

  return {
    playerName: playerName,
    playerTime: playerTime,
    getUid: getUid,
    pushFb: pushFb,
    pullClosest: pullClosest,
    pullSome: pullSome,
    dropFbConnection: dropFbConnection
  }
})();