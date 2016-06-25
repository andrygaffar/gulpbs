var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.stream;
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
var cssComb = require('gulp-csscomb')
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');
var sequence = require('gulp-sequence');
var merge = require('merge-stream');

var COMPATIBILITY = [
    'last 2 versions',
    'ie >= 9',
    'Android >= 2.3'
];

var PATHS = {
    sass: [
        'assets/vendor/bootstrap-sass/assets/stylesheets',
        'assets/vendor/font-awesome/scss',
        'assets/vendor/aos/src/sass',
    ],
    javascript: [

        // 'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
        'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
        'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/button.js',
        // 'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
        'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
        'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
        'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
        'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
        'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
        'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
        // 'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
        // 'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/popover.js',

        // 'assets/vendor/aos/src/js/aos.js',

        'assets/components/js/*.js',
    ]
};

gulp.task('sass', function() {
    gulp.src(['assets/components/scss/main.scss'])
        .pipe(plumber({
            handleError: function(err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass({
            includePaths: PATHS.sass
        }))
        .pipe(autoPrefixer({
            browsers: COMPATIBILITY
        }))
        .pipe(cssComb())
        .pipe(concat('main.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('assets/css'))
        .pipe(reload())
});

gulp.task('js', function() {
    gulp.src(PATHS.javascript)
        .pipe(plumber({
            handleError: function(err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(concat('main.js', {
            newLine: '\n;'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'))
        .pipe(reload());
});

gulp.task('image', function() {
    gulp.src('assets/components/images/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('assets/images'))
        .pipe(reload());
});

gulp.task('html', function() {
    gulp.src(['*.html'])
        .pipe(plumber({
            handleError: function(err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(reload());
});

gulp.task('copy', function() {

    // Font Awesome
    var fontAwesome = gulp.src('assets/vendor/font-awesome/fonts/**/*.*')
        .pipe(gulp.dest('assets/fonts'));

    // jQuery
    var jquery = gulp.src('assets/vendor/jquery/dist/**/*.min.js')
        .pipe(gulp.dest('assets/js/vendor'));

    // AOS
    var aos = gulp.src('assets/vendor/aos/dist/aos.js')
        .pipe(gulp.dest('assets/js/vendor'));

    merge(fontAwesome, jquery);
});

gulp.task('build', function(done) {
    sequence('copy', 
            ['sass', 'js', 'image'],
            done);
});

gulp.task('default', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('assets/components/js/**/*.js', ['js']);
    gulp.watch('assets/components/scss/**/*.scss', ['sass']);
    gulp.watch('*.html', ['html']);
    gulp.watch('assets/components/images/**/*', ['image']);
});
