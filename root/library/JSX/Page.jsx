var Messages = library.JSX.Messages;
var BackendAPI = library.BackendAPI;
var navigation = skit.platform.navigation;

module.exports = React.createClass({
  getInitialState : function(){
    return {
      messages : []
    }
  },

  handleDelete : function(){
    if (window.confirm("Are you sure you want to delete " + this.props.page.title + "?")){
      BackendAPI.deletePage(this.props.page.title, function(err, page){
        if (err){
          this.setState({ messages:[{type:"danger",text:err}]});
        }
        else {
          navigation.navigate("/");
        }
      }.bind(this));
    }
  },

  getActions : function(){
    var homeLink = null;
    var deleteLink = null;

    if (this.props.page.title !== "Home"){
      homeLink = <span><a href="/">Home</a>&nbsp;|&nbsp;</span>;
      deleteLink = <span>&nbsp;|&nbsp;<a href="#" onClick={this.handleDelete}>Delete</a></span>;
    }

    return <p>
      {homeLink} 
      <a href={"/edit?id="+this.props.page.title}>Edit</a> 
      {deleteLink}
    </p>;
  },

  render : function(){
    return <div>
      {this.getActions()}
      <Messages messages={this.state.messages} />
      <div dangerouslySetInnerHTML={{__html: this.props.page.body}} />
    </div>;
  }
});
