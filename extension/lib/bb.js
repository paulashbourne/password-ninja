define(['lib/backbone', 'lib/template'], function(Backbone, TplModule) {

  var BackboneView = Backbone.View.extend({
    buildTpl : function(tpl) {
      return TplModule.buildTemplate(tpl);
    }   
  }); 

  var BackboneModel = Backbone.Model.extend({
  }); 

  var BackboneRouter = Backbone.Router.extend({
  }); 

  var startHistory = function() {
    if (Backbone.history) {
      Backbone.history.start();
    }   
  }

  return {
    BackboneView    : BackboneView,
    BackboneModel   : BackboneModel,
    BackboneRouter  : BackboneRouter,
    startHistory    : startHistory
  }
});
