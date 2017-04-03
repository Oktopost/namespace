'use strict';


const gulp		= require('gulp');
const wrap		= require('gulp-wrap');
const rename	= require('gulp-rename');
const replace	= require('gulp-string-replace');


gulp.task('test', () => {
	console.log('Gulp works!');
});

gulp.task('build-web', () => {
	return gulp.src('./src/Namespace.js')
		
		// Delete module.export
		.pipe(replace(/module\.exports = Namespace/, 'window.Namespace = Namespace'))
		
		// Wrap in a function.
		.pipe(wrap({src: './gulp/web/web.js.template'}))
		
		// Save
		.pipe(rename('namespace.js'))
		.pipe(gulp.dest('./web'))
});

gulp.task('build', ['build-web'], () => {
	
});