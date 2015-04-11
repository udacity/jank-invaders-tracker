(function() {
  App.pullFb('time', function(data) {
    // on success
  }, function(e) {
    // on fail
    console.log(e)
  });
})();