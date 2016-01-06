/**
 * Idealab Task Runner
 */


/*
* TOC
*
* Clean
* Copy
* - copy:public
* - copy:plugins
* - copy:theme
* Default
*/

'use strict';


const APPURL = 'idealab.jhu.dev';
const DEST = 'dist';
const THEMENAME = 'jhu-idealab';
const THEMEPATH = DEST + '/www/content/themes/' + THEMENAME;

const AUTOPREFIXER_BROWSERS = [
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


const processors = [
  pxtorem({
      replace: false
  })
];


const IMAGEMIN_PREFS = {
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


const INLINE_OPTIONS = {
    rootpath: path.resolve('./')
};

const MINIFY_OPTIONS = {comments:true,spare:true};


const PLUMBER_OPTIONS = {
  errorHandler: true
};





import del from 'del';
import bower from 'main-bower-files';
import browserSync from 'browser-sync';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import pagespeed from 'psi'
import pxtorem from 'postcss-pxtorem';
import runSequence from 'run-sequence';
import {stream as wiredep} from 'wiredep';


const $ = gulpLoadPlugins();
const reload = browserSync.reload;





/* ==========================================================================
   § Clean
   ========================================================================== */
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));





/* ==========================================================================
   § Copy
   ========================================================================== */
gulp.task('copy', ['copy:theme', 'copy:plugins']);


/*
   §§ copy:public
   ========================================================================== */
gulp.task('_copy:public', () => {
  gulp.src([
    'public/**/*.*'])
    .pipe($.changed(DEST))
    .pipe(gulp.dest(DEST));
});


/*
   §§ copy:htaccess
   ========================================================================== */
gulp.task('_copy:htaccess', () => {
  gulp.src(['node_modules/apache-server-configs/dist/.htaccess'])
    .pipe(gulp.dest(DEST + '/www'));
});


/*
   §§ copy:plugins
   ========================================================================== */
gulp.task('copy:plugins', ['_copy:public'],() => {
  return gulp.src([
    'source/plugins/**/*.*'])
    .pipe($.changed(DEST + '/www/content'))
    .pipe(gulp.dest(DEST + '/www/content'));
});


/*
   §§ copy:theme
   ========================================================================== */
gulp.task('copy:theme', ['_copy:public'], () => {
  return gulp.src([
    'source/theme/**/*.*'])
    .pipe(gulp.dest(THEMEPATH));
});





/* ==========================================================================
   § Default
   ========================================================================== */
gulp.task('default', ['clean'], () => {
  gulp.start('serve');
});





/* ==========================================================================
   § Fonts
   ========================================================================== */
gulp.task('fonts', () => {
 return gulp.src(require('main-bower-files')({
   filter: '**/*.{eot,svg,ttf,woff,woff2}'
 }).concat('source/fonts/**/*'))
   .pipe(gulp.dest(THEMEPATH + '/fonts'))
});





/* ==========================================================================
   § HTML
   ========================================================================== */
gulp.task('html', () => {
  var assets = $.useref({
    searchPath: '{.tmp,source,./}',
    base: '../'
  });
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var htmlFilter = $.filter('**/*.{php,twig}');

  return gulp.src('source/theme/views/base.twig')
    .pipe(assets)
    // Remove any unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    // .pipe($.if('*.css', $.uncss({
    //   html: [
    //     'src/index.html'
    //   ],
    //   // CSS Selectors for UnCSS to ignore
    //   ignore: [
    //     /.navdrawer-container.open/,
    //     /.app-bar.open/
    //   ]
    // })))

    // Concatenate and minify styles
    // In case you are still using useref build blocks
    // .pipe($.if('*.css', $.csso()))
    // Minify any HTML
    // .pipe($.if('*.html', $.inlineSource(INLINE_OPTIONS)))
    // .pipe($.if('*.html', $.minifyHtml()))
    // Output files
    .pipe(gulp.dest(THEMEPATH + '/views'))
    .pipe($.size({title: 'html'}));
})





/* ==========================================================================
   § Images
   ========================================================================== */
gulp.task('images', () => {
  return gulp.src('source/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin(IMAGEMIN_PREFS))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest(THEMEPATH + '/images'));
});





/* ==========================================================================
   § Lint
   ========================================================================== */
function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}

gulp.task('lint', lint('source/theme/scripts/**/*.js'));





/* ==========================================================================
   § Serve
   ========================================================================== */
gulp.task('serve', ['copy', 'styles', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    proxy: APPURL,
    serveStatic: [
      '.']
  });


  // gulp.watch(['.tmp/**'])
  //   .on('change', reload);


  gulp.watch('source/styles/**/*.scss', ['styles']);
  gulp.watch('source/scripts/**/*.js', ['scripts']);
  gulp.watch('source/images/**/*', ['images', reload]);
  gulp.watch('source/plugins/**/*', ['copy:plugins', reload]);
  gulp.watch('source/theme/**/*.{php,twig}', ['copy:theme', reload]);
  gulp.watch('source/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});





/* ==========================================================================
   § Scripts
   ========================================================================== */
gulp.task('scripts', () => {
  return gulp.src('source/scripts/**/*.js')
    .pipe(gulp.dest(THEMEPATH + '/scripts'))
    .pipe(reload({stream: true}));
});





/* ==========================================================================
   § Styles
   ========================================================================== */
gulp.task('styles', () => {

  return gulp.src(['source/styles/master.scss','source/styles/webfonts.scss'])
    .pipe($.plumber(PLUMBER_OPTIONS))
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.postcss(processors))
    .pipe($.size({'gzip': true}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(THEMEPATH + '/styles'))
    .pipe(reload({stream: true}));
});






/* ==========================================================================
   § Wiredep
   ========================================================================== */
gulp.task('wiredep', () => {
  gulp.src('source/styles/main.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/,
      overrides: {
        'sanitize-css': {
          'main': 'sanitize.scss'
        },
      }
    }))
    .pipe(gulp.dest('source/styles'));

  gulp.src('source/templates/views/__base.twig')
    .pipe(wiredep({
      exclude: [ /jquery/, 'bower_components/modernizr/modernizr.js' ],
      ignorePath: /^(\.\.\/)*\.\./,
    }))
    .pipe(gulp.dest('source/templates/views'));
});
