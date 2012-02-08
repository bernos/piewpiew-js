PiewPiew! (the sound that a laser gun makes in the future)
==========================================================

PiewPiew is a bunch of handy javascript utilities, libraries, stuff designed to
make javascripting more good. Theres a bit of everything here, from low level
stuff like the quasi-oop <code>piewpiew.Class</code> to some useful addons to
existing libraries such as the <code>piewpiew.Backbone</code> utils. 

piewpiew.core
=============

The core library module contains generally useful stuff used throughout the
piewpiew library. Stuff like OOP constructs and so on.

piewpiew.Class
--------------

You can encapsulate common functions into classes (just like in a real OOP
language) using the <code>piewpiew.Class</code> method. Just pass an object 
literal to be assigned to the new "class" prototype. For example

  Person = piewpiew.Class({
    
    firstName: "",
    
    lastName: "",
    
    getFullName: function() {
      return [this.firstName, this.lastName].join(" "); 
    }

  });

We can instantiate a new <code>Person</code> instance using the <code>new</code> 
keyword:

  var me = new Person();

You can define a constructor for your class by specifying an 
<code>initialize</code> method.

The <code>initialize</code> method will receive any arguments passed when the 
object was instantiated. For example:

  Person = piewpiew.Class({
    initialize: function(options) {
      this.firstName = options.firstName;
      this.lastName = options.lastName;
    },
    
    firstName: "",
    
    lastName: "",
    
    getFullName: function() {
      return [this.firstName, this.lastName].join(" "); 
    }

  });

  var me = new Person({
    firstName: "Brendan",
    lastName: "McMahon"
  });

  var myBrother = new Person({
    firstName: "Sean",
    lastName: "McMahon"
  });

Inheritance is implemented via the <code>extend</code> method. Check it out:

  Parent = Person.extend({

    initialize: function(options) {
      var children = [] || options.children;

      for(var i = 0, m = children.length; i < m; i++) {
        this.addChild(children[i]);
      }
    },

    getChildren: function() {
      if (null == this._children) {
        this._children = [];
      }
      return this._children;
    },

    addChild: function(child) {
      this.getChildren().push(child);  
    }    
  });

  var myDad = new Parent({
    children: [
      me,
      myBrother
    ]
  });