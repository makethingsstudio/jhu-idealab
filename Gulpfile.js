'use strict';
// generated on 2014-09-18 using generator-gulp-webapp 0.1.0





// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;


var AUTOPREFIXER_BROWSERS = [
 'ie >= 8',
 'ie_mob >= 10',
 'ff >= 30',
 'chrome >= 34',
 'safari >= 7',
 'opera >= 23',
 'ios >= 7',
 'android >= 4.4',
 'bb >= 10'
];


var IMAGEMIN_PREFS = {
    optimizationLevel: 3,
    progressive: true,
    interlaced: true,
    svgoPlugins: [
      { cleanupAttrs: true },
      { cleanupEnableBackground: true },
      { cleanupIDs: true },
      { cleanupNumericValues: true },
      { collapseGroups: false },
      { convertColors: false },
      { convertPathData: false },
      { convertShapeToPath: false },
      { convertStyleToAttrs: false },
      { convertTransform: false },
      { mergePaths: false },
      { moveElemsAttrsToGroup: false },
      { moveGroupAttrsToElems: false },
      { removeComments: true },
      { removeDesc: true },
      { removeDoctype: true },
      { removeEditorsNSData: true },
      { removeEmptyAttrs: true },
      { removeEmptyContainers: false },
      { removeEmptyText: true },
      { removeHiddenElems: true },
      { removeMetadata: true },
      { removeNonInheritableGroupAttrs: false },
      { removeRasterImages: true },
      { removeTitle: true },
      { removeUnknownsAndDefaults: false },
      { removeUnusedNS: true },
      { removeUselessStrokeAndFill: true },
      { removeViewBox: true },
      { removeXMLProcInst: true },
      { sortAttrs: true },
      { transformsWithOnePath: true },
    ],
};


var PLUMBER_OPTIONS = {
  errorHandler: true
};


var PROXY_URL = 'http://192.168.30.100/';


gulp.task('styles', function () {
    return gulp.src([
        'src/sass/*.scss',
        'src/sass/module/*.scss',
        'src/sass/layout/*.scss'
      ])
        .pipe($.plumber(PLUMBER_OPTIONS))
        .pipe($.sass())
        .pipe($.plumber.stop())
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(gulp.dest('src/wordpress/content/themes/jhu-idealab/styles'))
        .pipe($.size({gzip: true}));
});

gulp.task('styles:optimize', ['styles'], function () {
  return gulp.src([
    'app/public/_/styles/*.css'
  ])
  .pipe($.plumber(PLUMBER_OPTIONS))
  .pipe($.combineMediaQueries({
    log: true
  }))
  .pipe($.csso())
  .pipe(gulp.dest('app/public/_/styles'))
  .pipe($.size({title: 'styles, cmqd'}))
  .pipe($.size({title: 'styles:gzip cmqd', gzip: true}));
});


gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});


gulp.task("jekyll:dev", $.shell.task("jekyll build"));
gulp.task("jekyll-rebuild", ["jekyll:dev"], function () {
  runSequence('styles');
});


gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('.tmp/*.html')
        .pipe($.useref.assets({searchPath: '{.tmp,src}'}))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist/'))
        .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src(['src/images/**/*', '.tmp/images/**/*'])
        .pipe($.plumber())
        .pipe($.newer('dist/images'))
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return gulp.src(bower(), {base: 'bower_components'})
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size());
});

gulp.task('extras', function () {
    return gulp.src([
        '!src/*.html',
        '!src/static/templates/**/*',
        'src/**'
      ], { dot: true })
        .pipe(gulp.dest('dist'));
});

gulp.task('copy:all', function () {
    return gulp.src([
      'src/**',
      '!src/static/templates/**',
      '.tmp/**',
    ], { dot: true })
        .pipe(gulp.dest('dist'));
});

gulp.task('copy:dependencies', function () {
  return gulp.src('bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist/{,*/}*', '!dist/.git'], { read: false }).pipe($.clean());
});

gulp.task('build', function () {
  runSequence('jekyll:dev', ['styles','images', 'fonts', 'extras'])
});

gulp.task('build:dev', ['copy:all', 'copy:dependencies']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('serve', ['jekyll-rebuild'], function () {
  browserSync({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    proxy: PROXY_URL,

  });
});


gulp.task('serve:dist', function () {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  })
});


// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('src/styles/*.scss')
        .pipe(wiredep({
            directory: 'bower_components',
            ignorePath: '../../..'
        }))
        .pipe(gulp.dest('src/styles'));

    gulp.src('src/static/templates/_layouts/*.html')
        .pipe(wiredep({
            directory: 'bower_components',
            ignorePath: '../../..',
            overrides: {
                "loadcss": {
                  "main": "loadCSS.js"
                },
              }
        }))
        .pipe(gulp.dest('src/static/templates/_layouts/'));
});

gulp.task('watch', ['serve'], function () {
    // watch for changes

    gulp.watch([
        '.tmp/*.html',
        '.tmp/**/*.html',
        '.tmp/styles/**/*.css',
        'src/scripts/**/*.js',
        'src/images/**/*'
    ], reload);

    gulp.watch(['src/static/templates/*.html', 'src/static/templates/_includes/*.html', 'src/static/templates/_layouts/*.html'], ['jekyll-rebuild']);
    gulp.watch('src/wordpress/**/*.php', reload);
    gulp.watch('src/sass/**/*.scss', ['styles']);
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    gulp.watch('bower.json', ['wiredep']);
});
