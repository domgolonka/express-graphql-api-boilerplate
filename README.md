# Apollostack GraphQL API Boilerplate in ES6
[![MIT License](https://img.shields.io/npm/l/stack-overflow-copy-paste.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Overview
A boilerplate to kickstart a GraphQL API based on apollostack and express

## Prerequisites
MongoDB has to be installed

## Getting started

Initialize databases SQLite and Mongo with fixtures data
```sh
npm run dev:setup
```

Start server:
```sh
# to get debug logs
npm run start:d
# OR
# without debug logs
npm start

# then open http://localhost:8080/graphql
```

Start test:
```sh
# without coverage
npm test

# with coverage
npm run test:cov
```

Other gulp tasks (need gulp globally installed):
```sh
# Wipe out dist and coverage directory
gulp clean

# Wipe out SQLite DBs
# always delete *.test.sqlite dbs
# delete *.dev.sqlite if NODE_ENV is not set or is equal to 'development'
gulp clean:sqlite

# Wipe out SQLite DB and add fixtures data
gulp setup:sequelize

# Reset MongoDB with fixtures data
gulp setup:mongo

# Lint code with ESLint
gulp lint

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

## TODO
+ scoped authorizations
+ token refresh & reset password
+ split gulp configs in several files
+ add CONTRIBUTING.md
+ add security : helmet, nsp, [do not use bodyParser](http://andrewkelley.me/post/do-not-use-bodyparser-with-express-js.html)
+ add logging with Winston or Bunyan
    e.g. http://aleksandrov.ws/2013/09/12/restful-api-with-nodejs-plus-mongodb/#a-namestep2a2-error-handling
+ add [greenkeeper](https://greenkeeper.io)
+ add auth from Linkedin etc.
+ think about move SQL models from /models to /api/RESOURCE_NAME/models.js

+ Some more ideas : typescript, [commitizen](https://github.com/commitizen/cz-cli), husky



## Contributing
Contributions, questions and comments are all welcome and encouraged.


## Credits
Heavily inspired by [KunalKapadia boilerplate](https://github.com/KunalKapadia/express-mongoose-es6-rest-api/) 