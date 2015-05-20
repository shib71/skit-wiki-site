var BackendAPI = library.BackendAPI;
var Utils = library.Utils;
var Messages = library.JSX.Messages;

module.exports = React.createClass({
  getInitialState : function(){
    return {
      username : "",
      password : "",
      messages : []
    };
  },

  onUsernameChange : function(e){
    this.setState({username: e.target.value});
  },
  onPasswordChange : function(e){
    this.setState({password: e.target.value});
  },
  onSubmit : function(e){
    e.preventDefault();
    BackendAPI.createSessionSignature(e.target.username.value, e.target.password.value, function(err, session){
      if (err){
        this.setState({
          messages: err.split("\n").map(function(v){ return {text:v, type:"danger"}; })
        });
      }
      else {
        this.setState({
          messages: [{
            text: "Login successfull, loading application ...",
            type: "success"
          }]
        });

        Utils.followRedirect("/", true);
      }
    }.bind(this));
  },

  getAlert : function(message, index){
    return <div key={"error-"+index} className={"alert alert-"+message.type} role="alert">{message.text}</div>;
  },

  render : function() {
    return <form className="form-horizontal" onSubmit={this.onSubmit}>
      <Messages messages={this.state.messages} />
      <div className="form-group">
        <label htmlFor="inputUsername" className="col-sm-2 control-label">Username</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" id="inputUsername" name="username" defaultValue={this.state.username} onChange={this.onUsernameChange} />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="inputPassword" className="col-sm-2 control-label">Password</label>
        <div className="col-sm-10">
          <input type="password" className="form-control" id="inputPassword" name="password" defaultValue={this.state.password} onChange={this.onPasswordChange} />
        </div>
      </div>
      <div className="form-group">
        <div className="col-sm-offset-2 col-sm-10">
          <button type="submit" className="btn btn-default">Sign in</button>
        </div>
      </div>
    </form>;
  }
});