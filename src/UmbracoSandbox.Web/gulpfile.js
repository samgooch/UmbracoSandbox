// For development => gulp
// For production  => gulp -p

// Call Plugins
var env      = require('minimist')(process.argv.slice(3)),
	gulp       = require('gulp'),
	jade       = require('gulp-jade'),
	uglify     = require('gulp-uglify'),
	compass    = require('gulp-compass'),
	concat     = require('gulp-concat'),
	cssmin     = require('gulp-cssmin'),
	gulpif     = require('gulp-if'),
	connect    = require('gulp-connect'),
	modRewrite = require('connect-modrewrite'),
	imagemin   = require('gulp-imagemin');

// Call Uglify and Concat JS
gulp.task('js', function(){
	return gulp.src(['_source/js/thirdparty/*.js', '_source/js/bootstrap/*.js', '_source/js/custom/*.js'])
		.pipe(concat('main.js'))
		.pipe(gulpif(env.p, uglify()))
		.pipe(gulp.dest('_client/js/'))
		.pipe(connect.reload());
});

// Call Sass
gulp.task('compass', function(){
	return gulp.src('_source/sass/main.scss')
		.pipe(compass({
			css: '_source/css',
			sass: '_source/sass',
			image: '_source/img'

		}))
		.pipe(gulpif(env.p, cssmin()))
		.pipe(gulp.dest('_client/css/'))
		.pipe(connect.reload());
});

// Call Imagemin
gulp.task('imagemin', function() {
  return gulp.src('_source/img/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('_client/img'));
});

// Call fonts
gulp.task('fonts', function() {
  return gulp.src('_source/fonts/**/*')
    .pipe(gulp.dest('_client/fonts'));
});

// Call Watch
gulp.task('watch', function(){
	gulp.watch('_source/sass/**/*.scss', ['compass']);
	gulp.watch('_source/js/**/*.js', ['js']);
	gulp.watch('_source/img/**/*.{jpg,png,gif}', ['imagemin']);
});

// Connect (Livereload)
gulp.task('connect', function() {
	connect.server({
		root: ['_client/'],
		livereload: true,
		middleware: function(){
			return [
				modRewrite([
					'^/$ /index.html',
					'^([^\\.]+)$ $1.html'
				])
			];
		}
	});
});

gulp.task('build', ['js', 'compass', 'imagemin', 'fonts']);

// Default task
gulp.task('default', ['build', 'watch']);
