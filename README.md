###Core scripts to use [UglifyJS](https://github.com/mishoo/UglifyJS, "UglifyJS") in the command line without NodeJS.###

####Currently supports options:####
	-b //Beautify
	-is //Indent start (applies to beautification only)
	-il //Indent level (applices to beautifcation only)
	-o //Output file

####Current Issues####
* No file checks
* **Must** supply output file
* Currently will always overwrite selected output file