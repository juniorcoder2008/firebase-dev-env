// Initialize all node modules
const gulp = require('gulp');
const uglifycss = require('gulp-uglifycss');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const browsersync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');

// Initialize The Gulp Sass Module
const gulpSass = require('gulp-sass');
const nodeSass = require('node-sass');

const sass = gulpSass(nodeSass);

// Setup server
const reload = done => {
     browsersync.reload();
     done();
  };
  
const serve = done => {
     browsersync.init({
          server: {
               baseDir: './public/'
          },
          notify: false
     });
     done();
};

const css = () => {
     return gulp.src('./app/style/**/*.sass')
          .pipe(sass().on('error', sass.logError))
          .pipe(sourcemaps.init())
          .pipe(uglifycss())
          .pipe(rename({ basename: 'style', suffix: '.min' }))
          .pipe(autoprefixer({
               cascade: false
          }))
          .pipe(sourcemaps.write(''))
          .pipe(gulp.dest('./public/css'));
};

const assets = () => {
     return gulp.src('./app/assets/**/*')
         .pipe(gulp.dest('./public/assets'));
};

const html = () => {
     return gulp.src('./app/*.html')
          .pipe(htmlmin({
               collapseWhitespace: true,
               html5: true,
               removeComments: true,
               removeEmptyAttributes: true
          }))
          .pipe(gulp.dest('./public/'));
};

const js = () => {
     return gulp.src('./app/js/**/*.js')
         .pipe(concat('global.min.js'))
         .pipe(sourcemaps.init())
         .pipe(uglify())
         .pipe(sourcemaps.write(''))
         .pipe(gulp.dest('./public/js'));
};

const watch = () => gulp.watch(['./app/style/**/*.sass', './app/js/**/*.js', './app/**/*.html', './app/assets/*'], gulp.series(js, css, html, assets, reload));
const start = gulp.series(js, css, html, assets, serve, watch);
const build = gulp.series(js, css, html, assets);

exports.start = start;
exports.build = build;
exports.default = build;