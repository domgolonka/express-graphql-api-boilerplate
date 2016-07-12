export const resolvers = {
  Query: {
    fortuneCookie(_, args, ctx) {
      return ctx.Fortunes.getOne(args);
    },
  },
};
