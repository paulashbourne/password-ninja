define(
    ['underscore'],
    function(_) {
  function call(method, params, callback, errorCallback) {
    var url = "http://127.0.0.1:5000/api/" + method;
    _.each(params, function(v, k) { if (v == null) { delete params[k]; } })
    return $.ajax({
      type      : 'POST',
      url       : url,
      dataType  : "json",
      data      : { 'params' : JSON.stringify(params) },
      success   : function (o, xhr, opt) {
        o.additional_data = data; //the data that was sent to the call function
        if (callback) { callback(o, data, xhr, opt); }
        debugger;
      },
      error: function (xhr, opt, data) {
        if( opt == 'abort' ) {
          return;
        }
        debugger;
      }
    });
  }
  return {
    call                : call,
  };
});
