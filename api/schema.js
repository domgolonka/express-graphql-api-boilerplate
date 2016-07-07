import { merge } from 'lodash';
import { schema as sqlSchema, resolvers as sqlResolvers } from './sql/schema';
import { schema as httpSchema, resolvers as httpResolvers } from './http/schema';
import { schema as mongoSchema, resolvers as mongoResolvers } from './mongo/schema';

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

export const schema = [...rootSchema, ...sqlSchema, ...httpSchema, ...mongoSchema];
export const resolvers = merge(sqlResolvers, httpResolvers, mongoResolvers);
