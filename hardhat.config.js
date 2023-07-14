require("@nomiclabs/hardhat-ethers");

module.exports = {
    solidity: "0.8.0",
    networks: {
      localhost: {
        url: "http://127.0.0.1:8545", // Replace with your local network URL if different
        chainId: 31337, // Replace with the chain ID of your local network if different
      },
    },
  };
