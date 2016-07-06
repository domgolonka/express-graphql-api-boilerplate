import { merge } from 'lodash';
import { schema as sqlSchema, resolvers as sqlResolvers } from './sql/schema';
import { schema as httpSchema, resolvers as httpResolvers } from './http/schema';

const rootSchema = [`
# the schema allows the following two queries:
type Query {
  author(firstName: String, lastName: String): Author
  authors(limit: Int): [Author]
  fortuneCookie: FortuneCookie
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
    authorId: String!
  ): Post
}

# we need to tell the server which types represent the root query
# and root mutation types
schema {
  query: Query
  mutation: Mutation
}
`];

const rootResolvers = {
  Query: {
    author(_, args, ctx) {
      return ctx.Authors.find({ where: args });
    },
    authors(_, args, ctx) {
      return ctx.Authors.findAll(args);
    },
    fortuneCookie(_, args, ctx) {
      return ctx.Fortunes.getOne(args);
    },
  },
  Mutation: {
    createAuthor: (root, args, ctx) => {
      return ctx.Authors.create(args);
    },
    // TODO via token
    createPost: (root, { authorId, tags, title, text }, ctx) => {
      return ctx.Authors.findOne({ where: { id: authorId } })
        .then((author) => {
          return author.createPost({ tags: tags.join(','), title, text });
        });
    },
  },
};

export const schema = [...rootSchema, ...sqlSchema, ...httpSchema];
export const resolvers = merge(rootResolvers, sqlResolvers, httpResolvers);
