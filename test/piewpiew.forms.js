describe('forms', function() {
  describe('Form', function() {
  
    describe('field tests', function() {

      it('Should do stuff', function(done) {
        require(['forms/Form', 'forms/fields'], function(Form, fields) {
          var MyForm = Form.extend({
            fields: {
              firstName: new fields.TextField({
                minLength: 1
              })
            }            
          });

          var form = new MyForm({
            firstName: "Brendan"
          });

          //form.set({
          //  firstName: "tond"
          //})

          console.log(form);
          done();
        });
      });

    });
  });

});
