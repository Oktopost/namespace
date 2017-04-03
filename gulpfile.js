'use strict';


const gulp = require('gulp');
const clean = require('gulp-clean');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const wrap = require("gulp-wrap");
const replace = require('gulp-string-replace');


gulp.task('test', () => {
	console.log('Gulp works!');
});

gulp.task('build-web', () => {
	return gulp.src('./src/Namespace.js')
		
		// Delete module.export
		.pipe(replace(/module\.exports = Namespace/, 'window.Namespace = Namespace'))
		
		// Wrap in a function.
		.pipe(wrap({src: './gulp/web/web.js.template'}))
		
		// Concat and minify.
		.pipe(concat('namespace.js'))
		.pipe(gulp.dest('./'))
		.pipe(minify())
		.pipe(gulp.dest('./'));
});

gulp.task('build', ['build-web'], () => {
	
});