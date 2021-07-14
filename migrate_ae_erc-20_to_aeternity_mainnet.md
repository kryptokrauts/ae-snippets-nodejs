<p align="center">
  <a href="https://kryptokrauts.com">
    <img alt="kryptokrauts" src="https://kryptokrauts.com/img/logo.svg" width="60" />
  </a>
</p>
<h1 align="center">
  kryptokrauts.com
</h1>

This script can be used to migrate old AE (ERC-20) tokens from Ethereum to aeternity mainnet if you know the method params.

## Source Code
- [migrate_ae_erc-20_to_aeternity_mainnet.js](migrate_ae_erc-20_to_aeternity_mainnet.js)

## How to use

### Set environment variables (dependent on the entrypoint to call)
```shell
SECRET_KEY=<your secret/private key> // only required for the migrate entrypoint

ENTRYPOINT=<balance | root_hash | migrations_count | is_migrated | contained_in_merkle_tree | migrate>

ETH_ADDRESS=<the ETH address to check or migrate> // needs to be upper-case

AE_ADDRESS=<the AE address that should receive the tokens>

LEAF_INDEX=<the index of the leaf in the merkle tree, needed to calculate the root_hash>

SIBLINGS=<the siblings of the leaf, needed to calculate the root_hash>

SIGNATURE=<the ETH signature that signed the message containing the AE address>
```

**Note**

The **SIBLINGS** can be defined like this ...

```
SIBLINGS='["051BDA22F68DA9DF313AF7CECC674719144C0F8ECA3FAB3198D7142B9CEAAC26","0CAB2FB45014E7525AEE712958160543F6FD72F5240190FC3DD8D81DE8C50273","06C6A716161F47FAB561CBB8396780248730967D7A29BB168C07FEF3A4D350E3","8E50602C4E28386DEACF5E13B6E6A61A6DFAE36B9E173DB7A049303EC2E53DB3","1B4D4F067BAFCD1FCCB4460AC31A05EED48563E7045DC4EF996E7D8C3EEB9EFD","3BB0582BD65EA4C994CB9391533B782A7136FB711B47C512556A97313C973F26","F884BF2270FACB34FD0A7C49092B102DFB2E43C42D3D38B44E394D9A258AEE93","19DA2DF18294D5E3E264AEBB48DA4D3622457BDD1162C7416198C732978DC210","D2888B644AE539E259B2D104214239F30B810ADE99874B5EFE68A0FD77CBC1A5","AD206ED34B49DA709CF01A84D53489D7908D78952181E9E61C536799189FE411","2FF75575202A4A1D4DF8F0888967A9E9ABEB3C364FFF1C9E9D51A946C7AD30F3","58517514D61EA90D01AA0A8547BA02D98D393DE25A615FAB868828DF88CF6769","AEEAFA5E07BB461264A856B13C3C346DFCD870EE48C1D4CE40A69DA720A8E2BD","764CEF512A9223E21BD5650B55245188876A83B15BB5B3B418B87E28F1B74FB9","7195B9E30E43FA2F188D69C5F61BB75A00CF639E7925CAF4C1FD2AF32D976B0B"]'
```

... and obtained by calling the API of the current token-migration backend in the following order:
1. https://token-migration.aeternity.io/info/0x932Cf9910672B8a26BD31141Ff8f11e9b7dfa6e2 (providing the ETH address)
    - response:
        ```json
        {
            "index": 12183,
            "hash": "310E3A573B9299000F054D25F0D301CD314C081E4C4E03E8CC07B660B8B4CC95",
            "tokens": "349185165700000000000",
            "migrated": false,
            "migrateTxHash": ""
        }
        ```
    - this address has been migrated using this snippet and thus it is not marked as migrated in the backend
    - if you call the `is_migrated` entrypoint of the contract by providing the address in upper-case you will see that the address has been migrated successfully
1. https://token-migration.aeternity.io/siblings/12183 (providing the leaf index)
    - response:
        ```json
        {
            "status": true,
            "hashes": [
                "051BDA22F68DA9DF313AF7CECC674719144C0F8ECA3FAB3198D7142B9CEAAC26",
                "0CAB2FB45014E7525AEE712958160543F6FD72F5240190FC3DD8D81DE8C50273",
                "06C6A716161F47FAB561CBB8396780248730967D7A29BB168C07FEF3A4D350E3",
                "8E50602C4E28386DEACF5E13B6E6A61A6DFAE36B9E173DB7A049303EC2E53DB3",
                "1B4D4F067BAFCD1FCCB4460AC31A05EED48563E7045DC4EF996E7D8C3EEB9EFD",
                "3BB0582BD65EA4C994CB9391533B782A7136FB711B47C512556A97313C973F26",
                "F884BF2270FACB34FD0A7C49092B102DFB2E43C42D3D38B44E394D9A258AEE93",
                "19DA2DF18294D5E3E264AEBB48DA4D3622457BDD1162C7416198C732978DC210",
                "D2888B644AE539E259B2D104214239F30B810ADE99874B5EFE68A0FD77CBC1A5",
                "AD206ED34B49DA709CF01A84D53489D7908D78952181E9E61C536799189FE411",
                "2FF75575202A4A1D4DF8F0888967A9E9ABEB3C364FFF1C9E9D51A946C7AD30F3",
                "58517514D61EA90D01AA0A8547BA02D98D393DE25A615FAB868828DF88CF6769",
                "AEEAFA5E07BB461264A856B13C3C346DFCD870EE48C1D4CE40A69DA720A8E2BD",
                "764CEF512A9223E21BD5650B55245188876A83B15BB5B3B418B87E28F1B74FB9",
                "7195B9E30E43FA2F188D69C5F61BB75A00CF639E7925CAF4C1FD2AF32D976B0B"
            ]
        }
        ```

### Script execution
```shell
# install npm packages
npm install

# run the script
node migrate_ae_erc-20_to_aeternity_mainnet.js
```

## Support us
If you like our work we would appreciate your support. You can find multiple ways to support us here:

- https://kryptokrauts.com/support