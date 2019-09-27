var folderToMove = [
  'scripts',
  'src',
  'www'
];

gulp.task('move',['clean'], function(){
  folderToMove.foreach(
    folder => gulp.src(`./${folder}/*`, { base: './' })
      .pipe(gulp.dest(`../../${folder}`))
  );
});