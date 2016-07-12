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
    createPost: (root, { authorId, tags, title, text }, ctx) => {
      return ctx.Authors.findOne({ where: { id: authorId } })
        .then((author) => {
          return author.createPost({ tags: tags.join(','), title, text });
        });
    },
  },
  Author: {
    posts(author) {
      return author.getPosts();
    },
  },
  Post: {
    author(post) {
      return post.getAuthor();
    },
  },
};
