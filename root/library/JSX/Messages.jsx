module.exports = React.createClass({
  getAlert : function(message, index){
    return <div key={"error-"+index} className={"alert alert-"+message.type} role="alert">{message.text}</div>;
  },

  render : function(){
    return <div>{this.props.messages.map(this.getAlert)}</div>;
  }
});
