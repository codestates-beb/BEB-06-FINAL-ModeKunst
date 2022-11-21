// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "/Users/imjinseon/Desktop/codestates/BEB-06-FINAL-ModeKunst/sever/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "/Users/imjinseon/Desktop/codestates/BEB-06-FINAL-ModeKunst/sever/node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "/Users/imjinseon/Desktop/codestates/BEB-06-FINAL-ModeKunst/sever/node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "/Users/imjinseon/Desktop/codestates/BEB-06-FINAL-ModeKunst/sever/node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "/Users/imjinseon/Desktop/codestates/BEB-06-FINAL-ModeKunst/sever/node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";




contract NFTLootBox is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public _nftPrice;
    string public _name;
    string public _symbol;
    uint256 private _totalSupply = 0;

    constructor(string memory name_, string memory symbol_ ) ERC721(_name, _symbol){
        _name = name_;
        _symbol = symbol_;
    }

    function totalSupply() public view virtual  returns (uint256){
        return _totalSupply;
    }

    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _totalSupply +=1;

        return newItemId;
    }

}
