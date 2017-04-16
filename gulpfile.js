var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var autoprefixer = require('gulp-autoprefixer');
var autoprefixerOptions = {
    browsers: ['last 3 versions', '> 5%'],
    cascade: false
};

var SOURCEPATHS = {
    sassSource: 'src/scss/*.scss',
    htmlSource: 'src/*.html'
};

var APPPATH ={
    root: 'app/',
    css: 'app/css',
    js: 'app/js'
};

// SASS
gulp.task('sass', function() {
    return gulp.src(SOURCEPATHS.sassSource)
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(APPPATH.css));
});

// Copy html
gulp.task('copy', function(){
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
gulp.task('watch', ['serve', 'sass', 'copy'], function() {
    gulp.watch([SOURCEPATHS.sassSource], ['sass']);
    gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
});

// Default
gulp.task('default', ['watch']);