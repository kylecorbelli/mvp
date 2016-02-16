var mongoose = require('mongoose');

var CitySchema = new mongoose.Schema({
  annualCostOfHousing: Number,
  averageCommute: String,
  bachelorsOrHigher: String,
  costOfASunnyDay: Number,
  crimeIndex: Number,
  graduateOrProfessional: String,
  highSchoolOrHigher: String,
  imageUrl: String,
  januaryLow: Number,
  jsDevJobCount: Number,
  jsDevJobsPerThousand: Number,
  jsDevSalary: Number,
  julyHigh: Number,
  medianHomePrice: Number,
  medianRent: Number,
  name: String,
  numberOfDevIncomesNeededToAfford: Number,
  outdoorSpacePerPerson: Number,
  percentOwnerOccs: Number,
  percentRenters: Number,
  populationDensity: Number,
  povertyRate: String,
  pricePerSqFtOfOutdoorSpace: Number,
  propertyTaxRate: Number,
  rainyDays: Number,
  snowfall: Number,
  sunnyDays: Number,
  thirtyYearMortgageRate: Number,
  totalPopulation: Number,
  unemployment: String
});

module.exports = mongoose.model('City', CitySchema);