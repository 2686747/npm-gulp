'use strict';

var babelify = require("babelify");
var browserify = require('browserify');
var clean = require('gulp-clean')
var concat = require('gulp-concat')
var connect = require('gulp-connect');
var gulp = require('gulp');
var gutil = require('gulp-util');
var htmlhint = require('gulp-htmlhint');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');
var open = require('gulp-open');
var sass = require('gulp-sass');
var stylish = require('jshint-stylish');
var vinyl = require('vinyl-source-stream')
var watch = require('gulp-watch');
var server = lr();

var webapp = './webapp';
var sassFiles = webapp + '/sass/**/*.scss';
var jsFiles = webapp + '/app/**/*.js'
var htmlFiles = webapp + '/**/*.html';
var target = './target';
var trgJs = '/js';
var trgCss = '/css';

var port = 8888;
var browser = 'firefox';
gulp.task('sass', function() {
    return gulp.src(sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(target + trgCss));
});
gulp.task('js', function() {
    return  browserify(webapp + '/app/app.js')
    .transform("babelify", {
        presets: ["es2015"],
        plugins: ['inferno', 'syntax-jsx']
    })
    .bundle()
        .pipe(vinyl('bundle.js'))
        .pipe(gulp.dest(target));
});
gulp.task('html', function() {
    return gulp.src(htmlFiles)
        .pipe(htmlhint())
        .pipe(htmlhint.failReporter());
});

gulp.task('build', ['sass', 'html', 'js']);

gulp.task('index', ['build'], function() {
    var html = gulp.src(webapp + '/index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src([target + '/bundle.js', target + trgCss + '/**/*.css'], {
        read: false
    });
    return html.pipe(inject(sources, {
            ignorePath: '/target/'
        }))
        .pipe(gulp.dest(target)).pipe(connect.reload());
});

gulp.task('watch',  function() {
    watch([sassFiles, jsFiles, htmlFiles], function(event) {
        gulp.start('index');
    });
});

gulp.task('connect', function() {
    connect.server({
        root: 'target',
        livereload: true,
        port: port
    });
});

gulp.task('clean', function() {
    return gulp.src(target + '/**', {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

gulp.task('app', function() {
    var options = {
        uri: 'localhost:' + port,
        app: browser
    };
    gulp.src(__filename)
        .pipe(open(options));
});

gulp.task('default', ['connect', 'index', 'watch'], function() {
    gulp.start('app');
});
