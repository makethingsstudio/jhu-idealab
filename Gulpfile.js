'use strict';
// generated on 2014-09-18 using generator-gulp-webapp 0.1.0





// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var bower = require('main-bower-files');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;
var path = require('path');


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

var INLINE_OPTIONS = {
    rootpath: path.resolve('./src/www')
};

var MINIFY_OPTIONS = {comments:true,spare:true};


var PLUMBER_OPTIONS = {
  errorHandler: true
};

var THEME_PATH = './src/www/content/themes/jhu-idealab';
var DIST_THEME_PATH = './dist/content/themes/jhu-idealab';
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
  .pipe($.combineMediaQueries({log: true })) .pipe($.csso())
  .pipe(gulp.dest(DIST_THEME_PATH + '/styles'))
  .pipe($.size({title: 'styles, cmqd'}))
  .pipe($.size({title: 'styles:gzip cmqd', gzip: true}));
});


gulp.task('scripts', function () {
    return gulp.src(THEME_PATH+ '/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});


gulp.task('assets:useref', ['styles', 'scripts'], function () {
    var assets = $.useref.assets({searchPath: [
      'src/www/',
      './',
    ]});
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var htmlFilter = $.filter('**/*.{php,twig}');

    return gulp.src(THEME_PATH + '/**/*.{php,twig}')
      .pipe($.inlineSource(INLINE_OPTIONS))
      .pipe(assets)
      .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
      .pipe(cssFilter)
        //.pipe($.combineMediaQueries({log: true }))
        .pipe($.csso())
        .pipe($.size({title: 'styles gzipped', gzip: true}))
        .pipe(cssFilter.restore())
      .pipe(gulp.dest('dist'))
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe(htmlFilter)
        .pipe(gulp.dest(DIST_THEME_PATH + '/'))
        .pipe($.size({title: 'html', gzip: true}))
        .pipe(htmlFilter.restore())
});

gulp.task('images', function () {
    return gulp.src(['src/images/**/*'])
        .pipe($.plumber())
        .pipe($.newer('dist/images'))
        .pipe($.imagemin(IMAGEMIN_PREFS))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest(DIST_THEME_PATH + '/images'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    gulp.src(bower())
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest(DIST_THEME_PATH + '/fonts'))

    gulp.src(THEME_PATH + '/fonts/**')
      .pipe(gulp.dest(DIST_THEME_PATH + '/fonts'))
});


gulp.task('copy', function () {
    return gulp.src([
      'src/www/**',
      '!src/www/*-config.php',
      '!src/www/bower_components/**',
      '!src/www/content/themes/**',
      '!src/www/content/uploads/**'
    ], { dot: true })
        .pipe(gulp.dest('dist'));
});

gulp.task('copy:theme', function (){
  return gulp.src([
      THEME_PATH + '/style.css',
      THEME_PATH + '/screenshot.png'
    ])
    .pipe(gulp.dest(DIST_THEME_PATH));
});

gulp.task('clean', function (cb) {
    del(['dist/*', '!dist/.git'], cb);
});

gulp.task('build', ['clean'],function (done) {
  runSequence(['copy', 'copy:theme','images', 'fonts'], 'assets:useref', 'rev', done);
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('rev', function () {
  return gulp.src(DIST_THEME_PATH + '/**')
    .pipe($.revAll({
      base: ['dist', 'src/www/bower_components'],
      ignore: [
        /^\/favicon.ico$/g,
        '.html',
        '.php',
        '.twig'
      ],
    }))
    .pipe($.if('*.{twig,php}', $.minifyHtml(MINIFY_OPTIONS)))
    .pipe(gulp.dest(DIST_THEME_PATH));
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
            directory: 'src/www/bower_components',
            ignorePath: '../../..'
        }))
        .pipe(gulp.dest('src/styles'));

    gulp.src('src/www/content/themes/jhu-idealab/views/base.twig')
        .pipe(wiredep({
            directory: 'src/www/bower_components',
            ignorePath: '../../../..',
            exclude: [ '/modernizr/', '/loadcss/' ],
            overrides: {
                "loadcss": {
                  "main": "loadCSS.js"
                },
                "modernizr": {
                  "main": "modernizr.js"
                },
              }
        }))
        .pipe(gulp.dest('src/www/content/themes/jhu-idealab/views/'));
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
