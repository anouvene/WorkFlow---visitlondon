# workflow
# Pré-requis - Assurez-vous d'avoir installé :
+ [node.js] (http://nodejs.org)
+ [git] (http://git-scm.com/)
+ [gulp] (http://gulpjs.com/)
+ Run `npm install` # pour installer les dépendances du projet

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


14 - Adding Browserify, Bootstrap, Mustache and jQuery

    npm i --save-dev gulp-browserify jquery mustache bootstrap

    - - - - gulpfile.js - - - -
    var browserify = require('gulp-browserify');

    // Copy JavaScript + clean js files from app/js folder
    gulp.task('scripts', ['clean-scripts'], function(){
        gulp.src(SOURCEPATHS.jsSource)
            .pipe(concat('main.js'))
            .pipe(browserify())
            .pipe(gulp.dest(APPPATH.js))
    });

    // Test :
    Dans src > js > scripts.js
    Entrer les lignes de code suivantes :

    global.jQuery = require('jquery');
    bootstrap = require('bootstrap');
    mustache = require('mustache');

    Puis voir les changements dans app > js > main.js
    Nous obtenons en effet une concaténation de différentes librairies.

15 - Joindre bootstrapCSS & SCSS en un seul fichier avec merge-stream
    
    npm i --save-dev merge-stream
    
    - - - - gulpfile.js - - - -
    var merge = require('merge-stream');
    
    // SASS + merge with bootstrapCSS
    gulp.task('sass', function() {
        var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
        var sassFiles;
    
        sassFiles = gulp.src(SOURCEPATHS.sassSource)
            .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
            .pipe(autoprefixer(autoprefixerOptions));
    
        return merge(sassFiles, bootstrapCSS)
            .pipe(concat('app.css'))
            .pipe(gulp.dest(APPPATH.css));
    });
    
16 - EXAMPLE: tester Bootstrap & jQuery avec un Caroussel    
    
    Se rendre sur le site http://getbootstrap.com/javascript/#carousel
    Puis copier/coller le code html du carousel dans le fichier src > index.html et observer

17 - Copier le dossier fonts de bootstrap dans notre workflow

    - - - - gulpfile.js - - - -
    var APPPATH = {
        root: 'app/',
        css: 'app/css',
        js: 'app/js',
        fonts: 'app/fonts'
    };
    
    // Move fonts bootstrap folder into app
    gulp.task('moveFonts', function(){
        gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
            .pipe(gulp.dest(APPPATH.fonts));
    });
    
    // Watch
    gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts', 'moveFonts'], function() {
        gulp.watch([SOURCEPATHS.sassSource], ['sass']);
        gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
        gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
    });
    
18 - JSON & Mustache library

    // In scripts.js file :
    mustache = require('mustache');
    
    $(function($){
        var jqxhr = $.getJSON('data.json', function(){
    
        }).done(function(data){
           var template = $('#template').html();
           var showTemplate = mustache.render(template, data);
           $('#gallery').html(showTemplate);
        });
    });
    
    // In index.html file
    <!--Mustache template-->
    <h3>Gallery with Mustache template</h3>
    <div id="gallery" class="gallery"></div>

    <script id="template" type="x-tmpl-mustache">
        {{#gallery}}
            <div class="col-sm-6 col-md-6">
                <div class="thumbnail">
                    <img src="img/visit/{{image}}" alt="">
                </div>
                <div class="caption">
                    <h3 class="text-center">{{destiny}}</h3>
                </div>
            </div>
        {{/gallery}}
    </script>
    
    
    19 - Image minification
    
    npm installe --save-dev gulp-newer gulp-imagemin
    
     - - - - gulpfile.js - - - -
     
    var newer = require('gulp-newer');
    var imagemin = require('gulp-imagemin');
    
    var SOURCEPATHS = {
        sassSource: 'src/scss/*.scss',
        htmlSource: 'src/*.html',
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
    
    // ImageMin
    gulp.task('images', function(){
        return gulp.src(SOURCEPATHS.imgSource)
            .pipe(newer(APPPATH.img))
            .pipe(imagemin())
            .pipe(gulp.dest(APPPATH.img));
    });
    
    // Watch
    gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts', 'moveFonts', 'images'], function() {
        gulp.watch([SOURCEPATHS.sassSource], ['sass']);
        gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
        gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
    });
    

 19 - Adding HTML partials
 
    npm i --save-dev gulp-inject-partials
     
    - - - - gulpfile.js - - - -
    
    var injectPartials = require('gulp-inject-partials');
    var SOURCEPATHS = {
        sassSource: 'src/scss/*.scss',
        htmlSource: 'src/*.html',
        htmlPartialSource: 'src/partial/*.html',
        jsSource: 'src/js/**',
        imgSource: 'src/img/**'
    };
    
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
    
    // Watch
    gulp.task('watch', ['serve', 'sass', 'html', /*'copy',*/ 'clean-html', 'clean-scripts', 'scripts', 'moveFonts', 'images'], function() {
        gulp.watch([SOURCEPATHS.sassSource], ['sass']);
        // gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
        gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
        gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['html']);
    });
    
    // In the src > index.html
    
    <!-- partial:partial/_header.html -->
    <!-- partial -->
    
        <div>The body of index.html</div>
            
    <!-- partial:partial/_footer.html -->
    <!-- partial -->
    
    
20 -  Adding JavaScript Minification

    npm i --save-dev gulp-minify
    
    - - - - gulpfile.js - - - -
    
    var minify = require('gulp-minify');
    
    // Minify javaScript file
    gulp.task('compress', function(){
        gulp.src(SOURCEPATHS.jsSource)
            .pipe(concat('main.js'))
            .pipe(browserify())
            .pipe(minify())
            .pipe(gulp.dest(APPPATH.js))
    });
    
    // Penser ensuite à exécuter la tâche "gulp compress" manuellement si besoin


21 - Adding CSS Minification

    npm i --save-dev gulp-cssmin
    npm i --save-dev gulp-rename
    
    - - - - gulpfile.js - - - -
    
    var cssmin = require('gulp-cssmin');
    var rename = require('gulp-rename');
    
    // Minify CSS
    gulp.task('compresscss', function() {
        var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
        var sassFiles;
    
        sassFiles = gulp.src(SOURCEPATHS.sassSource)
            .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
            .pipe(autoprefixer(autoprefixerOptions));
    
        return merge(bootstrapCSS, sassFiles)
            .pipe(concat('app.css'))
            .pipe(cssmin())
            .pie(rename({suffix: '.min'}))
            .pipe(gulp.dest(APPPATH.css));
    });

    // Penser ensuite à exécuter la tâche "gulp compresscss" manuellement si besoin
    
21 - Adding HTML Minification

    npm i --save-dev gulp-htmlmin
    
    - - - - gulpfile.js - - - -
    
    var htmlmin = require('gulp-htmlmin');
    
    // Html minify
    gulp.task('minifyHtml', function(){
        gulp.src(SOURCEPATHS.htmlSource)
            .pipe(injectPartials())
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest(APPPATH.root))
    });
    
    // Penser ensuite à exécuter la tâche "gulp minifyHtml" manuellement si besoin
    
    
22 - Créer une tâche de minification du CSS, JS et HTML pour la production

    gulp.task('production', ['compress', 'compresscss', 'minifyHtml']);


