# workflow
Workflow with NPM, SASS, GULP and More :

1 - Créer un new project "workflow" sur github

2 - Cloner "workflow" de github

3 - cd workflow

4 - git init

5 - npm init => package.json


6 - Installing Gulp and Gulp SASS as dependencies in our project

    npm i —save-dev gulp gulp-sass

    - - - - Créer ensuite gulpfile.js - - - -

    Mettre à jour workflow sur github :
    git add .
    git commit -m "gulp gulp-sass gulpfile.js added"
    git push -u origin master


7 - Créer une premiere task "sass" :


    - - - - gulp file.js - - - - -
    var gulp = require('gulp'); 
    var sass = require('gulp-sass'); 

    gulp.task('sass', function() { 
      return gulp.src('src/scss/app.scss') 
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) 
      .pipe(gulp.dest('app/css')); 
    });   

    gulp.task('default', ['sass']);


= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

    Lancer les tasks :

    => Dans terminal, entrer la commande gulp pour lancer le compilateur sass

= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =



8 - Installer BrowserSync + task (gulp) watch correspondant :

    npm i —save-dev browser-sync
    // yarn add -D browser-sync


    - - - - gulp file.js - - - -

    var gulp = require('gulp'); 
    var sass = require('gulp-sass');  
    var browserSync = require('browser-sync'); 
    var reload = browserSync.reload;  

    var SRCPATHS = { 
      sassSrc : 'src/scss/*.scss' 
    };  

    var APPPATH = { 
      root: 'app/', 
      css : 'app/css', 
      js: 'app/js' 
    };  


    // SASS 
    gulp.task('sass', function() { 
      return gulp.src(SRCPATHS.sassSrc) 
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) 
        .pipe(gulp.dest(APPPATH.css)); 
    });  

    // BROWSER-SYNC: 'server' + 'sass' 
    gulp.task('serve', ['sass'], function () { 
      browserSync.init([APPPATH.css + '*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], { 
        server: { 
          baseDir: APPPATH.root, 
          directory: false 
        }, 
        open: true 
      }); 
    });  

    // WATCH 
    gulp.task('watch', ['serve', 'sass'], function () { 
      gulp.watch([SRCPATHS.sassSrc], ['sass']);  
    });  

    // DEFAULT TASK 
    gulp.task('default', ['watch'] );



9 - Auto Prefixer

    npm install —save-dev gulp-autoprefixer
    // yarn add -D gulp-autoprefixer

    - - - - - gulp file.js - - - -

    . . .

    var autoprefixer = require('gulp-autoprefixer'); 
    var autoprefixerOptions = { 
      browsers: ['last 3 versions', '> 5%'], 
      cascade: false 
    };


    // SASS 
    gulp.task('sass', function() { 
      return gulp.src(SOURCEPATHS.sassSource)
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) 
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(APPPATH.css)); 
    });

    . . . 



10 - Copy HTML files

     - - - - gulpfile.js - - - -
       . . .

       var SOURCEPATHS = { 
         sassSource: 'src/scss/*.scss', 
         htmlSource: 'src/*.html' 
       };

       // Copy html 
       gulp.task('copy', function() { 
         gulp.src(SOURCEPATHS.htmlSource) 
           .pipe(gulp.dest(APPPATH.root))
       });

       // Watch 
       gulp.task('watch', ['serve', 'sass', 'copy'], function() { 
         gulp.watch([SOURCEPATHS.sassSource], ['sass']); 
         gulp.watch([SOURCEPATHS.htmlSource], ['copy']); 
       });

       . . .




11 - Clean HTML files

    npm install --save-dev gulp-clean

    - - - - gulpfile.js - - - -

    var clean = require('gulp-clean');
    // Clean HTML files
    gulp.task('clean-html', function () {
        return gulp.src(APPPATH.root + '/*.html', { read: false, force: true })
            .pipe(clean())
    });

    // Watch
    gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html'], function() {
        gulp.watch([SOURCEPATHS.sassSource], ['sass']);
        gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
    });


12 - Copy &  clean JavaScript files

    - - - - gulpfile.js - - - -

    var SOURCEPATHS = {
        sassSource: 'src/scss/*.scss',
        htmlSource: 'src/*.html',
        jsSource: 'src/js/**'
    };

    // Clean JavaScript files
    gulp.task('clean-scripts', function() {
        return gulp.src(APPPATH.js + '/*.js', {read: false, force: true})
            .pipe(clean());
    });

    // Copy JavaScript + clean js files from app/js folder
    gulp.task('scripts', ['clean-scripts'], function(){
        gulp.src(SOURCEPATHS.jsSource)
            .pipe(gulp.dest(APPPATH.js))
    });

    // Watch
    gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts'], function() {
        gulp.watch([SOURCEPATHS.sassSource], ['sass']);
        gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
        gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
    });


13 - Concatenation JS Files

     npm install --save-dev gulp-concat

     - - - - gulpfile.js - - - -

     var concat =  require('gulp-concat');

     // Copy JavaScript + clean js files from app/js folder
     gulp.task('scripts', ['clean-scripts'], function(){
         gulp.src(SOURCEPATHS.jsSource)
             .pipe(concat('main.js')
             .pipe(gulp.dest(APPPATH.js))
     });







