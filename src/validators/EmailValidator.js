/**
 * EmailValidator class
 * --------------------------------------------------------------------------
 *
 * Ensures email addresses are valid.
 *
 * @property {Regex} regex
 *  The regular expression to validate email addresses against
 *
 * Validation messages
 *  invalid - Email address is invalid
 */
define([
  'piewpiew.core',
  './RegexValidator'
],

function(piewpiew, RegexValidator) {
  
  var EmailValidator = RegexValidator.extend({
    regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    defaultMessages: function() {
      return {
        invalid: EmailValidator.messages.invalid
      };
    }
  });

  EmailValidator.messages = {
    invalid : "${value} is not a valid email address."
  };
  
  return EmailValidator;
  
});