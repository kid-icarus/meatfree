var gulp = require('gulp')
var uglify = require('gulp-uglify')
var header = require('gulp-header')
var transform = require('vinyl-transform')
var map = require('map-stream')

gulp.task('thingy', function() {
  var encoder = transform(function(filename) {
    return map(function(chunk, next) {
      return next(null, encodeURIComponent(chunk.toString()))
    })
  })
  gulp.src('index.js')
    .pipe(uglify())
    .pipe(encoder)
    .pipe(header('javascript:'))
    .pipe(gulp.dest('dist'))
});

gulp.task('watch', function() {
  gulp.watch('index.js', ['thingy']);
});
