// Dependencies
const gulp = require("gulp");
const copy = require("gulp-copy");
const clean = require("gulp-clean");

const browserSync = require("browser-sync").create();

const sourceMaps = require("gulp-sourcemaps");

const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require('gulp-clean-css');

const rollup = require("gulp-better-rollup");
const resolve = require('rollup-plugin-node-resolve');
const buble = require("rollup-plugin-buble");
const uglify = require("gulp-uglify-es").default;

// Project config
const config = {
  src: {
    folder: "./_src/",
    lib: "./_src/js/lib/lib.js",
  },
  dev: "./docs/",
  dist: "./dist/",
  name: require("./package").name,
};

//  Log the file changed to console
function logChange(path) {
  console.log("File changed --> \x1b[32m\u001b[1m " + path + "\x1b[0m");
}

// HTML processing
function copyHtml() {
  return gulp
    .src(config.src.folder + "**/*.html")
    .pipe(copy(config.dev, { prefix: 1 }));
}


// SCSS processing
function style() {
  return gulp
    .src(config.src.folder + "scss/style.scss")
    .pipe(sourceMaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(config.dev + "css/"))
    .pipe(browserSync.stream());
}


// JS processing
function copyScripts() {
  return gulp
    .src(config.src.folder + "js/index.js", { allowEmpty: true } )
    .pipe(gulp.dest(config.dev + "js/"));
};

function processDevScripts() {
  return gulp
    .src(config.dev + "js/index.js", { allowEmpty: true } )
    .pipe(sourceMaps.init())
    .pipe(
      rollup(
        {
          plugins: [
            resolve(),
            buble(),
          ],
        },
        [
          {
            format: "iife",
            file: "scripts.js",
            name: config.name,
          },
        ]
      )
    )
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(config.dev + "js/"));
}


// JS packages output
function packageScripts() {
  return gulp
    .src(config.src.lib, {
      allowEmpty: true,
    })
    .pipe(
      rollup(
        {
          plugins: [
            resolve(),
            buble(),
          ],
        },
        [
          {
            format: "es",
            file: config.name + ".esm.js",
            name: config.name,
          },
          {
            format: "umd",
            file: config.name + ".umd.js",
            name: config.name,
          },
          {
            format: "iife",
            file: config.name + ".js",
            name: config.name,
          },
        ]
      )
    )
    .pipe(uglify())
    .pipe(gulp.dest(config.dist));
}


// Empty the dev folder
function cleanDev() {
  return gulp
    .src(config.dev, {
      read: false,
      allowEmpty: true,
    })
    .pipe(clean());
}
// empty the dist folder
function cleanDist() {
  return gulp
    .src(config.dist, {
      read: false,
      allowEmpty: true,
    })
    .pipe(clean());
}


// BrowserSync and watch tasks
function server() {
  browserSync.init({
    server: {
      baseDir: config.dev,
    },
  });

  // Watch scss, html and js files for changes. Process the files then update the browserSync server
  gulp.watch(config.src.folder + "scss/**/*.scss", style);
  gulp
    .watch(config.src.folder + "**/*.html")
    .on("change", gulp.series(copyHtml, browserSync.reload));
  gulp
    .watch(config.src.folder + "**/*.js")
    .on("change", gulp.series(packageScripts, copyScripts, processDevScripts , browserSync.reload));
}


// Gulp tasks exported
exports.dev = gulp.series(packageScripts, copyHtml, style, copyScripts, processDevScripts, server);
exports.build = gulp.series(cleanDist, packageScripts);
exports.clean = gulp.series(cleanDist, cleanDev);
