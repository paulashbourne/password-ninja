var BackgroundPage = function() {
  var obj = {
    initialize : function() {
      this.popupSessions = {}; //key is tab id
      this.contentSessions = {};
      //setup port listeners
      chrome.runtime.onConnect.addListener(_.bind(function(port) {
        if (port.name.indexOf("popup") == 0) {
          var tabid = parseInt(port.name.substring(6));
          if (!(tabid in this.popupSessions)) {
            this.popupSessions[tabid] = {
              'tabid'     : tabid,
              'sessionid' : null
            };
          }
          this.popupSessions[tabid].port = port;
          var sessionid = this.popupSessions[tabid].sessionid;
          if (sessionid !== null) {
            if (this.contentSessions[sessionid].type == 'learnChangePassword') {
              //message browser port back with sessionid
              port.postMessage({
                'command'   : 'learnChangePasswordStarted',
                'data' : {
                  'sessionid' : sessionid
                }
              });
            }
          }
          port.onMessage.addListener(_.bind(this.portListener(tabid), this));
        }
      }, this));
    },
    portListener : function(tabid) {
      return function(msg) {
        this.handleMessage(tabid, msg);
        console.log(msg);
      }
    },
    handleMessage : function(tabid, msg) {
      if (msg.msg == "startLearnChangePassword") {
        this.startLearnChangePassword(tabid);
      } else if (msg.msg == "doneLearning") {
        this.doneLearning(tabid);
      }
    },
    handleContentMessage : function(msg) {
      if (msg.type === 'userAction') {
        this.contentSessions[msg.sessionid].instructions.push(msg.data);
      }
    },
    getActiveTab : function(callback) {
      chrome.tabs.query({
        'active'        : true,
        'currentWindow' : true
      }, _.bind(function(tabs) {
        callback(tabs[0]);
      }, this));
    },
    startLearnChangePassword : function(tabid) {
      //generate random sessionid
      var sessionid = PasswordNinjaLib.getRandomString(10);
      while (sessionid in this.contentSessions) {
        sessionid = PasswordNinjaLib.getRandomString(10);
      }
      var contentPort = chrome.tabs.connect(tabid);
      this.contentSessions[sessionid] = {
        'tabid'        : tabid,
        'contentPort'  : contentPort,
        'type'         : 'learnChangePassword',
        'instructions' : []
      };
      this.popupSessions[tabid].sessionid = sessionid;
      contentPort.onMessage.addListener(_.bind(function(msg) {
        this.handleContentMessage(msg);
      }, this));
      contentPort.postMessage({
        'command'   : 'startCapture',
        'sessionid' : sessionid
      });
    },
    doneLearning : function(tabid) {
      console.log(this);
    }
  };
  obj.initialize();
  return obj;
};

// main
$(document).ready(function() {
  var script = new BackgroundPage();
});

