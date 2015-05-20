'use strict';

var Controller = skit.platform.Controller;
var BaseController = library.BaseController;
var LoginForm = library.JSX.LoginForm;

module.exports = Controller.create(BaseController, {
  __title__: function() {
    return 'Login';
  },

  __body__: function() {
    return <div className="row">
      <div className="col-md-6">
        <h1>Login</h1>
        <LoginForm />
      </div>
    </div>;
  }
});