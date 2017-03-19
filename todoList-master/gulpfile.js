var gulp = require("gulp");
//添加版本号插件，根据文件内容生成哈希码
var rev = require("gulp-rev");
//替换引入文件插件
var revReplace = require("gulp-rev-replace");
//合并css文件和js文件
var useref = require("gulp-useref");
//压缩js代码插件
var uglify = require("gulp-uglify");
//文件过滤插件
var filter = require("gulp-filter");
//压缩css代码插件
var csso = require("gulp-csso");

gulp.task("default",function () {
    var jsFilter = filter("**/*.js",{restore:true});
    var cssFilter = filter("**/*.css",{restore:true});
    var indexHTMLFilter = filter(["**/*","!**/index.html"],{restore:true});
    return gulp.src("src/index.html")
        .pipe(useref())
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(csso())
        .pipe(cssFilter.restore)
        .pipe(indexHTMLFilter)
        .pipe(rev())
        .pipe(indexHTMLFilter.restore)
        .pipe(revReplace())
        .pipe(gulp.dest("dist"))
})


