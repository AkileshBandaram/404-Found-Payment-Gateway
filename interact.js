// const { ethers } = require("hardhat");

// async function main() {
//   const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//   const provider = ethers.provider;
//   const contract = await ethers.getContractAt("CreditCardTokenization", contractAddress);
//   // Access command-line arguments
//   const cardNumber =  "4111111111111111";
//   const exp =  "12/23";
//   const cvv =  "123";

//   const carddata = {
//     number: cardNumber,
//     exp: exp,
//     cvv: cvv
//   };
//   const carddata_string = JSON.stringify(carddata);
//   const token = await contract.generateToken(carddata_string);
//   console.log("Credit card token:", token);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });


const { ethers } = require("hardhat");

async function main() {
 
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const providerUrl = "http://127.0.0.1:8545"; // Localhost network URL
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const privateKey = "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e";
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = await ethers.getContractAt("CreditCardTokenization", contractAddress, wallet);
  
  // Rest of the code remains the same
  // ...

  const carddata = {
    number: process.argv[2] ,
    exp:  process.argv[3],
    cvv: process.argv[4] ,
    email:process.argv[5]
  };
  const carddata_string = JSON.stringify(carddata);
  const token = await contract.generateToken(carddata_string);
  console.log(token);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
