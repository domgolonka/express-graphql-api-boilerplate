export const resolvers = {
  Query: {
    user(_, args, ctx) {
      return ctx.Users.findOne({ where: args });
    },
    users(_, args, ctx) {
      return ctx.Users.find(args);
    },
  },
  Mutation: {
    createUser: (root, args, ctx) => {
      return ctx.Users.create(args);
    },
  },
};
