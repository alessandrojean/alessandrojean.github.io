const gulp = require('gulp');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const cp = require('child_process');

const messages = {
  jekyllBuild: '<span style="color: grey;">Running</span> $ jekyll build'
};

/**
 * Builds the Jekyll website.
 */
gulp.task('jekyll-build', done => {
  browserSync.notify(messages.jekyllBuild);
  // If you use a UNIX system, remove the ".bat".
  return cp.spawn('jekyll', ['build', '--drafts'], { stdio: 'inherit' })
    .on('close', done)
    .on('error', e => console.error(e));
});

/**
 * Rebuild the website and reload the page.
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], () => {
  browserSync.reload();
});

/**
 * Waits until jekyll-build finishes and
 * start the server using _site as root folder.
 */
gulp.task('browser-sync', ['jekyll-build'], () => {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

/**
 * JavaScript task.
 */
gulp.task('js', () => {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(babel({ presets: ['env'] }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('assets/js/'));
});

/**
 * SASS task.
 */
gulp.task('sass', () => {
  gulp.src('src/scss/main.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('assets/css'));
});

/**
 * Images task.
 */
gulp.task('image', () => {
  return gulp.src('src/img/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('assets/img/'));
});

/**
 * Observe the changes and recompile.
 */
gulp.task('watch', () => {
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/img/**/*.{jpg,png,gif,svg,webp}', ['image']);
  gulp.watch([
    '*.{html,md}',
    'category/*.html',
    '_includes/*.html',
    '_layouts/*.html',
    '_posts/*',
    '_drafts/*',
    '_config.yml'
  ], ['jekyll-rebuild']);
});

gulp.task('default', ['js', 'sass', 'browser-sync', 'watch']);