/*var ActionRecorder = function() {
  this.actions = [];
  this.eventClass = randomStr(10);

  this.start = function() {
    $(document).on('click', '*', logEvent);
  };
  this.stop = function() {

  };
}*/

$(document).ready(function(evt) {
  var port = chrome.extension.connect({name : "detectSelector"});
  $(document).on('click', '*', messageSelector);
  function messageSelector(evt) {
    var selector = detectSelector(evt);
    if (selector !== false) {
      port.postMessage({'selector' : selector});
    }
  }
  function logSelector(evt) {
    var selector = detectSelector(evt);
    if (selector !== false) {
      console.log(selector);
    }
  }
});
