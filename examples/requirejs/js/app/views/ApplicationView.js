define([
  'text!app/templates/ApplicationView.html', 
  'app/views/NavView', 
  'app/views/ContactView', 
  'piewpiew.views'
], 

function(template, NavView, ContactView, views) {

  var ApplicationView = views.Layout.extend({
    template: template,

    initialize: function(options) {
      this.navRegion = this.addRegion({
        selector: '.nav'
      });

      this.contactsRegion = this.addRegion({
        selector: '.contacts'
      });

      this.navRegion.addView(new NavView({
        id: "navbar-1"
      }));

      this.navRegion.addView(new NavView({
        id: "navbar-2"
      }));

      this.contactsRegion.addView(new views.CollectionView({
        view: ContactView,
        collection : options.contacts
      }));
    },

    events: {
      'click a.add' : 'onAddClicked'
    },

    onAddClicked: function() {
      this.trigger("add");
    }

  });

  return ApplicationView;
});