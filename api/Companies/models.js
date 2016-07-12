import mongoose from 'mongoose';

const CompanySchema = mongoose.Schema({
  siren: String,
  siret: String,
  naf: String,
  description: String,
  jobOffers: [{
    title: String,
    description: String,
  }],
});


export const CompanyModel = mongoose.model('companies', CompanySchema);
