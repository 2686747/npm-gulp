#!/bin/sh
mkdir webapp
mkdir webapp/sass
mkdir webapp/app

touch gulpfile.js
touch webapp/index.html

npm install -D \
  gulp \
  gulp-clean \
  gulp-concat \
  gulp-connect \
  gulp-htmlhint \
  gulp-inject \
  gulp-jshint \
  gulp-livereload \
  gulp-open \
  gulp-sass \
  gulp-watch \
  jshint-stylish \
  tiny-lr
