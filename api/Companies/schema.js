export const schema = [`
type Company {
  id: String!
  siren: String
  description: String
  jobOffers: [JobOffer]
}
type JobOffer {
  id: String!
  title: String
  description: String
}
`];
