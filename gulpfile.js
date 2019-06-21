// Adapted from: https://gist.github.com/jeromecoupe/0b807b0c1050647eb340360902c3203a

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const eslint = require('gulp-eslint');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const cp = require('child_process');

// BrowserSync.
const browserSyncInit = done => {
  browserSync.init({
    server: {
      baseDir: '_site'
    },
    open: false
  });
  done();
};

// BrowserSync Reload.
const browserSyncReload = done => {
  browserSync.reload();
  done();
};

// CSS task.
const cssTask = () => {
  return gulp
    .src('src/scss/init.scss')
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: 'expanded',
        includePaths: [
          './node_modules/normalize-scss/sass',
          './node_modules/nord/src/sass'
        ]
      })
    )
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('assets/css'));
};

// Lint scripts.
const scriptsLint = () => {
  return gulp
    .src(['src/js/**/*.js', './gulpfile.js'])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};

// JS task.
const jsTask = () => {
  return gulp
    .src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('assets/js/'));
};

// Images task.
const imagesTask = () => {
  return gulp
    .src('src/img/**/*')
    .pipe(plumber())
    .pipe(newer('assets/img'))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }]
      })
    )
    .pipe(gulp.dest('assets/img/'));
};

// Jekyll.
const jekyll = () => {
  return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--drafts'], {
    stdio: 'inherit'
  });
};

// Watch files.
const watchFiles = () => {
  gulp.watch('src/scss/**/*.scss', cssTask);
  gulp.watch('src/js/**/*.js', gulp.series(scriptsLint, jsTask));
  gulp.watch('src/img/**/*', imagesTask);
  gulp.watch(
    [
      '*.{html,md}',
      'category/*.html',
      '_includes/*.html',
      '_layouts/*.html',
      '_posts/*',
      '_pages/*',
      '_drafts/*',
      '_config.yml'
    ],
    gulp.series(jekyll, browserSyncReload)
  );
};

// Tasks.
gulp.task('images', imagesTask);
gulp.task('css', cssTask);
gulp.task('js', gulp.series(scriptsLint, jsTask));
gulp.task('jekyll', jekyll);

// Build.
gulp.task('build', gulp.parallel(cssTask, imagesTask, jekyll, 'js'));

// Watch.
gulp.task('watch', gulp.parallel(watchFiles, browserSyncInit));

// Default.
gulp.task('default', gulp.series('build', 'watch'));
