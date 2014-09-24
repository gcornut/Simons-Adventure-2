//HTML5 cache manifest for production environnement
module.exports = function(app, path, folders) {
	
	var fileIgnore = function(name) {
	    return (
	    	name.trim().match(/\/\.\w+$/) != null
	    	|| name.trim().match(/error/) != null
	    	|| name.trim().match(/\/\-.*$/) != null
	    	|| name.trim().match(/\.psd$/) != null
	    	|| name.trim().match(/\.sbx$/) != null
	    );
	}
	
	app.use(require('connect-cache-manifest')({
	    manifestPath: "/site.manifest",
	    files: [{
	    	file: path.join(folders.public, 'favicon.ico'),
	    	path: "/favicon.ico"
	    }, {
	    	file: path.join(folders.public, 'index.css'),
	    	path: "/index.css"
	    }, {
	    	dir: path.join(folders.public, 'js'),
	    	prefix: "/js/",
	    	ignore: fileIgnore
	    }, {
	    	dir: path.join(folders.public, 'img'),
	    	prefix: "/img/",
	    	ignore: fileIgnore
	    }, {
	    	dir: path.join(folders.public, 'map'),
	    	prefix: "/map/",
	    	ignore: fileIgnore
	    }, {
	    	dir: path.join(folders.public, 'sfx'),
	    	prefix: "/sfx/",
	    	ignore: fileIgnore
	    }/*, {
	    	file: path.join(folders.views, "index.ejs"),
	    	path: "/"
	    }*/],
	    networks: ["*"],
	    fallbacks: []
	}));	
}
