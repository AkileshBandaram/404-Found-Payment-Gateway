const hre = require("hardhat");

async function main() {
  const CreditCardTokenization = await hre.ethers.getContractFactory("CreditCardTokenization");
  const creditCardTokenization = await CreditCardTokenization.deploy();

  await creditCardTokenization.deployed();

  console.log("CreditCardTokenization deployed to:", creditCardTokenization.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
