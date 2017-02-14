const elixir = require('laravel-elixir');
const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');
const notify = require('gulp-notify');
const webpackStream = require('webpack-stream');
const less = require('gulp-less');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.less('app.less');
});

gulp.task('default', ['watch', 'css', 'js'], () => {
  console.log('default...');
});

gulp.task('webpack', () => {
   gulp.src(['./resources/assets/js/controllers/**/*.js'])
  .pipe(webpackStream(require('./webpack.config')))
  .on('error', function handleError() {
      this.emit('end'); // Recover from errors
  })
  .pipe(rename('bundle.js'))
  .pipe(gulp.dest('./public/js'))
  .pipe(notify('Compiled...'));
});

gulp.task('css', () => {
  gulp.src([
    'node_modules/bootstrap/dist/css/bootstrap.min.css'
  ])
  .pipe(concat('all.css'))
  .pipe(cleanCSS())
  .pipe(gulp.dest('./public/css'));
});

gulp.task('js', () => {
  gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/jquery.inputmask/dist/jquery.inputmask.bundle.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/react/dist/react.min.js',
    'node_modules/react-dom/dist/react-dom.min.js'
  ])
  .pipe(concat('all.js'))
  .pipe(minify())
  .pipe(gulp.dest('./public/js'));
});


gulp.task('watch', () => {
  gulp.watch([
    './resources/assets/js/controllers/**/*.js',
  ], ['webpack']);
});
