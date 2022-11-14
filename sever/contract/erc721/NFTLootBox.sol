// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



import "/Users/jangsam/Desktop/project/final/BEB-06-FINAL-ModeKunst/sever/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "/Users/jangsam/Desktop/project/final/BEB-06-FINAL-ModeKunst/sever/node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "/Users/jangsam/Desktop/project/final/BEB-06-FINAL-ModeKunst/sever/node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "/Users/jangsam/Desktop/project/final/BEB-06-FINAL-ModeKunst/sever/node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "/Users/jangsam/Desktop/project/final/BEB-06-FINAL-ModeKunst/sever/node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTLootBox is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    IERC20 token;
    uint256 public _nftPrice;
    string public _name;
    string public _symbol;

    constructor(string memory name_, string memory symbol_, uint256 nftPrice_) ERC721(_name, _symbol){
        _name = name_;
        _symbol = symbol_;
        _nftPrice = nftPrice_;
    }

    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        require(token.balanceOf(recipient) > _nftPrice);

        token.transferFrom(recipient, msg.sender, _nftPrice);

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function setToken (address tokenAddress) public onlyOwner returns (bool) {
        require(tokenAddress != address(0x0));
        token = IERC20(tokenAddress);
        return true;
    }

    function setNftPrice (uint256 nftPrice_) public onlyOwner returns (uint256){
        _nftPrice = nftPrice_;
        return _nftPrice;
    }

}