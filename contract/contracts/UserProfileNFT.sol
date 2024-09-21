// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UserProfileNFT is ERC721, Ownable {
    uint256 public tokenCounter; // NFT 的计数器，用于生成唯一的 tokenId
    uint256 public nftPrice = 0.01 ether; // NFT 的价格
    uint256 public transactionFee = 0.001 ether; // 交易手续费
    mapping(uint256 => uint256) public tokenExpiry; // NFT 的过期时间
    mapping(uint256 => bool) public tokenValid; // NFT 的有效性
    mapping(uint256 => string) private _tokenURIs; // NFT 的元数据 URI

    constructor() ERC721("UserProfileNFT", "UPNFT") {
        tokenCounter = 1; // 初始化 tokenId 计数器为 1
    }

    function mintNFT(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = tokenCounter; // 生成新的 tokenId
        _safeMint(to, tokenId); // 铸造 NFT，并将其所有权转移到指定地址
        _setTokenURI(tokenId, tokenURI); // 设置 NFT 的元数据 URI
        tokenExpiry[tokenId] = block.timestamp + 1 days; // 设置 NFT 的过期时间为当前时间加上 1 天
        tokenValid[tokenId] = true; // 将 NFT 标记为有效
        tokenCounter++; // 增加 tokenId 计数器
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        ); // 确保 tokenId 对应的 NFT 存在
        _tokenURIs[tokenId] = _tokenURI; // 设置 NFT 的元数据 URI
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        ); // 确保 tokenId 对应的 NFT 存在
        if (block.timestamp > tokenExpiry[tokenId]) {
            return "Token expired"; // 如果 NFT 已过期，返回 "Token expired"
        } else {
            return _tokenURIs[tokenId]; // 否则返回 NFT 的元数据 URI
        }
    }

    function purchaseNFT(uint256 quantity) public payable {
        require(msg.value >= nftPrice * quantity, "Insufficient payment"); // 确保支付的金额足够购买指定数量的 NFT
        uint256 totalFee = transactionFee * quantity; // 计算总的交易手续费
        uint256 sellerAmount = msg.value - totalFee; // 计算卖家应收的金额
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = i + 1; // 根据购买数量生成 tokenId
            require(tokenValid[tokenId], "Token is invalid"); // 确保 tokenId 对应的 NFT 有效
            require(_exists(tokenId), "Token does not exist"); // 确保 tokenId 对应的 NFT 存在
            address owner = ownerOf(tokenId); // 获取 NFT 的当前所有者
            require(owner != msg.sender, "Cannot purchase your own NFT"); // 确保购买者不是 NFT 的当前所有者
            _transfer(owner, msg.sender, tokenId); // 将 NFT 的所有权从当前所有者转移到购买者
            payable(owner).transfer(sellerAmount / quantity); // 将卖家应收的金额转账给卖家
            tokenValid[tokenId] = false; // 将 NFT 标记为无效
        }
        payable(owner()).transfer(totalFee); // 将总的交易手续费转账给合约的所有者
    }

    function invalidateExpiredNFTs() public onlyOwner {
        for (uint256 tokenId = 1; tokenId < tokenCounter; tokenId++) {
            if (tokenValid[tokenId] && block.timestamp > tokenExpiry[tokenId]) {
                tokenValid[tokenId] = false; // 将过期的 NFT 标记为无效
            }
        }
    }

    function pricePerNFT() public view returns (uint256) {
        return nftPrice; // 返回每个 NFT 的价格
    }
}
