const { Universal, MemoryAccount, Node, Crypto } = require('@aeternity/aepp-sdk')
const fs = require('fs')

const CONTRACT_SOURCE = fs.readFileSync('./contracts/GovernanceRegistryInterface.aes', 'utf8')

const shutdown = (varName) => {
    console.error(`Missing ENV variable: ${varName}`)
    process.exit(1)
}

if(!process.env.SECRET_KEY) {
    shutdown('SECRET_KEY')
}
if(!process.env.DELEGATEE) {
    shutdown('DELEGATEE')
}

const KEYPAIR = {
    secretKey: process.env.SECRET_KEY,
    publicKey: Crypto.getAddressFromPriv(process.env.SECRET_KEY)
}
const DELEGATEE = process.env.DELEGATEE
const AE_NETWORK = process.env.AE_NETWORK || 'TESTNET'
const SETTINGS = {
    TESTNET: {
        nodeUrl: 'https://testnet.aeternity.io',
        compilerUrl: 'https://compiler.aepps.com',
        middlewareUrl: 'https://testnet.aeternity.io/mdw',
        contractAddress: 'ct_2nritSnqW6zooEL4g2SMW5pf12GUbrNyZ17osTLrap7wXiSSjf',
      },
    MAINNET: {
        nodeUrl: 'https://mainnet.aeternity.io',
        compilerUrl: 'https://compiler.aepps.com',
        middlewareUrl: 'https://mainnet.aeternity.io/mdw',
        contractAddress: 'ct_ouZib4wT9cNwgRA1pxgA63XEUd8eQRrG8PcePDEYogBc1VYTq',
    }
}

const main = async () => {
    const node = await Node({ url: SETTINGS[AE_NETWORK].nodeUrl })
    const client = await Universal({
        nodes: [
          { name: AE_NETWORK, instance: node },
        ],
        compilerUrl: SETTINGS[AE_NETWORK].compilerUrl,
        accounts: [MemoryAccount({ keypair: KEYPAIR })],
    })
    const contractInstance = await client.getContractInstance(CONTRACT_SOURCE, { contractAddress: SETTINGS[AE_NETWORK].contractAddress })
    const dryRunCall = await contractInstance.methods.delegate(DELEGATEE)
    console.log(dryRunCall)
}

main()