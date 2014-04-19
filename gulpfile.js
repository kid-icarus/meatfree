var gulp = require('gulp')
var uglify = require('gulp-uglify')
var header = require('gulp-header')

gulp.task('thingy', function() {
  gulp.src('index.js')
    .pipe(uglify())
    .pipe(header('javascript:'))
    .pipe(gulp.dest('dist'))
});

gulp.task('watch', function() {
  gulp.watch('index.js', ['thingy']);
});
