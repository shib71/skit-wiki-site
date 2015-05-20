var cookies = skit.platform.cookies;
var navigation = skit.platform.navigation;

module.exports = {
	setRedirect : function(url){
		cookies.set("REDIRECT", url);
	},
	followRedirect : function(default_url, enforce_relative){
		var redirect_url = cookies.get("REDIRECT") || default_url;
		cookies.set("REDIRECT", null);

		if (enforce_relative && redirect_url.search(/^\/([^\/]|$)/) === -1){
			this.log("warning", "not a relative url: "+redirect_url);
		}
		navigation.navigate(redirect_url);
	},

	log : function(type, message){
		if (!console){
			return;
		}

		switch (type){
			case "debug":
				console.log(message);
				break;
			case "info":
				console.info(message);
				break;
			case "warning":
				console.warn(message);
				break;
			case "error":
				console.error(message);
				break;
		}
	}
}