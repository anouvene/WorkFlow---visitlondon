var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var autoprefixer = require('gulp-autoprefixer');
var autoprefixerOptions = {
    browsers: ['last 3 versions', '> 5%'],
    cascade: false
};

var clean = require('gulp-clean');


var SOURCEPATHS = {
    sassSource: 'src/scss/*.scss',
    htmlSource: 'src/*.html',
    jsSource: 'src/js/**'
};

var APPPATH = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js'
};

// Clean HTML files
gulp.task('clean-html', function () {
    return gulp.src(APPPATH.root + '/*.html', {read: false, force: true})
        .pipe(clean())
});

// Clean JavaScript files
gulp.task('clean-scripts', function() {
    return gulp.src(APPPATH.js + '/*.js', {read: false, force: true})
        .pipe(clean());
});

// SASS
gulp.task('sass', function() {
    return gulp.src(SOURCEPATHS.sassSource)
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(APPPATH.css));
});

// Copy JavaScript + clean js files from app/js folder
gulp.task('scripts', ['clean-scripts'], function(){
    gulp.src(SOURCEPATHS.jsSource)
        .pipe(gulp.dest(APPPATH.js))
});

// Copy html + clean HTML files from app folder
gulp.task('copy', ['clean-html'], function(){
    gulp.src(SOURCEPATHS.htmlSource)
        .pipe(gulp.dest(APPPATH.root))
});

// Browser Sync
gulp.task('serve', ['sass'], function() {
    browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
        server: {
            baseDir: APPPATH.root,
            directory: true
        }
    })
});

// Watch
gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts'], function() {
    gulp.watch([SOURCEPATHS.sassSource], ['sass']);
    gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
    gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});

// Default
gulp.task('default', ['watch']);