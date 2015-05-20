var net = skit.platform.net;
var sha = library.thirdparty.sha;
var md5 = library.thirdparty.md5;
var cookies = skit.platform.cookies;

var BACKEND_API_URL = 'http://localhost:8080';

module.exports = {
	getSessionTimeout : function(){
		var timestamp = cookies.get("BACKEND_TIMESTAMP");

		if (!timestamp) {
			return null;
		}
		if (timestamp.search(/^\d+$/) === -1) {
			return null
		}

		return parseInt(timestamp);
	},
	getSessionUsername : function(){
		return cookies.get("BACKEND_USERNAME");
	},
	getSessionSignature : function(){
		return cookies.get("BACKEND_SIGNATURE");
	},
	getNowTimestamp : function(){
		return Math.round((new Date()).getTime() / 1000);
	},
	getSession : function(){
		var response = {
			timestamp : this.getSessionTimeout(),
			username : this.getSessionUsername(),
			signature : this.getSessionSignature()
		};

		response.ok = response.timestamp && 
		              response.timestamp > this.getNowTimestamp() && 
		              response.username && 
		              response.signature;

		return response;
	},
	setSession : function(signature){
		cookies.set("BACKEND_TIMESTAMP", signature.timestamp);
		cookies.set("BACKEND_USERNAME", signature.username);
		cookies.set("BACKEND_SIGNATURE", signature.signature);
	},

	createSessionSignature : function(username, password, cb) {
		this.makeRequest(null, "POST", "/sessionsignature", { username : username, password : password }, function(err, sig){
			if (!err){
				this.setSession(sig);
			}
			cb(err, sig);
		}.bind(this));
	},
	getPages : function(cb){
		var signature = this.getSession();
		if (!signature.ok){
			cb("Session timeout");
			return;
		}
		
		this.makeRequest(signature, "GET", "/page", null, cb);
	},
	getPage : function(id, cb){
		var signature = this.getSession();
		if (!signature.ok){
			cb("Session timeout");
			return;
		}
		
		this.makeRequest(signature, "GET", "/page/" + id, null, cb);
	},
	updatePage : function(page, cb){
		var signature = this.getSession();
		if (!signature.ok){
			cb("Session timeout");
			return;
		}
		
		this.makeRequest(signature, "POST", "/page/"+page.title, page, cb);
	},
	deletePage : function(id, cb){
		var signature = this.getSession();
		if (!signature.ok){
			cb("Session timeout");
			return;
		}
		
		this.makeRequest(signature, "DELETE", "/page/"+id, null, cb);
	},

	makeRequest : function(signature, method, url, body, cb) {
		function onSuccess(response) {
			if (response.headers.Signature){
				this.setSession({
					username : response.headers.Username,
					timestamp : response.headers.Timestamp,
					signature : response.headers.Signature
				});
			}

			if (response.body.errors){
				cb(response.body.errors.join("\n"));
			} else {
				cb(null, response.body);
			}
		};
		function onError(response) {
			if (response.status && response.status >= 200 && response.status <= 299){
				onSuccess(response);
			}
			else if (response.body.errors){
				cb(response.body.errors.join("\n"));
			} else {
				cb("Unexpected error in API response: " + JSON.stringify(response));
			}
		}

		var options = {
			method: method,
			headers: {},
			success: onSuccess,
			error: onError,
			context: this
		};
		var bodyhash = "";
		var stringToSign = "";
		var shaObj = "";

		if (body){
			options.body = typeof(body) === "string" ? body : JSON.stringify(body);
			options.headers['Content-Type'] = 'application/json; charset=utf-8';
			bodyhash = md5(options.body || "");
		}

		if (signature) {
			options.headers['Username'] = signature.username;
			options.headers['Timestamp'] = signature.timestamp;
			stringToSign = method + "\n" + url + "\n" + bodyhash;
			shaObj = new sha(stringToSign, "TEXT");
			
			options.headers['Authorization'] = "HMAC " + shaObj.getHMAC(signature.signature, "TEXT", "SHA-256", "B64");
		}

		net.send(BACKEND_API_URL + url, options);
	}
};