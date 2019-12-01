const gulp = require('gulp');
const plumber = require('gulp-plumber');
const errorHandler = require('gulp-plumber-error-handler');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');

module.exports = () => (
  gulp.src('app/static/images/**/*')
  .pipe(plumber({
    errorHandler: errorHandler('Error in icons task')
  }))
  .pipe(changed('dist/assets/images'))
  .pipe(imagemin([
    imagemin.gifsicle({
      interlaced: true,
    }),
    imagemin.jpegtran({
      progressive: true,
    }),
    imagemin.optipng({
      optimizationLevel: 5,
    }),
  ], {
    verbose: true,
  }))
  .pipe(gulp.dest('dist/assets/images'))
);
