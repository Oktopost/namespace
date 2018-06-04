constfs      = require('fs');
const path   = require('path');
const gulp   = require('gulp');
const wrap   = require('gulp-wrap');
const rename = require('gulp-rename');

const TEMP_BUILD_DIRECTORY    = 'bin';
const NAMESPACE_SRC           = 'src/Namespace.js';
const NAMESPACE_TEMPLATE      = 'build/namespace.wrap.js.template';
const NAMESPACE_JS_BUILD_NAME = 'namespace.web.js';


const Build = {
	buildWebNamespace: function ()
					{
						gulp.src(NAMESPACE_SRC)
						.pipe(wrap({src: NAMESPACE_TEMPLATE}))
						.pipe(rename(NAMESPACE_JS_BUILD_NAME))
						.pipe(gulp.dest(TEMP_BUILD_DIRECTORY));
					}
};


gulp.task('build', Build.buildWebNamespace);