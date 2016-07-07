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

Other gulp tasks:
```sh
# Wipe out dist and coverage directory
gulp clean

# Wipe out SQLite DB
gulp clean:sqlite

# Wipe out SQLite DB and add fixtures data
gulp dev:setup:sequelize

# Reset MongoDB with fixtures data
gulp dev:setup:mongo

# Lint code with ESLint
gulp lint

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

## TODO
+ add tests with code coverage
+ add CONTRIBUTING.md
+ add security : jwt helmet nsp
+ add logging with Winston or Bunyan
+ Some more ideas : typescript, [commitizen](https://github.com/commitizen/cz-cli), husky



## Contributing
Contributions, questions and comments are all welcome and encouraged.


## Credits
Heavily inspired by [KunalKapadia boilerplate](https://github.com/KunalKapadia/express-mongoose-es6-rest-api/) 