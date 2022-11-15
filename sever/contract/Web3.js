require("dotenv").config();
const Web3 = require("web3");
const fs = require("fs");
const path = require("path");
const { Server } = require("../models");
const rpcUrl = process.env.RPC_URL;
const serverPKey = process.env.SERVER_PKEY;

const abi20 = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, ".", "erc20", "ICToken_sol_ICToken.abi"))
    .toString()
);
const byte20 = fs
  .readFileSync(path.join(__dirname, ".", "erc20", "ICToken_sol_ICToken.bin"))
  .toString();
const abi721 = JSON.parse(
  fs
    .readFileSync(
      path.join(__dirname, ".", "erc721", "NFTLootBox_sol_NFTLootBox.abi")
    )
    .toString()
);
const byte721 = fs
  .readFileSync(
    path.join(__dirname, ".", "erc721", "NFTLootBox_sol_NFTLootBox.bin")
  )
  .toString();

const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl)); //가나슈와 연동한 web3

async function getGanacheAddress(num) {
  try {
    const ganacheAddress = await web3.eth.getAccounts();
    return ganacheAddress[num];
  } catch (e) {
    console.error(e);
    return e;
  }
}

async function getBalance(addr) {
  try {
    return await web3.eth.getBalance(addr).then((bal) => {
      return web3.utils.fromWei(bal, "ether");
    });
  } catch (e) {
    console.error(e);
    return e;
  }
}

const tokenName = "MODE_Token"; // erc20, erc721 토큰 name
const tokenSymbol = "MODE"; // erc20, erc721 토큰 symbol
const faucet_token_amount = ""; // erc20 보상 토큰 양

module.exports = {
  web3,
  serverPKey,
  abi20,
  abi721,
  faucet_token_amount,
  getBalance,

  getAddress: async (password) => {
    try {
      console.log(`입력받은 password : ${password}`);
      return await web3.eth.personal.newAccount(password);
    } catch (e) {
      console.log("web3 에러");
      console.log(e);
    }
  },

  insertServerAddress: async () => {
    try {
      const server_addr = await getGanacheAddress(0);

      const server_eth = await getBalance(server_addr);

      if (server_addr) {
        try {
          const create = await Server.findOrCreate({
            where: { address: server_addr },
            defaults: {
              address: server_addr,
              eth_amount: server_eth,
            },
          });

          if (create[1]) {
            console.log(`서버 EOA 계정을 추가합니다.`);
          } else {
            console.log(`서버 EOA가 이미 존재합니다.`);
          }
        } catch (e) {
          console.log("sequelize Err");
          console.log(e);
        }
      }
    } catch (e) {
      console.log("Ganache Err");
      console.log(e);
    }
  },

  deploy20: async () => {
    let ca;
    const server_addr = await getGanacheAddress(0);

    try {
      const erc20 = await Server.findOne({
        attributes: ["erc20"],
        where: { address: server_addr },
      });
      if (!erc20.dataValues.erc20) {
        let contract20 = await new web3.eth.Contract(abi20);

        try {
          await contract20
            .deploy({ data: byte20, arguments: [tokenName, tokenSymbol] })
            .send({ from: server_addr, gas: 1416733 })
            .then((result) => (ca = result._address));

          contract20 = await new web3.eth.Contract(abi20, ca);

          const token_amount = await contract20.methods
            .balanceOf(server_addr)
            .call();
          const server_eth = await getBalance(server_addr);
          const erc20_name = await contract20.methods.name().call();
          const erc20_symbol = await contract20.methods.symbol().call();

          try {
            await Server.update(
              {
                erc20: ca,
                token_amount: token_amount,
                erc20_name: erc20_name,
                erc20_symbol: erc20_symbol,
              },
              {
                where: { address: server_addr },
              }
            );

            console.log("ERC20을 생성합니다.");
          } catch (e) {
            console.log(`sequelize Err`);
            console.log(e);
          }
        } catch (e) {
          console.log(`Web3 deploy erc20 Err`);
          console.log(e);
        }
      } else {
        console.log("ERC20이 이미 존재합니다.");
      }
    } catch (e) {
      console.log(`deploy20 Err`);
      console.log(e);
    }
  },

  deploy721: async () => {
    let ca;
    const server_addr = await getGanacheAddress(0);
    try {
      const erc721 = await Server.findOne({
        attributes: ["erc721"],
        where: { address: server_addr },
      });

      if (!erc721.dataValues.erc721) {
        let contract721 = await new web3.eth.Contract(abi721);

        try {
          await contract721
            .deploy({ data: byte721, arguments: [tokenName, tokenSymbol, 100] })
            .send({ from: server_addr, gas: 3054460 })
            .then((result) => (ca = result._address));

          contract721 = await new web3.eth.Contract(abi721, ca);
          const server_eth = await getBalance(server_addr);
          const erc721_name = await contract721.methods._name().call();
          const erc721_symbol = await contract721.methods._symbol().call();

          try {
            await Server.update(
              {
                erc721: ca,
                erc721_name: erc721_name,
                erc721_symbol: erc721_symbol,
                eth_amount: server_eth,
              },
              {
                where: { address: server_addr },
              }
            );
          } catch (e) {
            console.log(`sequelize Err`);
            console.log(e);
          }
        } catch (e) {
          console.log(`Web3 deploy erc721 Err`);
          console.log(e);
        }
      }
    } catch (e) {
      console.log(`deploy721 Err`);
      console.log(e);
    }
  },
};
