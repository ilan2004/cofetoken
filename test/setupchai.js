const chai = require("chai");
const BN = web3.utils.BN;

try {
  // Make sure to load chai-as-promised before chai-bn
  const chaiAsPromised = require("chai-as-promised");
  chai.use(chaiAsPromised);
} catch (error) {
  console.warn("Warning: Could not load chai-as-promised", error.message);
}

try {
  const chaiBN = require("chai-bn")(BN);
  chai.use(chaiBN);
} catch (error) {
  console.warn("Warning: Could not load chai-bn", error.message);
}

module.exports = chai;