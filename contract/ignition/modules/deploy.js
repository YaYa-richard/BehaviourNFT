const fs = require("fs");
const path = require("path");

async function main() {
    // 获取合约工厂
    const UserProfileNFT = await ethers.getContractFactory("UserProfileNFT");

    // 部署合约
    const userProfileNFT = await UserProfileNFT.deploy();

    // 等待合约部署完成
    await userProfileNFT.waitForDeployment();
    console.log(`userProfileNFT 合约已部署到地址: ${userProfileNFT.target}`);

    // 读取 ABI
    const artifactPath = path.join(
        __dirname,
        "../../artifacts/contracts/UserProfileNFT.sol/UserProfileNFT.json"
    );
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abi = artifact.abi;

    // 合约 ABI 和地址
    const contractInfo = {
        address: userProfileNFT.target,
        abi: abi,
    };

    // 定义输出路径
    const backendOutputPath = path.join(
        __dirname,
        "../../../backend/contracts/UserProfileNFT.json"
    );
    const frontendOutputPath = path.join(
        __dirname,
        "../../../frontend/src/contracts/UserProfileNFT.json"
    );

    // 将 ABI 和地址写入文件
    fs.writeFileSync(
        backendOutputPath,
        JSON.stringify(contractInfo, null, 2),
        "utf8"
    );
    fs.writeFileSync(
        frontendOutputPath,
        JSON.stringify(contractInfo, null, 2),
        "utf8"
    );

    console.log(`Contract ABI and address have been written`);
}

// 执行部署脚本
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in deployment script:", error);
        process.exit(1);
    });
