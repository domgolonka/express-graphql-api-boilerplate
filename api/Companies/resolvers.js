export const resolvers = {
  Query: {
    company(_, args, ctx) {
      return ctx.Companies.findOne(args);
    },
    companies(_, args, ctx) {
      return ctx.Companies.find(args);
    },
  },
  Mutation: {
    createCompany: (root, args, ctx) => {
      const newC = new ctx.Companies(args);
      return newC.save();
    },
  },
  Company: {
    jobOffers(company) {
      return company.jobOffers;
    },
  },
};
