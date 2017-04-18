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
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var merge = require('merge-stream');

var SOURCEPATHS = {
    sassSource: 'src/scss/*.scss',
    htmlSource: 'src/*.html',
    jsSource: 'src/js/**'
};

var APPPATH = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js',
    fonts: 'app/fonts'
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

// SASS + merge with bootstrapCSS
gulp.task('sass', function() {
    var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    var sassFiles;

    sassFiles = gulp.src(SOURCEPATHS.sassSource)
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions));

    return merge(bootstrapCSS, sassFiles)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(APPPATH.css));
});

// Move fonts bootstrap folder into app
gulp.task('moveFonts', function(){
    gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest(APPPATH.fonts));
});

// Copy JavaScript + clean js files from app/js folder
gulp.task('scripts', ['clean-scripts'], function(){
    gulp.src(SOURCEPATHS.jsSource)
        .pipe(concat('main.js'))
        .pipe(browserify())
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
gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts', 'moveFonts'], function() {
    gulp.watch([SOURCEPATHS.sassSource], ['sass']);
    gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
    gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});

// Default
gulp.task('default', ['watch']);