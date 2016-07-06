import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';
import models from './models';

const plugins = gulpLoadPlugins();

const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**', '!coverage/**'],
  nonJs: ['./package.json', './.gitignore'],
  tests: './tests/*.js',
};

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', () =>
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: '.' })
    .pipe(plugins.newer('dist'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
      includeContent: false,
      sourceRoot(file) {
        return path.relative(file.path, __dirname);
      },
    }))
    .pipe(gulp.dest('dist'))
);

// Lint Javascript
gulp.task('lint', () =>
  gulp.src(paths.js)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
);

// Copy non-js files to dist
gulp.task('copy', () =>
  gulp.src(paths.nonJs)
    .pipe(plugins.newer('dist'))
    .pipe(gulp.dest('dist'))
);

gulp.task('dev:setup', ['clean', 'clean:db'], () => {
  return gulp.src('fixtures/**/*', { read: false })
    .pipe(plugins.sequelizeTestSetup({
      sequelize: models.sequelize,
      models,
      migrationsPath: 'migrations',
    }));
});

// Start server with restart on file changes
gulp.task('nodemon', ['lint', 'copy', 'babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'api', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['lint', 'copy', 'babel'],
    env: {
      NODE_ENV: 'development',
    },
  })
);

// Clean up dist and coverage directory
gulp.task('clean', () =>
  del(['dist/**', 'coverage/**', '!dist', '!coverage'])
);
gulp.task('clean:db', () =>
  del(['*.sqlite'])
);

// gulp serve for development
gulp.task('serve', ['clean'], () => runSequence('nodemon'));

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', ['clean'], () => {
  runSequence(
    ['copy', 'babel']
  );
});
