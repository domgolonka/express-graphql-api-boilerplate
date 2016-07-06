export const schema = [`
type Author {
  id: String!
  firstName: String
  lastName: String
  posts: [Post]
}
type Post {
  id: String!
  title: String
  text: String
  views: Int
  author: Author
}
`];

export * from './resolvers';
