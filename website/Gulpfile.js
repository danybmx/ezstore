const gulp = require('gulp');
const stylus = require('gulp-stylus');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const dotenv = require('dotenv');
const gutil = require('gulp-util');
const chalk = require('chalk');

// Load env file
dotenv.load();

// Set paths
const scriptsPath = 'app/resources/scripts';
const stylesPath = 'app/resources/styles';
const destPath = 'static';

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
};

/**
 * Init browserSync task
 * ---------------------
 * Just initialize browserSync to get it ready for watch
 */
gulp.task('init-browserSync', () => {
  // Set browserSync to the browserSync var
  // so we can verify if we're on "dev" task
  browserSync = require('browser-sync').create();

  // Initialize browserSync
  browserSync.init({
    port: 3001,
  });
});

/**
 * Dev task
 * --------
 * Starts the server with nodemon
 * Watch styl and js files on ${stylesPath} & ${scriptsPath}, compile them
 * and stream their changes to browserSync
 * Watch views and reload website using browserSync
 */
gulp.task('dev', ['init-browserSync', 'styles', 'scripts'], () => {
  const nodemon = require('nodemon');

  // Nodemon
  const monitor = nodemon({
    script: './server.js',
    watch: './app',
    ignore: ['./app/resources/'],
    ext: 'js',
  });

  process.on('SIGINT', () => {
    monitor.on('exit', () => {
      process.exit();
    });
  });

  // Nodemon
  gulp.watch('status', () => {
    console.log('Nodemon restarted and server running again');
    browserSync.reload();
  });

  // Styles
  gulp.watch(stylesPath + '/**/*.styl', ['styles']);

  // Scripts
  gulp.watch(scriptsPath + '/**/*.js', ['scripts']);

  // Views
  gulp.watch('app/views/**/*.pug', () => {
    setTimeout(() => {
      browserSync.reload();
    }, 500);
  });
});

/**
 * Scripts task
 * -------
 * Browserify and babelify the scripts used in ${scriptsPath}/main.js
 * to ${destPath}/js/bundle.js.
 * Also launch browserSync stream if we're watching
 */
gulp.task('scripts', () => {
  const bundler = browserify(scriptsPath + '/main.js', {debug: true});
  const task = bundler
    .bundle()
    .on('error', renderBrowserifyErrors)
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest(destPath + '/js'));

  if (isWatch()) {
    setTimeout(() => {
      task.pipe(browserSync.stream());
    }, 500);
  }

  return task;
});

/**
 * Styles task
 * -------
 * Preprocess the file ${stylesPath}/main.stylus and compile it
 * to ${destPath}/css/bundle.css.
 * Also launch browserSync stream if we're watching
 */
gulp.task('styles', () => {
  let task;

  task = gulp.src(stylesPath + '/main.styl')
    .pipe(stylus({
      compress: !isWatch(),
    }))
    .on('error', renderBrowserifyErrors)
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest(destPath + '/css'));

  if (isWatch()) {
    setTimeout(() => {
      task.pipe(browserSync.stream());
    }, 500);
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
