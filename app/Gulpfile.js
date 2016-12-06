const gulp = require('gulp');
const less = require('gulp-less');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const gutil = require('gulp-util');
const chalk = require('chalk');
const path = require('path');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

// Package.json
const package = require('./package.json');

// Set paths
const rootPath = path.resolve('./');
const srcPath = path.resolve('./src');
const libsPath = srcPath + '/libs';
const scriptsPath = srcPath + '/resources/scripts';
const stylesPath = srcPath + '/resources/styles';
const destPath = srcPath + '/static';

// Just check if we're watching
let browserSync;
const isWatch = () => Boolean(browserSync);

// Just an error renderer for show pretty browserify errors
const renderBrowserifyErrors = function(err) {
  if (err.fileName) {
    // Regular error
    gutil.log(chalk.red(err.name) +
      ': ' +
      chalk.yellow(err.fileName.replace(scriptsPath, '')) +
      ': Line ' +
      chalk.magenta(err.lineNumber) +
      ' & Column ' +
      chalk.magenta(err.columnNumber || err.column) +
      ': ' +
      chalk.blue(err.description));
  } else {
    // Browserify error
    gutil.log(chalk.red(err.name) +
      ': ' + chalk.yellow(err.message));
  }
  this.emit('end');
};

/**
 * Dev task
 * --------
 * Watch styl and js files on ${stylesPath} & ${scriptsPath}, compile them
 * and stream their changes to browserSync
 */
gulp.task('dev', ['styles', 'scripts'], () => {
  // Set browserSync to the browserSync var
  // so we can verify if we're on "dev" task
  browserSync = require('browser-sync').create();

  // Initialize browser-sync
  browserSync.init({
    serveStatic: ['./src/'],
    files: srcPath + '/index.html',
    port: 3000,
  });

  // Styles
  gulp.watch(stylesPath + '/**/*.less', ['styles']);

  // Scripts
  gulp.watch(scriptsPath + '/**/*.js', ['scripts']);

  // Libraries
  gulp.watch(scriptsPath + '/libs.js', ['scripts.libraries', 'scripts']);
});

/**
 * Scripts libraries task
 * -------
 * Concat all the third party dependencies and uglify them
 */
gulp.task('scripts.libraries', () => {
  browserify(scriptsPath + '/libs.js', {debug: true})
    .transform('babelify', { presets: ['latest'] })
    .bundle()
    .on('error', renderBrowserifyErrors)
    .pipe(source('libs.js'))
    .pipe(buffer())
    .pipe(gulp.dest(destPath + '/js'));
});

/**
 * Scripts task
 * -------
 * Browserify and babelify the scripts used in ${scriptsPath}/main.js
 * to ${destPath}/js/bundle.js.
 * Also launch browserSync stream if we're watching
 */
gulp.task('scripts', () => {
  browserify(scriptsPath + '/main.js', {debug: true})
    .transform('babelify', { presets: ['latest'] })
    .bundle()
    .on('error', renderBrowserifyErrors)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest(destPath + '/js'))

  const task = gulp.src([destPath + '/js/libs.js', destPath + '/js/app.js'])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(destPath + '/js'));

  if (isWatch()) {
    task.pipe(browserSync.stream());
  }
});

/**
 * Styles task
 * -------
 * Preprocess the file ${stylesPath}/main.less and compile it
 * to ${destPath}/css/bundle.css.
 * Also launch browserSync stream if we're watching
 */
gulp.task('styles', () => {
  let task;

  task = gulp.src(stylesPath + '/main.less')
    .pipe(less({
      paths: [path.join(rootPath, 'node_modules'), path.join(stylesPath, 'includes')],
    }))
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest(destPath + '/css'));

  if (isWatch()) {
    task.pipe(browserSync.stream());
  }

  return task;
});

/**
 * Build task
 * ----------
 * This task launch these others:
 * - copy-views
 * - js
 * - sass
 */
gulp.task('build', [
  'scripts',
  'styles',
]);

/**
 * Default task
 * ------------
 * Default task will be the build one
 */
gulp.task('default', ['build']);
