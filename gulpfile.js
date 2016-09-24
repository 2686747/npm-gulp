'use strict';

var clean = require('gulp-clean')
var concat = require('gulp-concat')
var connect = require('gulp-connect');
var gulp = require('gulp');
var htmlhint = require("gulp-htmlhint");
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');
var open = require('gulp-open');
var sass = require('gulp-sass');
var stylish = require('jshint-stylish');
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
        .pipe(gulp.dest(target + trgCss))
        .pipe(connect.reload());
});
gulp.task('js', function() {
    gulp.src([jsFiles])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        // .pipe(jshint.reporter('fail'))
        .pipe(concat('index.js'))
        .pipe(gulp.dest(target + trgJs))
        .pipe(connect.reload());
});
gulp.task('html', function() {
    gulp.src(htmlFiles)
        .pipe(htmlhint())
        .pipe(htmlhint.failReporter())
        .pipe(connect.reload());
});

gulp.task('build', ['sass', 'js', 'html']);

gulp.task('index', ['build'], function() {
    console.log('index rebuilded');
    var html = gulp.src(webapp + '/index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src([target + trgJs + "/**/*.js", target + trgCss + "/**/*.css"], {
        read: false
    });
    return html.pipe(inject(sources, {
            ignorePath: '/target/'
        }))
        .pipe(gulp.dest(target));
});

gulp.task('watch', function() {
    watch([sassFiles, jsFiles, htmlFiles], function(event) {
        gulp.start('index');
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
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
    return gulp.src(target + "/**", {
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

gulp.task('default', ['watch', 'index', 'connect', 'app']);
