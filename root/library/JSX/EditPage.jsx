var Messages = library.JSX.Messages;
var BackendAPI = library.BackendAPI;
var navigation = skit.platform.navigation;

module.exports = React.createClass({
  getInitialState : function(){
    return {
      messages : []
    };
  },

  getActions : function(){
    var backLink = null;

    if (this.props.page.title === "Home"){
      backLink = <a href="/">Back</a>;
    }
    else {
      backLink = <a href={"/page?id="+this.props.page.title}>Back</a>
    }

    return <p>{backLink}</p>;
  },

  handleSubmit : function(e){
    e.preventDefault();

    BackendAPI.updatePage({ title:this.props.page.title, body:e.target.body.value }, function(err, page){
      if (err){
        this.setState({ messages:[{type:"danger",text:err}]});
      }
      else {
        navigation.navigate("/page?id="+this.props.page.title);
      }
    }.bind(this));
  },

  render : function(){
    return <div>
      {this.getActions()}
      <Messages messages={this.state.messages} />
      <form onSubmit={this.handleSubmit}>
        <textarea className="col-md-12" defaultValue={this.props.page.body} name="body" />
        <button type="submit">Save</button>
      </form>
    </div>;
  }
});
