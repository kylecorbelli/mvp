var City = function(name, totalPopulation, populationDensity, crimeRating) {

};

City.prototype.constructor = City;
City.prototype.computeStats = function() {
  this.jsDevJobsPerThousand = this.jsDevJobCount / this.totalPopulation * 1000;
  this.outdoorSpacePerPerson = Math.pow(5280, 2) / this.populationDensity;
  this.numberOfDevIncomesNeededToBuyAHouse = null;
  if (isNaN(this.medianHomePrice)) {
    this.annualCostOfHousing = 12 * this.medianRent;
  } else {
    var annualRent = 12 * this.medianRent;
    var annualPITI = 12 * monthlyMortgagePITI(this.medianHomePrice, this.thirtyYearMortgageRate, this.propertyTaxRate);
    this.annualCostOfHousing = (this.percentRenters * annualRent) + (this.percentOwnerOccs * annualPITI);
    this.numberOfDevIncomesNeededToBuyAHouse = annualPITI / 0.35 / this.jsDevSalary;
    this.annualSavingsHouseOwner = (this.jsDevSalary * (1 - 0.28)) - annualPITI;
  }
  this.numberOfDevIncomesNeededToAfford = this.annualCostOfHousing / 0.35 / this.jsDevSalary;
  this.annualSavingsComposite = (this.jsDevSalary * (1 - 0.28)) - this.annualCostOfHousing;
  this.costOfASunnyDay = this.annualCostOfHousing / this.sunnyDays;
  this.pricePerSqFtOfOutdoorSpace = this.annualCostOfHousing / this.outdoorSpacePerPerson;
};

// Helper function to compute monthy Principal, Interest, Taxes and Insurance
function monthlyMortgagePITI(salePrice, annualIntRate, propTaxRate) {
  // Assumptions
  var mortgageAmount = salePrice * 0.9;
  var months = 12 * 30;
  var annualPropInsurance = 1500;
  var monthlyTax = salePrice * propTaxRate / 12;
  var monthlyPropInsurance = annualPropInsurance / 12;
  var monthlyIntRate = annualIntRate / 12;
  var prinAndInt = mortgageAmount * monthlyIntRate / (1 - Math.pow(1 + monthlyIntRate, -months));
  return prinAndInt + monthlyTax + monthlyPropInsurance;
}

// console.log(monthlyMortgagePITI(500000, 0.0365, 0.0089));

module.exports = City;
