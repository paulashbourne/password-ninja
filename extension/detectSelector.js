var ActionRecorder = function() {
  this.actions = [];
  this.eventClass = randomStr(10);

  this.start = function() {
    $(document).on('click', '*', logEvent);
  };
  this.stop = function() {

  };
}
function randomStr(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < length; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

$(document).ready(function(evt) {
  var port = chrome.extension.connect({name : "detectSelector"});
  $(document).on('click', '*', messageSelector);
  function detectSelector(evt) {
    if (evt.target != evt.currentTarget) {
      return false;
    }
    var selectorUnique = function(selector) {
      return $(selector).length === 1;
    }
    var $el = $(evt.currentTarget);
    var selector = $el.prop("tagName");
    var id = $el.prop('id')
    if (id != null && id != "") {
      selector += "#" + id;
    }
    var type = $el.prop("type");
    if (type != null && type != "") {
      selector += '[type="' + type + '"]';
    }
    var name = $el.prop("name");
    if (name != null && name != "") {
      selector += '[name="' + name + '"]';
    }
    if (selectorUnique(selector)) {
      if ($el.parent().length !== 0) {
        //recurse
        return $el.parent() + " " + selector;
      } else {
        return null;
      }
    }
    // add first class if exists
    var classes = $el.prop('class');
    if (classes != null && classes != "") {
      selector += "." + classes.split(/\s+/)[0];
      if (selectorUnique(selector)) {
        return selector;
      }
    }
  }
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
