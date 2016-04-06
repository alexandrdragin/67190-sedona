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
        "last 1 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
      ]}),
      mqpacker({
        sort: true })
    ]))
    .pipe(gulp.dest("css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))

    .pipe(server.reload({stream: true}));
});

gulp.task('clean', function() {
  gulp.src('build', {read: false})
    .pipe(clean())
  });

gulp.task('copy', function() {
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

<<<<<<< HEAD
gulp.task("build", ["style", "symbols", "images", "copy"], function() {
=======
gulp.task("build", ["clean", "style", "images", "copy"], function() {
>>>>>>> htmlacademy-adaptive/master
});
