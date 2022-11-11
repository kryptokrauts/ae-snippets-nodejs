const { AeSdk, MemoryAccount, Node, getAddressFromPriv } = require('@aeternity/aepp-sdk')
const CONTRACT_ACI = require('./aci/GovernanceRegistryACI.json')

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
    publicKey: getAddressFromPriv(process.env.SECRET_KEY)
}
const DELEGATEE = process.env.DELEGATEE
const AE_NETWORK = process.env.AE_NETWORK || 'TESTNET'
const SETTINGS = {
    TESTNET: {
        nodeUrl: 'https://testnet.aeternity.io',
        contractAddress: 'ct_2nritSnqW6zooEL4g2SMW5pf12GUbrNyZ17osTLrap7wXiSSjf',
      },
    MAINNET: {
        nodeUrl: 'https://mainnet.aeternity.io',
        contractAddress: 'ct_ouZib4wT9cNwgRA1pxgA63XEUd8eQRrG8PcePDEYogBc1VYTq',
    }
}

const main = async () => {
    const node = new Node(SETTINGS[AE_NETWORK].nodeUrl)
    const aeSdk = new AeSdk({
        nodes: [
          { name: AE_NETWORK, instance: node },
        ],
        accounts: [MemoryAccount({ keypair: KEYPAIR })],
    })
    const contractInstance = await aeSdk.getContractInstance({ aci: CONTRACT_ACI, contractAddress: SETTINGS[AE_NETWORK].contractAddress })
    const delegateTx = await contractInstance.methods.delegate(DELEGATEE)
    console.log(delegateTx)
}

main()