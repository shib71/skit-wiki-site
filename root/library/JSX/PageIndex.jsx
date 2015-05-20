module.exports = React.createClass({
  getPageLink : function(page, index){
    return <li key={"page-"+index}><a href={page.title==="Home" ? "/" : "/page?id="+page.title}>{page.title}</a></li>;
  },

  render : function(){
    return <ul>{this.props.pages.map(this.getPageLink)}</ul>;
  }
});
