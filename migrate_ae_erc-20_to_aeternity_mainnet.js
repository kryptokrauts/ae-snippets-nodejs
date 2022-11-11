const { AeSdk, MemoryAccount, Node, getAddressFromPriv } = require('@aeternity/aepp-sdk')
const CONTRACT_ACI = require('./aci/TokenMigrationACI.json')

// the keypair to use for transactions
let keypair

// the entrypoint to call
let entrypoint

let params = []

const shutdown = (varName) => {
    console.error(`Missing ENV variable: ${varName}`)
    process.exit(1)
}

const setParams = (expectedVariables) => {
    for(let i=0; i<expectedVariables.length; i++) {
        const param = process.env[expectedVariables[i]]
        if(!param) {
            shutdown(expectedVariables[i])
        }
        if(expectedVariables[i] === 'SIBLINGS') {
            // load array
            params.push(JSON.parse(param))
        } else if(expectedVariables[i] === 'SIGNATURE') {
            // manipulate signature if required (for whatever reason?!)
            // https://github.com/aeternity/aepp-token-migration-backend/blob/master/rest_api/base/base_api.go#L260
            let signature = param.substring(2)
            let vValue = signature.substring(signature.length - 2)
            switch(vValue) {
                case '00':
                case '27':
                    vValue = '1b'
                    break
                case '01':
                case '28':
                    vValue = '1c'
                    break
                default:
                    break
            }
            params.push(vValue + signature.substring(0, signature.length - 2))
        } else {
            params.push(param)
        }
    }
}

const processEnvironmentInput = () => {
    entrypoint = process.env.ENTRYPOINT
    if(!entrypoint) {
        shutdown('ENTRYPOINT')
    }
    switch(entrypoint) {
        case 'balance':
        case 'root_hash':
        case 'migrations_count':
            break
        case 'is_migrated':
            setParams(['ETH_ADDRESS'])
            break
        case 'contained_in_merkle_tree':
            setParams(['ETH_ADDRESS', 'TOKEN_AMOUNT', 'LEAF_INDEX', 'SIBLINGS'])
            break
        case 'migrate':
            setParams(['TOKEN_AMOUNT', 'AE_ADDRESS','LEAF_INDEX', 'SIBLINGS', 'SIGNATURE'])
            secretKey = process.env.SECRET_KEY
            if(!secretKey) {
                shutdown('SECRET_KEY')
            }
            keypair = {
                secretKey,
                publicKey: getAddressFromPriv(secretKey)
            }
            break
        default:
            console.error(`entrypoint not supported`)
            process.exit(1)       
    }
}

const main = async () => {
    const node = new Node('https://mainnet.aeternity.io')
    const aeSdk = new AeSdk({
        nodes: [
          { name: 'ae_mainnet', instance: node },
        ]
    })
    const contractAddress = 'ct_eJhrbPPS4V97VLKEVbSCJFpdA4uyXiZujQyLqMFoYV88TzDe6'
    const contractInstance = await aeSdk.getContractInstance({ aci: CONTRACT_ACI, contractAddress })
    if(entrypoint === 'migrate') {
        aeSdk.addAccount(new MemoryAccount({ keypair }), { select: true })
        console.log('performing migration...')
        const migrationTx = await contractInstance.call(entrypoint, params)
        console.log(`Migration tx-hash: ${migrationTx.hash}`)
        console.log(`New total migration count: ${migrationTx.decodedResult}`)
    } else {
        console.log('performing a dry-run...')
        const dryRunCall = await contractInstance.call(entrypoint, params, {callStatic: true})
        console.log(`${entrypoint} => ${dryRunCall.decodedResult}`)
    }
}

processEnvironmentInput()
main()