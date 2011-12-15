var require = (function() {
    var cached = {};
    var currentPath = java.lang.System.getProperty('user.dir');
    var paths = [currentPath,];

    function normalize(id) {
		var file;
        id = id + '.js';

        if (/^\.\.?/.test(id)) {
            file = new java.io.File(currentPath, id);
            if (file.isFile()) {
                return file.toURL();
            }
        } else {
            for (var i = 0, len = paths.length; i < len; ++i) {
                file = new java.io.File(paths[i], id);
                if (file.isFile()) {
                    return file.toURL();
                }
            }
        }
        return undefined;
    };
    
    function read(connection) {
        var stream = connection.getInputStream();
        var bytes = java.lang.reflect.Array.newInstance(
                java.lang.Byte.TYPE, 4096);
        var bytesStream = new java.io.ByteArrayOutputStream();
        var bytesRead;
        while ((bytesRead = stream.read(bytes)) >= 0) {
            if (bytesRead > 0) {
                bytesStream.write(bytes, 0, bytesRead);
            }
        }
        return String(bytesStream.toString());
    };
    
    function require(id) {
        var url = normalize(id);
        print(url);
        if (!url) {
            throw new Error("couldn't find module \"" + id + "\"");
        }
        id = String(url.toString());
        if (!cached.hasOwnProperty(id)) {
            var source = read(url.openConnection());
            source = source.replace(/^\#\!.*/, '');
            source = (
                "(function (require, exports, module) { " + source + "\n});");
            cached[id] = {
                exports: {},
                module: {
                    id: id,
                    uri: id
                }
            };
            var previousPath = currentPath;
            try {
                currentPath = id.substr(0, id.lastIndexOf('/')) || '.';
                var ctx = org.mozilla.javascript.Context.getCurrentContext();
                var func = ctx.evaluateString({}, source, id, 1, null);
                func(require, cached[id].exports, cached[id].module);
            } finally {
                currentPath = previousPath;
            }
        }

        return cached[id].exports;
    };
    
    require.paths = paths;
    
    return require;
}());
var __argv__ = arguments;

function uglify(orig_code, options){
  	options || (options = {});
  	var jsp = uglify.parser,
  		pro = uglify.uglify,
  		output = '',
	 	ast = jsp.parse(orig_code, false);

  	if(options.beautify) {
    	output = pro.gen_code(ast, options);
  	} else {
  	  	output = pro(ast);
  	}

  	return output;
};

uglify.parser = require("parse-js");
uglify.uglify = require("process");

module.exports = uglify;

var output_file = undefined;

if(__argv__ && __argv__.length) {

	var src = readFile(__argv__[__argv__.length-1]),
		output = undefined,
		b = false,
		is = 0,
		il = 4;
		uargs = {};

	for(var i = 0; i < __argv__.length; i++) {
		var cur = __argv__[i];

		switch(cur) {
			case '-b':
				uargs.beautify = true;
			break;
			case '-is':
				uargs.indent_start = __argv__[++i];
			break;
			case '-il':
				uargs.indent_level = __argv__[++i];
			break;
			case '-o':
				output_file = __argv__[++i];
			break;
		}
	}
	
	importPackage(java.io);
	var output_file = new java.io.FileWriter(output_file);
	output_file.write(uglify(src,uargs));
}