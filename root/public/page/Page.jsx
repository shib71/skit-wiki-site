'use strict';

var Controller = skit.platform.Controller;
var BackendAPI = library.BackendAPI;
var BaseController = library.BaseController;
var navigation = skit.platform.navigation;
var Utils = library.Utils;
var Page = library.JSX.Page;
var PageIndex = library.JSX.PageIndex;
var Messages = library.JSX.Messages;
var Q = library.thirdparty.kew;

// Specifying BaseController here makes BaseController the parent Controller:
// It modify our body HTML, title, etc. See that module for more information.
module.exports = Controller.create(BaseController, {
  __preload__: function(onLoaded) {
    // This is where you load any data necessary for the initial page render.
    // net.send() works from the client and server, exactly the same way.
    this.session = BackendAPI.getSession();

    if (!this.session.ok) {
      Utils.setRedirect(navigation.relativeUrl());
      navigation.navigate("/login");
      onLoaded();
      return;
    }

    var query = navigation.query();

    this.messages = [];
    this.pages = [];
    this.page = [];

    var deferPages = Q.defer(), deferPage = Q.defer();
    BackendAPI.getPages(deferPages.makeNodeResolver());
    BackendAPI.getPage(query["id"], deferPage.makeNodeResolver());
    Q.all([
      deferPages.promise, 
      deferPage.promise 
    ]).fail(function (e) {
      this.messages = e.split("\n").map(function(e){ 
        return {type:"danger", text:e}; 
      });
    }.bind(this)).then(function (results) {
      this.pages = results[0].items || [];
      this.page = results[1];
    }.bind(this)).fin(function () {
      onLoaded();
    });
  },

  __title__: function() {
    return this.page.title;
  },

  __body__: function() {
    return <div>
      <div className="row">
        <div className="col-md-12">
          <h1>{this.page.title}</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <Messages messages={this.messages} />
          <Page page={this.page} />
        </div>
        <div className="col-md-4">
          <PageIndex pages={this.pages} />
        </div>
      </div>
    </div>;
  }
});