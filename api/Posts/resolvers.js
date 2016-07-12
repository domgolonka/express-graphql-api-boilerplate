export const resolvers = {
  Mutation: {
    createPost: (root, { authorId, tags, title, text }, ctx) => {
      return ctx.Authors.findOne({ where: { id: authorId } })
        .then((author) => {
          return author.createPost({ tags: tags.join(','), title, text });
        });
    },
  },
  Post: {
    author(post) {
      return post.getAuthor();
    },
  },
};
