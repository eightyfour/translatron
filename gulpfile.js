/**
 * Gulpfile
 *
*/
var gulp = require('gulp'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber');

// Logs in the console changed files
var changeEvent = function(evt) {
    gutil.log(gutil.colors.bgRed('File'),
        gutil.colors.cyan(evt.path.replace('.', '')),
        'was',
        gutil.colors.magenta(evt.type));
};

/*
 * css task
 * Less to css & Autoprefixer & Sourcemaps
*/
gulp.task('css', function(){
    return gulp.src('lib/client/less/main.less')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: ['lib/client/less']
        }))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write(''))
        .pipe(rename("translatron.css"))
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});

// Browserify and copy js files
gulp.task('scripts', function() {
    // Single entry point to browserify
    gulp.src('lib/client/js/main.js')
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(rename("translatron.js"))
        .pipe(gulp.dest('dist/js'))
        // comment next line to deactivate the js page reload
        .pipe(livereload());
});
/*
 * watch task
 * watches less, html and mainhtml files
*/
gulp.task('watch', ['css', 'scripts'], function(){
    livereload.listen();
    gulp.watch(['lib/client/less/**/*.less'], ['css']).on('change', function(evt) {
        changeEvent(evt);
    });
    gulp.watch('lib/client/js/**/*.js', ['scripts']).on('change', function(evt) {
        changeEvent(evt);
    });
});

gulp.task('default', ['watch']);