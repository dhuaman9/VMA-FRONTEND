const gulp = require('gulp');
const war = require('gulp-war');
const zip = require('gulp-zip');

gulp.task('war', function (callback) {
    gulp.src(['./dist/vmafrontend/**'])
        .pipe(war({
                welcome: 'index.html',
                displayName: 'vmafrontend',
        }))
        .pipe(zip('vmafrontend.war'))
        .pipe(gulp.dest("./dist"));
        callback();
});