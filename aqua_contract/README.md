![Dojo Starter](./assets/cover.png)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/mark-dark.svg">
  <img alt="Dojo logo" align="right" width="120" src=".github/mark-light.svg">
</picture>

<a href="https://x.com/ohayo_dojo">
<img src="https://img.shields.io/twitter/follow/dojostarknet?style=social"/>
</a>
<a href="https://github.com/dojoengine/dojo/stargazers">
<img src="https://img.shields.io/github/stars/dojoengine/dojo?style=social"/>
</a>

[![discord](https://img.shields.io/badge/join-dojo-green?logo=discord&logoColor=white)](https://discord.com/invite/dojoengine)
[![Telegram Chat][tg-badge]][tg-url]

[tg-badge]: https://img.shields.io/endpoint?color=neon&logo=telegram&label=chat&style=flat-square&url=https%3A%2F%2Ftg.sumanjay.workers.dev%2Fdojoengine
[tg-url]: https://t.me/dojoengine

# Dojo Starter: Official Guide

A quickstart guide to help you build and deploy your first Dojo provable game.

Read the full tutorial [here](https://dojoengine.org/tutorial/dojo-starter).

## Running Locally

#### Terminal one (Make sure this is running)

```bash
# Run Katana
katana --dev --dev.no-fee
```

#### Terminal two

```bash
# Build the example
sozo build

# Inspect the world
sozo inspect

# Migrate the example
sozo migrate

# Start Torii
# Replace <WORLD_ADDRESS> with the address of the deployed world from the previous step
torii --world <WORLD_ADDRESS> --http.cors_origins "*"
```

## Docker
You can start stack using docker compose. [Here are the installation instruction](https://docs.docker.com/engine/install/)

```bash
docker compose up
```
You'll get all services logs in the same terminal instance. Whenever you want to stop just ctrl+c

---

## Contribution

1. **Report a Bug**

    - If you think you have encountered a bug, and we should know about it, feel free to report it [here](https://github.com/dojoengine/dojo-starter/issues) and we will take care of it.

2. **Request a Feature**

    - You can also request for a feature [here](https://github.com/dojoengine/dojo-starter/issues), and if it's viable, it will be picked for development.

3. **Create a Pull Request**
    - It can't get better then this, your pull request will be appreciated by the community.

Happy coding!
 sozo inspect

 World  | Contract Address                                                   | Class Hash                                                         
--------+--------------------------------------------------------------------+--------------------------------------------------------------------
 Synced | 0x02239f77d69e7782b73516b1e0f8ab58fbb50d4f75efa47d5bd0e83781dc1363 | 0x04c60dc46a8ca8bb47675b7b914053cef769afbf0e340523187336b72bd71d1f 

 Namespaces | Status | Dojo Selector                                                      
------------+--------+--------------------------------------------------------------------
 aqua_stark | Synced | 0x03e818a8be3e6f0bb01b1d02706592d8b20c6dd961b9168f45accb614f8c3340 

 Contracts            | Status  | Is Initialized | Dojo Selector                                                      | Contract Address                                                   
----------------------+---------+----------------+--------------------------------------------------------------------+--------------------------------------------------------------------
 aqua_stark-AquaStark | Updated | true           | 0x036b88338009ecd825c9f2a8c7f36bcbf735885189870d6ac01d8349d9a4bb5f | 0x04147e44d80522ad0b28818f1f6111ff89f1d09208f121d65cc62bfb8980cf5d 

 Models                       | Status | Dojo Selector                                                      
------------------------------+--------+--------------------------------------------------------------------
 aqua_stark-AddressToUsername | Synced | 0x053ad6091f98fe421f4f6302f31dca2defcad06af005e68c4af5ad4a5c014672 
 aqua_stark-Aquarium          | Synced | 0x064c100659522d67b94111a0acc4fff370c80f8179e8b05c41bc6879f4b44e50 
 aqua_stark-AquariumCounter   | Synced | 0x066a6230ce132addfd543a8bbe8a492f6ceb84c56dded927d7df7a2e466b7b63 
 aqua_stark-AquariumFishes    | Synced | 0x012b499331b8efa024c82e896e4b265cd1b000858dd63f23c5540b704dd3dff2 
 aqua_stark-AquariumOwner     | Synced | 0x0761e55934d223f075b4b338a1dbbbc56540fbd576ffb7444b151515f4344549 
 aqua_stark-Decoration        | Synced | 0x013a68e0856ac44917c26ad12ea9c059e1a1221022c840421805f5492e442428 
 aqua_stark-DecorationCounter | Synced | 0x0254385a282ac12317e34eba4b5fbdef09a9a58110d865c40cdb2a7af911553b 
 aqua_stark-Fish              | Synced | 0x002c29d0c1c419653118b00904822377170068e57e95aea2c09d5141ec49d2d3 
 aqua_stark-FishCounter       | Synced | 0x052f89e44e4688401f1af4ca36b41deb2e61d1d29d9013c8b6f791a1d4da6afb 
 aqua_stark-FishOwner         | Synced | 0x06ed6304ac31d4bf7cd91f08eeb03d2a1691623f7a0b0628a241ec9a6a450b5f 
 aqua_stark-Game              | Synced | 0x066568178a05f2e1dbb927e95281f79d5bd1bda813f91611e92c3c7c0d758b0e 
 aqua_stark-GameCounter       | Synced | 0x0339374683057a56fdc87f3c2abb78175c1526f426b32d5332f854674743c874 
 aqua_stark-Player            | Synced | 0x061631ef100cb1050a69e40da1e089ee05a7c74a56e124bbf79c75f27b7d8f98 
 aqua_stark-PlayerCounter     | Synced | 0x02a92dc64be1f6980f79c5b2b3b150b2ee84299811cc2173a9f1f5d35872aa7c 
 aqua_stark-PlayerFish        | Synced | 0x065cb63951e7a779f56da9417ab123172d208c96f0e3c4db5ef817858d072032 
 aqua_stark-PlayerFishes      | Synced | 0x01b656e13a4cd136ac38fa7d898060e4def0d5c95cee677be97cac92b4b99237 
 aqua_stark-UsernameToAddress | Synced | 0x05a9aa8105f956596eaf34ace50b49fc0c6a7f69f686bad9c4704be991a4eb9d 

 Events                   | Status  | Dojo Selector                                                      
--------------------------+---------+--------------------------------------------------------------------
 aqua_stark-PlayerCreated | Updated | 0x06e38919b864f246a83eca36b4584f5f1206e54037ca0234793b4791cdb6ca79 