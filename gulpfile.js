"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");

var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");

var copy = require('gulp-contrib-copy');
var clean = require('gulp-contrib-clean');

var server = require("browser-sync");

var reporter     = require('postcss-reporter');
var syntax_scss  = require('postcss-scss');
var stylelint    = require('stylelint');
var htmllint = require('gulp-htmllint');
var gutil = require('gulp-util');

gulp.task("symbols", function() {
    gulp.src("img/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("img"));
});

gulp.task("images", function() {
    return gulp.src("img/**/*.{png,jpg,gif}")
      .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true
    }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 3 Edge versions"
      ]}),
      mqpacker({
        sort: true })
    ]))
    .pipe(gulp.dest("css"))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))

    .pipe(server.reload({stream: true}));
});

gulp.task("style-linter", function() {
  var processors = [
    stylelint(),
    reporter({
      throwError: true
    })
  ];
  return gulp.src(['sass/**/*.scss'])
    .pipe(plumber())
    .pipe(postcss(processors, {syntax: syntax_scss}))
});

gulp.task("html-linter", function() {
  return gulp.src('*.html')
    .pipe(htmllint({}, htmllintReporter));
});

function htmllintReporter(filepath, issues) {
  if (issues.length > 0) {
    issues.forEach(function(issue) {
      gutil.log(gutil.colors.cyan('[gulp-htmllint] ') + gutil.colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + gutil.colors.red('(' + issue.code + ') ' + issue.msg));
    });

    process.exitCode = 1;
  }
}

gulp.task("clean", function() {
  gulp.src('build', {read: false})
    .pipe(clean())
  });

gulp.task("copy", function() {
  gulp.src("*.html").pipe(gulp.dest("build"));
  gulp.src("fonts/**/*.{woff,woff2}").pipe(gulp.dest("build/fonts"));
  gulp.src("img/**.{png,jpg,gif,svg}").pipe(gulp.dest("build/img"));
  gulp.src("js/**.js").pipe(gulp.dest("build/js"));
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
  gulp.watch("css/*.css").on("change", server.reload);
});


gulp.task("build", ["clean", "style", "images", "copy"], function() {
});
