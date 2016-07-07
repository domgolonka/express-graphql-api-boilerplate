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
    createCompany: (root, { siren }, ctx) => {
      const newC = new ctx.Companies({ siren });
      return newC.save();
    },
  },
  Company: {
    jobOffers(company) {
      return company.jobOffers();
    },
  },
};
