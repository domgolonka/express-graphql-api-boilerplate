import { merge } from 'lodash';
import { schema as AuthorsSchema, resolvers as AuthorsResolvers } from './Authors';
import { schema as PostsSchema, resolvers as PostsResolvers } from './Posts';
import { schema as FortunesSchema, resolvers as FortunesResolvers } from './Fortunes';
import { schema as CompanySchema, resolvers as CompanyResolvers } from './Companies';

const rootSchema = [`
type Query {
  author(firstName: String, lastName: String): Author
  authors(limit: Int): [Author]
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
];
export const resolvers = merge(
  AuthorsResolvers,
  PostsResolvers,
  FortunesResolvers,
  CompanyResolvers
);
