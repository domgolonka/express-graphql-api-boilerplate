export const resolvers = {
  Query: {
    author(_, args, ctx) {
      return ctx.Authors.find({ where: args });
    },
    authors(_, args, ctx) {
      return ctx.Authors.findAll(args);
    },
  },
  Mutation: {
    createAuthor: (root, args, ctx) => {
      return ctx.Authors.create(args);
    },
  },
  Author: {
    posts(author) {
      return author.getPosts();
    },
  },
};
