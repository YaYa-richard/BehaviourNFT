// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UserProfileNFT is ERC721, Ownable {
    uint256 public tokenCounter;
    uint256 public validCounter;//有效指针，在validCounter之前的NFT都标记为无效
    uint256 public nftPrice = 0.01 ether;
    uint256 public transactionFee = 0.001 ether;
    mapping(uint256 => uint256) public tokenExpiry;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("UserProfileNFT", "UPNFT") {
        tokenCounter = 0;
        validCounter = 0;
    }

    function mintNFT(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenExpiry[tokenId] = block.timestamp + 1 days;
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
        for (uint256 i = validCounter; i < validCounter + quantity; i++) {
            uint256 tokenId = i; // 根据购买数量生成tokenId
            require(_exists(tokenId), "Token does not exist");
            address owner = ownerOf(tokenId);
            require(owner != msg.sender, "Cannot purchase your own NFT");
            _transfer(owner, msg.sender, tokenId);
            payable(owner).transfer(sellerAmount / quantity);
        }
        payable(owner()).transfer(totalFee);
    }

    function invalidateExpiredNFTs() public onlyOwner {
        uint256 j = validCounter;
        for (uint256 tokenId = j; tokenId < tokenCounter; tokenId++) {
            if (block.timestamp > tokenExpiry[tokenId]) {
                validCounter = tokenId;
            }
        }
    }

    function pricePerNFT() public view returns (uint256) {
        return nftPrice;
    }
    function getValidCounter() public view returns (uint256) {
        return validCounter;
    }
}
