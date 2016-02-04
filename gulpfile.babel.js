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

import del from 'del';
import bower from 'main-bower-files';
import browserSync from 'browser-sync';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import pagespeed from 'psi'
import pxtorem from 'postcss-pxtorem';
import runSequence from 'run-sequence';
import {
    stream as wiredep
}
from 'wiredep';

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
    pxtorem( {
        replace: false,
        rootValue: 14
    } )
];

const IMAGEMIN_PREFS = {
    optimizationLevel: 3,
    progressive: true,
    interlaced: true,
    svgoPlugins: [ {
        cleanupAttrs: true
    }, {
        cleanupEnableBackground: true
    }, {
        cleanupIDs: true
    }, {
        cleanupNumericValues: true
    }, {
        collapseGroups: false
    }, {
        convertColors: false
    }, {
        convertPathData: false
    }, {
        convertShapeToPath: false
    }, {
        convertStyleToAttrs: false
    }, {
        convertTransform: false
    }, {
        mergePaths: false
    }, {
        moveElemsAttrsToGroup: false
    }, {
        moveGroupAttrsToElems: false
    }, {
        removeComments: true
    }, {
        removeDesc: true
    }, {
        removeDoctype: true
    }, {
        removeEditorsNSData: true
    }, {
        removeEmptyAttrs: true
    }, {
        removeEmptyContainers: false
    }, {
        removeEmptyText: true
    }, {
        removeHiddenElems: true
    }, {
        removeMetadata: true
    }, {
        removeNonInheritableGroupAttrs: false
    }, {
        removeRasterImages: true
    }, {
        removeTitle: true
    }, {
        removeUnknownsAndDefaults: false
    }, {
        removeUnusedNS: true
    }, {
        removeUselessStrokeAndFill: true
    }, {
        removeViewBox: true
    }, {
        removeXMLProcInst: true
    }, {
        sortAttrs: true
    }, {
        transformsWithOnePath: true
    }, ],
};

const INLINE_OPTIONS = {
    rootpath: path.resolve( './' )
};

const MINIFY_OPTIONS = {
    comments: true,
    spare: true
};

const PLUMBER_OPTIONS = {
    errorHandler: true
};

var REVALL_OPTIONS = {
  dontRenameFile: [
    /^\/favicon.ico$/g,
    '.html',
    '.php',
    '.twig',
  ],
  dontUpdateReference: [
    '.html',
    '.php',
    '.twig'
  ],
  debug: true,
  // transformPath: function (rev, source, path) {
  //     // on the remote server, image files are served from `/images`
  //     return rev.replace('/img', '/images');
  // }
};

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

/* ==========================================================================
   § Build
   ========================================================================== */
gulp.task( 'build', ['clean'], (cb) => {
    runSequence( [ 'copy', 'styles', 'fonts', 'images' ], 'html', 'rev', cb );
});



/* ==========================================================================
   § Clean
   ========================================================================== */
gulp.task( 'clean', del.bind( null, [ '.tmp', 'dist' ] ) );

/* ==========================================================================
   § Copy
   ========================================================================== */
gulp.task( 'copy', [ 'copy:theme', 'copy:plugins' ] );

/*
   §§ copy:public
   ========================================================================== */
gulp.task( '_copy:public', () => {
    gulp.src( [
            'public/**/*.*'
        ] )
        .pipe( $.changed( DEST ) )
        .pipe( gulp.dest( DEST ) );
} );

/*
   §§ copy:htaccess
   ========================================================================== */
gulp.task( '_copy:htaccess', () => {
    gulp.src( [
            'node_modules/apache-server-configs/dist/.htaccess'
        ] )
        .pipe( gulp.dest( DEST + '/www' ) );
} );

/*
   §§ copy:plugins
   ========================================================================== */
gulp.task( 'copy:plugins', [ '_copy:public' ], () => {
    return gulp.src( [
            'source/plugins/**/*.*'
        ] )
        .pipe( $.changed( DEST + '/www/content' ) )
        .pipe( gulp.dest( DEST + '/www/content' ) );
} );

/*
   §§ copy:theme
   ========================================================================== */
gulp.task( 'copy:theme', [ '_copy:public' ], () => {
    return gulp.src( [
            'source/theme/**/*.*'
        ] )
        .pipe( gulp.dest( THEMEPATH ) );
} );

/* ==========================================================================
   § Default
   ========================================================================== */
gulp.task( 'default', [ 'clean' ], () => {
    gulp.start( 'serve' );
} );

/* ==========================================================================
   § Fonts
   ========================================================================== */
gulp.task( 'fonts', () => {
    return gulp.src( require( 'main-bower-files' )( {
            filter: '**/*.{eot,svg,ttf,woff,woff2}'
        } ).concat( 'source/fonts/**/*' ) )
        .pipe( gulp.dest( THEMEPATH + '/fonts' ) )
} );

/* ==========================================================================
   § HTML
   ========================================================================== */
