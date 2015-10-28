/*
 * Olive.js - a tiny light javascript micro web application framework
 *
 * @version version 1.0.0
 * @license MIT license
 * @author	Mohammed Al Ashaal, "alash3al.xyz, alash3al@github"
 */
function Olive(cb) {

	// construct a new instance if not yet
	if ( ! (this instanceof Olive) ) {
		return new Olive(cb)
	}

	// our 'this' reference
	self = this

	// default configurations
	self.config = {
		base: "/",
		filename: "index.html",
		use: "auto",
		e404: function(){ console.log("404 object not found") }
	}

	// a list of registered routes
	var routes = []

	// returns the current state "query + path"
	var current = function() {
		if ( (["auto", "pushState"].indexOf(self.config.use) > -1) && window.history.pushState ) {
			self.config.use = "pushState"
		}
		else {
			self.config.use = "hash"
		}
		if ( self.config.use == "hash" ) {
			parts = window.location.hash.split("?", 2)
			path = ( "/" + (parts[0].replace(/^\/|\/$/g, "/").replace(/^#!/g, "")) + "/" ).replace(/\/+/g, "/")
		}
		else {
			base = new RegExp(self.config.base.replace(/^\/|\/$/g, "").replace(/\/+/g, "/").replace(/\//g, "\\/"), "g")
			filename = new RegExp(self.config.filename.replace(/^\/|\/$/g, "").replace(/\/+/g, "/").replace(/\//g, "\\/"), "g")
			parts = [window.location.pathname, window.location.search.replace("?", "")]
			path = ( "/" + (parts[0].replace(/^\/|\/$/g, "/").replace(filename, "").replace(base, "")) + "/" ).replace(/\/+/g, "/")
		}
		return {
			path: path,
			query: (function(){
				q = (parts[1] || "").split("&").map(function(element){
					element = element.split("=", 2)
					return {
						key: element[0],
						value: element[1]
					}
				})
				map = {}
				for ( var i = 0; i < q.length; ++ i ) {
					map[q[i].key] = q[i].value
				}
				return map
			})()
		}
	}

	/*
	 * select html element(s) just like jQuery
	 *
	 * @param	string|object	selector
	 * @param	bool			all
	 * @return 	object
	 */
	self.select = function(selector, all) {
		if ( all ) {
			return (typeof selector === "object") ? selector : window.document.querySelectorAll(selector)
		}
		else {
			return (typeof selector === "object") ? selector : window.document.querySelector(selector)
		}
	}

	/*
	 * Handle a route
	 *
	 * @param	string		string
	 * @param	callback	cb
	 * @return 	self
	 */
	self.on = function(pattern, cb) {
		routes.push({
			pattern: ("/" + (pattern.replace(/^\/|\/$/g, "")) + "/").replace(/\/+/g, "/").replace(/\//g, "\\/"),
			cb: cb
		})
		return self
	}

	/*
	 * Redirect to a virtual path
	 *
	 * @param	string	string
	 * @param	string	title
	 * @return 	self
	 */
	self.go = function(path, title) {
		path = path.replace(/^\/#!/, "").replace(/\/$/, "").replace(/\/+/g, "/")
		if ( this.config.use == "hash" ) {
			path = ("!/" + path).replace(/\/+/g, "/")
			window.location.hash = path
			window.document.title = title || window.document.title
		}
		else {
			window.history.pushState({}, title, path)
			if ( ((self.config.use == "auto") || (self.config.use == "pushState")) && window.history.pushState ) {
				self.dispatch()
			}
		}
		return self
	}

	/*
	 * Returns a template compiled with the specified data "vars"
	 *
	 * @param	string	src
	 * @param	object	title
	 * @return 	string
	 */
	self.tpl = function(src, data) {
		data = data || {}
		for ( var k in data ) {
			src = src.replace(new RegExp("{{" + k + "}}", "ig"), data[k])
		}
		return src
	}

	/*
	 * Run all routes, this is used by 'window.onhashchange' & 'window.onpopstate'
	 *
	 * @return 	self
	 */
	self.dispatch = function() {
		for ( var i = 0; i < routes.length; ++ i ) {
			route = routes[i]
			match = self.path.match(new RegExp("^" + route.pattern + "$"))
			if ( match ) {
				match.shift()
				route.cb.apply(self, match)
				return self
			}
		}
		self.config.e404.apply(self, [])
		return self
	}

	// a getter for 'path' to return the current path
	self.__defineGetter__("path", function(){
		return current().path
	})

    // a getter for 'query' to return the current query
	self.__defineGetter__("query", function(){
		return current().query
	})

	// globalize the olive variable
	window.Olive = window.olive = self

	// wait everything to be loaded
	window.onload = function() {
		cb && cb.apply(self)
		self.dispatch()
	}

	// listen on hashchange
	if ( (self.config.use == "hash") || (! window.history.pushState) ) {
		window.onhashchange = function() {
			self.dispatch()
		}
	}

	// listen on popstate
	else if ( ((self.config.use == "pushState") || (self.config.use == "auto")) && (window.history.pushState) ) {
		console.log("sss")
		window.onpopstate = function() {
			self.dispatch()
		}
	}
}
