/*
If multiple scores, use the lowest time

Your score is the 4th down in the list


*/

(function() {
  var uid = App.getUid();
  var scoreboard = document.querySelector('.scoreboard');
  // App.pullSome('time', 5, function(data) {
  //   // on success
  //   data.forEach(function(v) {
  //     console.log(v.val());
  //   })
  // }, function(e) {
  //   // on fail
  //   console.log(e)
  // });

  function showClosestTimes() {
    // body...
  }

  function showRank(user, total) {
    var r = document.querySelector('#rank');
    var d = document.createElement('div');
    d.classList.add('centered', 'rank-display');
    d.innerHTML = user + " / " + total;
    r.appendChild(d);
  }

  function displayScore(e) {
    var entry = document.createElement('div');
    entry.classList.add('entry');
    if (e.uid === uid) entry.classList.add('you');


    var n = document.createElement('span');
    var r = document.createElement('span');
    var t = document.createElement('span');
    n.classList.add('score-name');
    r.classList.add('score-rank');
    t.classList.add('score-time');

    if (e.name.length < 3) e.name = " " + e.name;

    n.innerHTML = e.name;
    r.innerHTML = e.rank;
    t.innerHTML = e.time;

    entry.appendChild(n);
    entry.appendChild(r);
    entry.appendChild(t);

    scoreboard.appendChild(entry);
  }

  function whoops() {
    var d = document.createElement('div');
    d.classList.add('centered', 'error');
    d.innerHTML = "Whoops! Looks like something went wrong with the scoreboard. Try refreshing or check back later.";

    scoreboard.appendChild(d);
  };

  // App.pullTotalNumber(function(number) {
  //   App.dropFbConnection();
  // });
  App.pullClosest(uid, 'time', function(data) {
    // on success
    var index = 0;
    App.dropFbConnection();
    showRank(data.position, data.total);
    data.data.forEach(function(_entry) {
      index += 1;
      var entry = _entry.val();
      entry.rank = index;
      displayScore(entry);
    })
  }, function() {
    whoops();
  });
})();