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


var THEME_PATH = './src/www/content/themes/jhu-idealab';
var PROXY_URL = 'http://idealab.jhu.dev/';


gulp.task('styles', function () {
    return gulp.src([
        'src/sass/*.scss',
        'src/sass/module/*.scss',
        'src/sass/layout/*.scss'
      ])
        .pipe($.sass())
        .pipe(gulp.dest(THEME_PATH + '/styles'))
        .pipe($.size({gzip: true}));
});

gulp.task('styles:optimize', ['styles'], function () {
  return gulp.src([
    THEME_PATH + '/styles/*.css'
  ])
  .pipe($.plumber(PLUMBER_OPTIONS))
  .pipe($.combineMediaQueries({
    log: true
  }))
  .pipe($.csso())
  .pipe(gulp.dest(THEME_PATH + '/styles'))
  .pipe($.size({title: 'styles, cmqd'}))
  .pipe($.size({title: 'styles:gzip cmqd', gzip: true}));
});


gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});


gulp.task('assets:useref', ['styles', 'scripts'], function () {
    var assets = $.useref.assets({searchPath: [THEME_PATH, './']});

    return gulp.src(THEME_PATH + '{,**}/*.{php,twig}')
      .pipe(assets)
      // Concatenate And Minify JavaScript
      .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
      // Remove Any Unused CSS
      // Note: If not using the Style Guide, you can delete it from
      // the next line to only include styles your project uses.
      .pipe($.if('*.css', $.csso()))
      .pipe(assets.restore())
      .pipe($.useref())
      // Update Production Style Guide Paths
      //.pipe($.replace('components/components.css', 'components/main.min.css'))
      // Minify Any HTML
      // Output Files
      .pipe(gulp.dest(THEME_PATH))
      .pipe($.size({title: 'html', gzip: true}));

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

gulp.task('serve', function () {
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
        'src/scripts/**/*.js',
        'src/images/**/*'
    ], reload);

    gulp.watch('src/www/**/*.{php,twig}', reload);
    gulp.watch('src/sass/**/*.scss', ['styles', reload]);
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    gulp.watch('bower.json', ['wiredep']);
});
