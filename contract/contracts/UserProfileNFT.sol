// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UserProfileNFT is ERC721, Ownable {
    uint256 public tokenCounter;
    uint256 public nftPrice = 0.01 ether;
    uint256 public transactionFee = 0.001 ether;
    mapping(uint256 => uint256) public tokenExpiry;
    mapping(uint256 => bool) public tokenValid;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("UserProfileNFT", "UPNFT") {
        tokenCounter = 1;
    }

    function mintNFT(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenExpiry[tokenId] = block.timestamp + 1 days;
        tokenValid[tokenId] = true;
        tokenCounter++;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        if (block.timestamp > tokenExpiry[tokenId]) {
            return "Token expired";
        } else {
            return _tokenURIs[tokenId];
        }
    }

    function purchaseNFT(uint256 quantity) public payable {
        require(msg.value >= nftPrice * quantity, "Insufficient payment");
        uint256 totalFee = transactionFee * quantity;
        uint256 sellerAmount = msg.value - totalFee;
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = i + 1; // 根据购买数量生成tokenId
            require(tokenValid[tokenId], "Token is invalid");
            require(_exists(tokenId), "Token does not exist");
            address owner = ownerOf(tokenId);
            require(owner != msg.sender, "Cannot purchase your own NFT");
            _transfer(owner, msg.sender, tokenId);
            payable(owner).transfer(sellerAmount / quantity);
            tokenValid[tokenId] = false;
        }
        payable(owner()).transfer(totalFee);
    }

    function invalidateExpiredNFTs() public onlyOwner {
        for (uint256 tokenId = 1; tokenId < tokenCounter; tokenId++) {
            if (tokenValid[tokenId] && block.timestamp > tokenExpiry[tokenId]) {
                tokenValid[tokenId] = false;
            }
        }
    }

    function pricePerNFT() public view returns (uint256) {
        return nftPrice;
    }
}