gulp.task( 'html', () => {
    //  var assets = $.useref({
    //    searchPath: '{.tmp,source,dist,./}',
    //  });
    //  var jsFilter = $.filter('**/*.js');
    //  var cssFilter = $.filter('**/*.css');
    //  var htmlFilter = $.filter('**/*.{php,twig}');

    return gulp.src( 'source/theme/views/base.twig' )
        .pipe( $.inlineSource( INLINE_OPTIONS ) )
        .pipe( $.useref( {
            searchPath: [
                './',
                './dist/www'
            ],
            base: '../'
        } ) )
        .pipe( $.debug() )
        .pipe( $.if( '*.css', $.cssnano() ) )
        .pipe( $.if( '*.js', $.uglify() ) )
        // .pipe( $.if( '*.js', $.rev() ) )
        // .pipe( $.if( '*.css', $.rev() ) )
        .pipe( $.revReplace() )

        // .pipe( $.if( '*.css', gulp.dest( 'dist/www' ) ) )
        // .pipe( $.if( '*.js', gulp.dest( 'dist/www' ) ) )

        // .pipe( $.if( '*.twig', gulp.dest( THEMEPATH +
        //     '/views' ) ) )

        .pipe( gulp.dest( THEMEPATH + '/views' ) )
        .pipe( $.size( {
            title: 'html'
        } ) );
} )

gulp.task( 'rev', () => {
    var revAll = new $.revAll(REVALL_OPTIONS);
    gulp.src( THEMEPATH + '/**', { base: 'dist/www'} )
      .pipe( revAll.revision())

      .pipe(gulp.dest('dist/www'));
});

/* ==========================================================================
   § Images
   ========================================================================== */
gulp.task( 'images', () => {
    return gulp.src( 'source/images/**/*' )
        .pipe( $.if( $.if.isFile, $.cache( $.imagemin(
                IMAGEMIN_PREFS ) )
            .on( 'error', function ( err ) {
                console.log( err );
                this.end();
            } ) ) )
        .pipe( gulp.dest( THEMEPATH + '/images' ) );
} );

/* ==========================================================================
   § Lint
   ========================================================================== */
function lint( files, options ) {
    return () => {
        return gulp.src( files )
            .pipe( reload( {
                stream: true,
                once: true
            } ) )
            .pipe( $.eslint( options ) )
            .pipe( $.eslint.format() )
            .pipe( $.if( !browserSync.active, $.eslint.failAfterError() ) );
    };
}

gulp.task( 'lint', lint( 'source/theme/scripts/**/*.js' ) );

/* ==========================================================================
   § Serve
   ========================================================================== */
gulp.task( 'serve', [ 'copy', 'styles', 'fonts' ], () => {
    browserSync( {
        notify: false,
        port: 9000,
        proxy: APPURL,
        serveStatic: [
            '.'
        ]
    } );

    // gulp.watch(['.tmp/**'])
    //   .on('change', reload);

    gulp.watch( 'source/styles/**/*.scss', [ 'styles' ] );
    gulp.watch( 'source/scripts/**/*.js', [ 'scripts' ] );
    gulp.watch( 'source/images/**/*', [ 'images', reload ] );
    gulp.watch( 'source/plugins/**/*', [ 'copy:plugins',
        reload
    ] );
    gulp.watch( 'source/theme/**/*.{php,twig}', [
        'copy:theme', reload
    ] );
    gulp.watch( 'source/fonts/**/*', [ 'fonts' ] );
    gulp.watch( 'bower.json', [ 'wiredep', 'fonts' ] );
} );

gulp.task( 'serve:dist', [ 'build' ], () => {
    browserSync( {
        notify: false,
        port: 9000,
        proxy: APPURL,
    } );
} );

/* ==========================================================================
   § Scripts
   ========================================================================== */
gulp.task( 'scripts', () => {
    return gulp.src( 'source/scripts/**/*.js' )
        .pipe( gulp.dest( THEMEPATH + '/scripts' ) )
        .pipe( reload( {
            stream: true
        } ) );
} );

/* ==========================================================================
   § Styles
   ========================================================================== */
gulp.task( 'styles', () => {

    return gulp.src( [ 'source/styles/master.scss',
            'source/styles/webfonts.scss'
        ] )
        .pipe( $.plumber( PLUMBER_OPTIONS ) )
        .pipe( $.sourcemaps.init() )
        .pipe( $.sass.sync( {
            outputStyle: 'expanded',
            precision: 10,
            includePaths: [ '.' ]
        } ).on( 'error', $.sass.logError ) )
        .pipe( $.autoprefixer( {
            browsers: AUTOPREFIXER_BROWSERS
        } ) )
        .pipe( $.postcss( processors ) )
        .pipe( $.size( {
            'gzip': true
        } ) )
        .pipe( $.sourcemaps.write() )
        .pipe( gulp.dest( THEMEPATH + '/styles' ) )
        .pipe( reload( {
            stream: true
        } ) );
} );

/* ==========================================================================
   § Wiredep
   ========================================================================== */
gulp.task( 'wiredep', () => {
    gulp.src( 'source/styles/main.scss' )
        .pipe( wiredep( {
            ignorePath: /^(\.\.\/)+/,
            overrides: {
                'sanitize-css': {
                    'main': 'sanitize.scss'
                },
            }
        } ) )
        .pipe( gulp.dest( 'source/styles' ) );

    gulp.src( 'source/templates/views/__base.twig' )
        .pipe( wiredep( {
            exclude: [ /jquery/,
                'bower_components/modernizr/modernizr.js'
            ],
            ignorePath: /^(\.\.\/)*\.\./,
        } ) )
        .pipe( gulp.dest( 'source/templates/views' ) );
} );

