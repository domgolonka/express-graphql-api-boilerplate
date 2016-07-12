const debug = require('debug')('express-graphql-api-boilerplate:gulpfile.babel');
import bcrypt from 'bcrypt';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';
import models from './models';
import config from 'config';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

const plugins = gulpLoadPlugins();
debug('Loaded plugins : ', ...Object.keys(plugins));

const paths = {
  js: [
    './**/*.js',
    '!dist/**', '!node_modules/**', '!coverage/**', '!fixtures/**', '!**/*.test.js',
  ],
  nonJs: ['./package.json', './.gitignore'],
  tests: ['**/*.test.js', '!node_modules/**'],
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
gulp.task('lint:test', () =>
  gulp.src(paths.tests)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
);

gulp.task('lint', ['lint:test'], () =>
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

function hashPasswordSync(user) {
  user.password = bcrypt.hashSync(user.password, 10); // eslint-disable-line no-param-reassign
  return user;
}

// Initialize mongoDB with fixtures data
gulp.task('setup:mongo', () => {
  return gulp.src('fixtures/mongodb/**/*')
    .pipe(plugins.jsonTransform((data, file) => {
      if (file.relative === 'users.json') {
        data = data.map(hashPasswordSync); // eslint-disable-line no-param-reassign
      }
      return data;
    }))
    .pipe(plugins.mongodbData({
      mongoUrl: config.get('mongo.connString'),
      dropCollection: true,
    }));
});
// clean sqlite databases
gulp.task('clean:sqlite', () => {
  const toRemove = ['*.test.sqlite'];
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    toRemove.push('*.dev.sqlite');
  }
  return del(toRemove);
});
// Initialize SQLite with fixtures data
gulp.task('setup:sequelize', ['clean:sqlite'], () => {
  return gulp.src('fixtures/sequelize/**/*', { read: false })
    .pipe(plugins.sequelizeTestSetup({
      sequelize: models.sequelize,
      models,
      migrationsPath: 'migrations',
    }));
});
gulp.task('setup', ['clean', 'setup:sequelize', 'setup:mongo']);

// Start server with restart on file changes
gulp.task('nodemon', ['lint', 'copy', 'babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'api', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js', '**/*.test.js'],
    tasks: ['lint', 'copy', 'babel'],
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development',
    },
  })
);

// Clean up dist and coverage directory
gulp.task('clean', () =>
  del(['dist/**', 'coverage/**', '!dist', '!coverage'])
);

// gulp serve for development
gulp.task('serve', ['clean'], () => runSequence('nodemon'));

gulp.task('coverage', () =>
  gulp.src(paths.js)
    .pipe(plugins.babelIstanbul())
    .pipe(plugins.babelIstanbul.hookRequire()) // or you could use .pipe(injectModules())
);

gulp.task('test:cov', ['setup', 'coverage'], () => {
  chai.should();
  chai.use(chaiAsPromised);

  return gulp.src(paths.tests)
    .pipe(plugins.babel())
    .pipe(plugins.injectModules())
    .pipe(plugins.mocha({
      reporter: 'spec',
      globals: {
        chai,
      },
    }))
    .pipe(plugins.babelIstanbul.writeReports())
    .pipe(plugins.babelIstanbul.enforceThresholds({ thresholds: { global: 90 } }));
});
gulp.task('test', ['setup'], () => {
  chai.should();
  chai.use(chaiAsPromised);

  return gulp.src(paths.tests)
    .pipe(plugins.babel())
    .pipe(plugins.injectModules())
    .pipe(plugins.mocha({
      reporter: 'spec',
      globals: {
        chai,
      },
    }));
});

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', ['clean'], () => {
  runSequence(
    ['copy', 'babel']
  );
});
