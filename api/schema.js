const typeDefinitions = `
type Author {
  id: Int! # the ! means that every author object _must_ have an id
  firstName: String
  lastName: String
  posts: [Post]
}
type Post {
  id: Int!
  title: String
  text: String
  views: Int
  author: Author
}

# the schema allows the following two queries:
type Query {
  author(firstName: String, lastName: String): Author
  authors(limit: Int): [Author]
  getFortuneCookie: String
}

# this schema allows the following two mutations:
type Mutation {
  createAuthor(
    firstName: String!
    lastName: String!
  ): Author

  createPost(
    tags: [String!]!
    title: String!
    text: String!
    authorId: Int!
  ): Post
}

# we need to tell the server which types represent the root query
# and root mutation types
schema {
  query: Query
  mutation: Mutation
}
`;

export default [typeDefinitions];