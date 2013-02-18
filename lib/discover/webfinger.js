var webfinger = require('webfinger').webfinger
  , configuration = require('../configuration').configuration;

module.exports = function() {
  
  
  return function(identifier, done) {
    if (!identifier) { return done(); }
  
  
    console.log('WEBFINGER: ' + identifier);
    
    webfinger(identifier, 'http://openid.net/specs/connect/1.0/issuer', function(err, jrd) {
      if (err) {
        console.log('WebFinger error');
        console.log(err);
        return done(err);
      };
      
      console.log('JRD:');
      console.log(jrd);
      
      var issuer;
      for (var i = 0; i < jrd.links.length; i++) {
        var link = jrd.links[i];
        if (link.rel == 'http://openid.net/specs/connect/1.0/issuer') {
          issuer = link.href;
          break;
        }
      }
      
      if (!issuer) { return done(new Error('No OpenID Connect issuer found in resource descriptor')); }
      
      console.log('FOUND ISSUER: ' + issuer);
      
      configuration(issuer, function(err, config) {
        if (err) {
          console.log('configuration error');
          console.log(err);
          return done(err);
        };
        
        console.log('CONFIG:');
        console.log(config);
        
      });
    });
  }
}