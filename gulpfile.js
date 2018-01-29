var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-clean-css'),
    uglifyCSS = require('gulp-uglifycss'),
    runSeq = require('run-sequence'),
    browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
  console.log("BROWSERSYNC EXECUTING");
  browserSync.init({
    server: './'
  });
});

var sassConfig = {
  inputDirectory: 'sass/**/*.scss',
  outputDirectory: 'dist/',
  option: {
    outputStyle: 'expanded'
  }
};

gulp.task('preprosass', function() {
  return gulp
    .src(sassConfig.inputDirectory)
    .pipe(sass(sassConfig.options).on('error', sass.logError))
    .pipe(gulp.dest(sassConfig.outputDirectory))
    .pipe(browserSync.stream());
});

gulp.task('minify-css', function() {
  return gulp
    .src('dist/*.css')
    .pipe(minifyCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
});

gulp.task('uglify-css', function() {
  return gulp 
    .src('dist/*.css')
    .pipe(uglifyCSS({
      "maxLineLen": 2,
      "uglyComments": true,
      "debug": true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
});

gulp.task('css', function(callback) {
  runSeq('preprosass', 'minify-css', 'uglify-css', function() {
    console.log('DONE WITH CSS!');
    callback();
  });
});

// Serve static assets and watch scss/html files
gulp.task('watch', function() {
  gulp.watch('sass/*.scss', ['css']);
  gulp.watch('./*.html').on('change', browserSync.reload);
  gulp.watch('js/*.js').on('change', browserSync.reload);
});

gulp.task('default', ['watch'], function(callback) {
  gulp.start('browserSync');
});
