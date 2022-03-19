/*
 npm install
 or

 npm install gulp --save-dev
 npm install gulp-less --save-dev
 npm install gulp-rename --save-dev
 npm install gulp-minify-css --save-dev
 npm install gulp-watch  --save-dev 
 npm install gulp-minify --save-dev
 * */


//set dir path as you need
var templatedir = "./";
var node_mod_dir = './node_modules/'; //for internal development, or set path as you need


var gulp      = require('gulp'),// we just install gulp in project dir and try to use other modules from a centralized node modules dir, but if you need you can install in root of your project
    less      = require('gulp-less'),
    rename    = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    watch     = require('gulp-watch'),
    minify    = require('gulp-minify');


gulp.task('compile-less', function () {
    var less_tasks = [];


    //color variation
    var variation = ["blue", "navy", "olive", "orange", "pink", "red", "violet"];
    //for style 1
    var default_less = gulp.src(templatedir + 'assets/less/style-default.less')
            .pipe(less())
            .pipe(gulp.dest(templatedir + 'assets/css/')).on('end', function () {
                var default_less2 = gulp.src(templatedir + 'assets/css/style-default.css')
                        .pipe(minifyCss().on('error', function (err) {
                            console.log(err);
                        }))
                        .pipe(rename({suffix: '.min'}))
                        .pipe(gulp.dest(templatedir + 'assets/css/'));
                less_tasks.push(default_less2);
            });

    variation.forEach(function (entry) {
        var temp = gulp.src(templatedir + 'assets/less/style-' + entry + '.less')
                .pipe(less())
                .pipe(gulp.dest(templatedir + 'assets/css/'))
                .pipe(gulp.dest(templatedir + 'assets/css/')).on('end', function () {
                    var temp2 = gulp.src(templatedir + 'assets/css/style-' + entry + '.css')
                            .pipe(minifyCss().on('error', function (err) {
                                console.log(err);
                            }))
                            .pipe(rename({suffix: '.min'}))
                            .pipe(gulp.dest(templatedir + 'assets/css/'));
                    less_tasks.push(temp2);
                });
    });



    return less_tasks;
});

gulp.task('compress-js', function () {
    gulp.src(templatedir + 'assets/js/theme.js')
            .pipe(minify({
                ext: {
                    // src:'-debug.js',
                    min: '.min.js'
                },
                exclude: ['tasks'],
                ignoreFiles: ['.combo.js', '-min.js']
            }))
            .pipe(gulp.dest(templatedir + 'assets/js'));
});

/* Task to watch less changes */
gulp.task('watch-less', ['compile-less', 'compress-js'], function () {

    //watch less file
    gulp.watch(templatedir + 'assets/less/*.less', ['compile-less']);
    gulp.watch(templatedir + 'assets/less/mixins/*.less', ['compile-less']);
    gulp.watch(templatedir + 'assets/less/variation/*.less', ['compile-less']);
    //watch js file
    gulp.watch(templatedir + 'assets/js/theme.js', ['compress-js']);

});


/* Task when running `gulp` from terminal */
gulp.task('default', ['watch-less']);
