'use strict';

var Controller = skit.platform.Controller;


module.exports = Controller.create({
  __title__: function(childTitle) {
    // Parent controllers can frame the title content of child controllers.
    return childTitle + ' | Wiki Site';
  },

  __body__: function(childHtml) {
    // Parent controllers can frame the body content of child controllers.
    return <div id="base" className="container">{childHtml}</div>;
  },

  __bodyToHtml__: function(body) {
    // This takes the whole react tree to this point and generates
    // the server-side HTML we need.
    return React.renderToString(body);
  },

  __ready__: function() {
    // This hooks up any client-side event handlers, reconstructing
    // the state in the browser.
    React.render(this.renderFullBody(true), document.getElementById('base').parentNode);
  }
});