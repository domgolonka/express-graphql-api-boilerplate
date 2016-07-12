import { merge } from 'lodash';
import { schema as AuthorsSchema, resolvers as AuthorsResolvers } from './Authors';
import { schema as CompanySchema, resolvers as CompanyResolvers } from './Companies';
import { schema as FortunesSchema, resolvers as FortunesResolvers } from './Fortunes';
import { schema as PostsSchema, resolvers as PostsResolvers } from './Posts';
import { schema as UsersSchema, resolvers as UsersResolvers } from './Users';

const rootSchema = [`
type Query {
  author(firstName: String, lastName: String): Author
  authors(limit: Int): [Author]
  user(email: String, username: String): User
  users: [User]
  fortuneCookie: FortuneCookie
  companies: [Company]
  company(siren: String): Company
}

type Mutation {
  createAuthor(
    firstName: String!
    lastName: String!
  ): Author

  createPost(
    tags: [String!]!
    title: String!
    text: String!
    authorId: String!
  ): Post
  
  createCompany(
    siren: String!
    description: String
  ): Company
  
  createUser(
    email: String!
    username: String!
    password: String!
  ): User
}

schema {
  query: Query
  mutation: Mutation
}
`];

export const schema = [
  ...rootSchema,
  ...AuthorsSchema,
  ...CompanySchema,
  ...FortunesSchema,
  ...PostsSchema,
  ...UsersSchema,
];
export const resolvers = merge(
  AuthorsResolvers,
  PostsResolvers,
  FortunesResolvers,
  CompanyResolvers,
  UsersResolvers
);
