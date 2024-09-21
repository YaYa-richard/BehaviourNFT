# user-behavior-nft-project

Key words: Hardhat, React, MongoDB, IPFS, Hardhat testnet

## 下载依赖

```shell
cd backend && yarn install && cd ../frontend && yarn install && cd ../contract && yarn install
```

## 安装 MongoDB

## backend

```shell
node server.js
```

## frontend

##前端已修改，可显示全部评论，每页 10 条，查找评论后可返回页面

```shell
yarn start
```

## contract

启动 Hardhat 本地网络

```shell
yarn hardhat node
```

部署

```shell
yarn hardhat run ignition/modules/deploy.js --network localhost
```
