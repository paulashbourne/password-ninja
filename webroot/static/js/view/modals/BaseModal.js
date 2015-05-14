define(
    ['lib/bb', 'tpl!modals/base_modal'],
    function(bb, tpl) {

  var BaseModal = bb.BackboneView.extend({
    launchModal : function(el, options) {
      var $modal_el = $(el);
      if (!options) options = {};
      $modal_el.on('hidden', _.bind(function() {
          this.trigger('hidden');
      }, this));
      if ($('.modal-backdrop')) {
        $modal_el.on('shown', function (e) {
        var $t = $(e.target);
        if ($t.hasClass('modal')) {
          $t2=$t.data('modal');
          $t2.$backdrop.css('z-index', 1047);
        }
      }).on('hidden', function (e) {
        //add modal open class since we still have opened modal.
         var $t = $(e.target);
         if ($t.hasClass('modal')) {
         $('body').addClass('modal-open');
         }
         }).on('focusin', function (e) {
        // stop focusin competition war.
          e.stopPropagation();
        });
      }
      $modal_el.modal(options);
      $modal_el.on('hidden', function() {
        $modal_el.remove();
      });
     this.setElement($modal_el);
    },
    close : function() {
      $(this.el).modal('hide');
      this.trigger('close');
    }
  });
  
  var AlertModal = BaseModal.extend({
    options : {
      'title'    : 'Alert',
      'btn_text' : 'Close',
      'message'  : '',
      'type'     : 'warning'
    },
    initialize : function(options) {
      $.extend(true, this.options, options);
    },
    render : function() {
      this.view = tpl.alert_modal(this.options);
      this.launchModal(this.view); 
    }
  });

  var ErrorModal = AlertModal.extend({
    'title'    : 'Error',
    'type'     : 'danger',
    'btn_text' : 'Close',
    'message'  : ''
  });

  var SuccessModal = AlertModal.extend({
    options : {
      'title'    : 'Success',
      'type'     : 'success',
      'btn_text' : 'Close',
      'message'  : ''
    }
  });

  var launchErrorModal = function(message) {
      var modal = new ErrorModal({
        'message' : message
      });
      modal.render();
      return modal;
  };

  var launchSuccessModal = function(message) {
      var modal = new SuccessModal({
        'message' : message
      });
      modal.render();
      return modal;
  };
  
  var ConfirmationModal = BaseModal.extend({
    options : {
      'title'        : 'Confirmation',
      'confirm_text' : 'Confirm',
      'cancel_text'  : 'Cancel',
      'message'      : 'Are you sure you want to proceed?'
    },
    initialize : function(options) {
      $.extend(true, this.options, options);
    },
    events : {
      'click .btn-confirm' : 'confirmClicked',
      'click .btn-cancel'  : 'cancelClicked'
    },
    confirmClicked : function(evt) {
      this.trigger('confirm');
    },
    cancelClicked : function(evt) {
      this.trigger('cancel');
    },
    render : function() {
      this.view = tpl.confirmation_modal(this.options);
      this.launchModal(this.view); 
    }
  });

  return {
    BaseModal         : BaseModal,
    ErrorModal        : ErrorModal,
    AlertModal        : AlertModal,
    SuccessModal      : SuccessModal,
    ConfirmationModal : ConfirmationModal,
    launchSuccess     : launchSuccessModal,
    launchError       : launchErrorModal
  };

});
