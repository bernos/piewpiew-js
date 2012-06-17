describe('TextField', function() {
  
  describe('#render()', function() {

    it('Should render values', function(done) {
      require(['piewpiew.forms.fields'], function(fields) {
        var field = new fields.TextField();
        var html = field.render("my-value", {id: "my-id"});

        expect(html).to.match(/value="my-value"/);

        done();
      }); 
    });

    it('Should render name passed in by constructor', function(done) {
      require(['piewpiew.forms.fields'], function(fields) {
        var field = new fields.TextField({name:'my-textfield'});
        var html = field.render("my-value", {id: "my-id"});

        expect(html).to.match(/name="my-textfield"/);

        done();
      }); 
    });       
  });
});