document.addEventListener('DOMContentLoaded', function () {
  $('#submit').click(getHash);
});
function getHash() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    parser = document.createElement("a");
    parser.href = url;
    var username = $('#username').val();
    var password = $('#password').val();
    var result = parser.hostname + username + password;
    var hash = CryptoJS.SHA256(result);
    alert(hash);
  });

}
