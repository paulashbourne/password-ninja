chrome.runtime.onConnect.addListener(function(port) {
  if (port.name == "detectSelector") {
    port.onMessage.addListener(function(msg) {
      console.log(msg.selector);
    });
  } else if (port.name == "browserAction") {
    port.onMessage.addListener(function(msg) {
      if (message.instruction == "START") {

      }
    });
  }
});
