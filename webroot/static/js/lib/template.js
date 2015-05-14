define(
    [],
    function() {
  function buildTemplate(tpl) {
    if (typeof(tpl) == 'string') {
      tpl = _.template(tpl);
    }   
    function renderWrapper(data) {
      data = data ? data : {}; 
      return tpl(data);
    }   
    return renderWrapper;
  };  
  return {
    buildTemplate : buildTemplate
  }
});
