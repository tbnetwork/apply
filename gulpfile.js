/*global require, console, process */
/*jshint strict:false */

var css_src = 'src/css',
    css_build = 'build/css',
    js_src = 'src/js',
    js_build = 'build/js';

var gulp = require('gulp'),
    notify = require('gulp-notify'),
    autoprefix = require('gulp-autoprefixer'),
    sass = require('gulp-ruby-sass'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglifyjs'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    crypto = require('crypto'),
    glob = require('glob'),
    replace = require('replace')

gulp.task('livereload', function() {
    var server = livereload();

    gulp.watch([
            'build/**',
            'index.html'
        ]).on('change', function(file) {
            server.changed(file.path);
        });
});

gulp.task('watch', function() {
    var process;
    function spawnChildren(e) {
        if(process) { process.kill(); }
        process = spawn('gulp', ['watching-task'], {stdio: 'inherit'});
    }

    gulp.watch('gulpfile.js', spawnChildren);
    spawnChildren();
});

gulp.task('watching-task', ['livereload'], function(){
    notify({
        title: "Gulp is watching...",
        message: "Don't forget to enable the LiveReload browser plugin."
    });
    gulp.watch(css_src + '/**/*.scss', ['css']);
    gulp.watch(js_src + '/**/*.js', ['js']);
});

gulp.task('css', ['build-css', 'update-css-cache-buster']);

gulp.task('update-css-cache-buster', ['build-css'], function (cb) {
    var css_hash = crypto.createHash('md5').update(
        fs.readFileSync('build/css/styles.css', 'utf8')
    ).digest("hex");

    glob('index.html', function(err, files) {
        if (err) { throw err; }

        files.forEach(function(item, index, array) {
              replace({
                  regex: 'href=[\"\']build\/css\/styles\.css.*[\"\']',
                  replacement: 'href="build/css/styles.css?ver=' + css_hash + '"',
                  paths: [item],
                  recursive: true,
                  silent: true
              });
        });

        cb(err);
    });
});

gulp.task('build-css', function() {
    return gulp.src(css_src + '/styles.scss')
        .pipe(sass({sourcemap: true, style: 'compact'}))
        .pipe(autoprefix('last 10 version'))
        .pipe(gulp.dest(css_build))
        .pipe(notify("CSS built"));
});

gulp.task('js', ['build-js', 'update-js-cache-buster']);

gulp.task('update-js-cache-buster', ['build-js'], function (cb) {
    var js_hash = crypto.createHash('md5').update(
        fs.readFileSync('build/js/main.js', 'utf8')
    ).digest("hex");

    glob('index.html', function(err, files) {
        if (err) { throw err; }

        files.forEach(function(item, index, array) {
              replace({
                  regex: 'src=[\"\']build\/js\/main\.js.*[\"\']',
                  replacement: 'src="build/js/main.js?ver=' + js_hash + '"',
                  paths: [item],
                  recursive: true,
                  silent: true
              });
        });

        cb(err);
    });
});

gulp.task('build-js', function() {
    return gulp.src([
            js_src + '/jquery.min.js',
            js_src + '/moment.js',
            js_src + '/pikaday.js',
            js_src + '/pikaday.jquery.js',
            js_src + '/parsley.min.js',
            js_src + '/jquery-ui-autocomplete.js',
            js_src + '/jquery.select-to-autocomplete.min.js',
            js_src + '/universities.js',
            js_src + '/scripts.js'
        ])
        .pipe(uglify('main.js', {
            outSourceMap: 'main.js.map',
            basePath: '',
            compress: {
                drop_console: false,
                drop_debugger: false,
                dead_code: false
            }
        }))
        .pipe(gulp.dest(js_build))
        .pipe(notify('Javascript built'));
});

gulp.task('clean', function() {
    return gulp.src([
            css_build + '/**/*',
            js_build + '/**/*'
        ], {read: false})
        .pipe(clean());
});

gulp.task('build', ['clean', 'css', 'js']);
