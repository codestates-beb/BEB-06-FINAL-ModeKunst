require("dotenv").config();
const Web3 = require("web3");
const fs = require("fs");
const { Server } = require("../db");
const rpcUrl = process.env.RPC_URL;
const serverPKey = process.env.SERVER_PKEY;


const abi20 = JSON.parse(fs.readFileSync('/Users/jangsam/Desktop/project/final/BEB-06-FINAL-ModeKunst/sever/contract/erc20/ICToken_sol_ICToken.abi').toString());
const byte20 = fs.readFileSync('/Users/jangsam/Desktop/project/final/BEB-06-FINAL-ModeKunst/sever/contract/erc20/ICToken_sol_ICToken.bin').toString();
const abi721 = JSON.parse(fs.readFileSync('/Users/jangsam/Desktop/project/final/BEB-06-FINAL-ModeKunst/sever/contract/erc721/NFTLootBox_sol_NFTLootBox.abi').toString());
const byte721 = fs.readFileSync('/Users/jangsam/Desktop/project/final/BEB-06-FINAL-ModeKunst/sever/contract/erc721/NFTLootBox_sol_NFTLootBox.bin').toString();


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
const faucet_token_amount = ''; // erc20 보상 토큰 양


module.exports = {
    web3,
    serverPKey,
    abi20,
    abi721,
    faucet_token_amount,
    getBalance,

}