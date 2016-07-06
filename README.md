# express-graphql-api-boilerplate
A boilerplate to kickstart a GraphQL API base on apollostack

# Getting started

Start server:
```sh
# to get debug logs
npm run start:d
# OR
# without debug logs
npm start
```

Other gulp tasks:
```sh
# Wipe out dist and coverage directory
gulp clean

# Lint code with ESLint
gulp lint

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

## TODO
add [eslint-plugin-graphql](https://github.com/apollostack/eslint-plugin-graphql)
add typescript
add https://github.com/commitizen/cz-cli and https://github.com/commitizen/cz-conventional-changelog
add husky ?
add security
    jwt
    helmet
    nsp
add logging with Winston or [Bunyan](https://www.npmjs.com/package/gulp-nodemon#bunyan-logger-integration)
add tests with code coverage

## Credits
Heavily inspired by [KunalKapadia boilerplate](https://github.com/KunalKapadia/express-mongoose-es6-rest-api/) 