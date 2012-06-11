define([
  'text!app/templates/ApplicationView.html',
  'app/views/NavView', 
  'app/views/ContactCollectionView',
  'app/controllers/ContactCollectionController',
  'piewpiew.forms',
  'piewpiew.views',
  'app/forms/ContactForm'
], 

function(template, NavView, ContactCollectionView, ContactCollectionController, forms, views, ContactForm) {

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

      this.contactCollectionView = new ContactCollectionView({
        collection : options.contacts
      });

      this.contactCollectionController = new ContactCollectionController({
        view: this.contactCollectionView
      })

      this.contactsRegion.addView(this.contactCollectionView);

      var form = new ContactForm({
        name: "Brendan McMahon"
      });

      this.formView = new views.FormView({
        model: form
      });

      this.contactsRegion.addView(this.formView);
    }
  });

  return ApplicationView;
});