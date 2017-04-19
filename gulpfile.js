var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var autoprefixer = require('gulp-autoprefixer');
var autoprefixerOptions = {
    browsers: ['last 3 versions', '> 5%'],
    cascade: false
};

var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

var clean = require('gulp-clean');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var merge = require('merge-stream');

var injectPartials = require('gulp-inject-partials');
var minify = require('gulp-minify');

var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');

var SOURCEPATHS = {
    sassSource: 'src/scss/*.scss',
    htmlSource: 'src/*.html',
    htmlPartialSource: 'src/partial/*.html',
    jsSource: 'src/js/**',
    imgSource: 'src/img/**'
};

var APPPATH = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js',
    fonts: 'app/fonts',
    img: 'app/img'
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

// ImageMin
gulp.task('images', function(){
    return gulp.src(SOURCEPATHS.imgSource)
        .pipe(newer(APPPATH.img))
        .pipe(imagemin())
        .pipe(gulp.dest(APPPATH.img));
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

/* Production tasks
= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =*/
// Minify javaScript file (task à exécuter manuellement si besoin)
gulp.task('compress', function(){
    gulp.src(SOURCEPATHS.jsSource)
        .pipe(concat('main.js'))
        .pipe(browserify())
        .pipe(minify())
        .pipe(gulp.dest(APPPATH.js))
});

// SASS + merge with bootstrapCSS
gulp.task('compresscss', function() {
    var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    var sassFiles;

    sassFiles = gulp.src(SOURCEPATHS.sassSource)
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions));

    return merge(bootstrapCSS, sassFiles)
        .pipe(concat('app.css'))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(APPPATH.css));
});

// Html minify
gulp.task('minifyHtml', function(){
    gulp.src(SOURCEPATHS.htmlSource)
        .pipe(injectPartials())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(APPPATH.root))
});

/* End Production tasks
 = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =*/

// Html
gulp.task('html', function(){
    gulp.src(SOURCEPATHS.htmlSource)
        .pipe(injectPartials())
        .pipe(gulp.dest(APPPATH.root))
});

// Copy html + clean HTML files from app folder
/*gulp.task('copy', ['clean-html'], function(){
    gulp.src(SOURCEPATHS.htmlSource)
        .pipe(gulp.dest(APPPATH.root))
});*/

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
gulp.task('watch', ['serve', 'sass', 'html', /*'copy',*/ 'clean-html', 'clean-scripts', 'scripts', 'moveFonts', 'images'], function() {
    gulp.watch([SOURCEPATHS.sassSource], ['sass']);
    // gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
    gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
    gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['html']);
});

// Default
gulp.task('default', ['watch']);

// Production tasks
gulp.task('production', ['compress', 'compresscss', 'minifyHtml']);