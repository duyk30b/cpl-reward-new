import { TrezorWallet } from '@/models/trezor-wallet/TrezorWallet'
import TrezorConnect, {
  EthereumSignedTx,
  Response,
  TxInputType,
} from 'trezor-connect'
import { chunk, flatten } from 'lodash'
import { ENV_MAINNET } from '@/views/currency/variables/currency.const'
import { hexValue, serializeTransaction } from 'ethers/lib/utils'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { JsonRpcProvider } from '@ethersproject/providers'
import { BigNumber as EthersBN, Contract } from 'ethers'

const blockcypherGet = async (url) => {
  const response = await fetch('https://api.blockcypher.com/v1' + url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  })

  return response.json()
}

const xrplClientSubmit = async (network: string, params: any) => {
  const baseUrl =
    network === ENV_MAINNET
      ? 'https://xrplcluster.com/'
      : 'https://testnet.xrpl-labs.com/'

  const response = await fetch(baseUrl, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'submit',
      params,
    }),
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  })

  return response.json()
}

const getXrpAccount = async (network: string, address: string) => {
  const baseUrl =
    network === ENV_MAINNET
      ? 'https://xrplcluster.com/'
      : 'https://testnet.xrpl-labs.com/'

  const response = await fetch(baseUrl, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'account_info',
      params: [
        {
          account: address,
          strict: true,
          ledger_index: 'current',
          queue: true,
        },
      ],
    }),
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  })

  return response.json()
}

const satoshiSymbol = {
  btc: {
    mainnet: 'BTC',
    testnet: 'TEST',
  },
  bch: {
    mainnet: 'BCH',
    testnet: 'BCH',
  },
  ltc: {
    mainnet: 'LTC',
    testnet: 'tLTC',
  },
}

const scriptTypeTransform = {
  'pay-to-address': 'SPENDADDRESS',
  'pay-to-script-hash': 'SPENDP2SHWITNESS',
  'pay-to-pubkey-hash': 'SPENDADDRESS',
  'pay-to-pubkey': 'SPENDADDRESS',
  'pay-to-multi-pubkey-hash': 'SPENDADDRESS',
  'multisig-2-of-3': 'SPENDMULTISIG',
  'pay-to-witness-script-hash': 'SPENDP2SHWITNESS',
  'pay-to-witness-pubkey-hash': 'SPENDWITNESS',
  'pay-to-taproot': 'SPENDTAPROOT',
}

const ethChainId = {
  mainnet: 1,
  testnet: 5,
}

const convertHdPathToBit = (path: string) => {
  const pathNumbers = path.split('/')
  pathNumbers.shift()

  return pathNumbers.map((numberString, index) => {
    if (index >= 3) {
      return Number(numberString.replaceAll("'", ''))
    }

    return (Number(numberString.replaceAll("'", '')) | 0x80000000) >>> 0
  })
}

export const SUPPORTED_MULTIPLE_ADDRESS = ['btc', 'bch', 'ltc']

export async function collectBtcFromAddresses(
  wallets: Array<TrezorWallet>,
  network: string,
  receiverAddress: string,
  fee: string,
) {
  let inputTx = [] as Array<TxInputType>
  const trezorSymbol =
    satoshiSymbol[wallets[0].symbol][network] ?? satoshiSymbol.btc.testnet

  if (wallets[0].symbol === 'bch') {
    wallets.forEach((wallet) => {
      inputTx = inputTx.concat(getUnspentBchFromAddress(wallet))
    })
  } else {
    const chunkedWallets = chunk(wallets, 2)

    for (let index = 0; index < chunkedWallets.length; index++) {
      const inputTxResult = await Promise.all(
        chunkedWallets[index].map((wallet) =>
          getUnspentBtcFromAddress(
            wallet.address,
            wallet.path,
            wallet.symbol,
            network,
          ),
        ),
      )

      inputTx = inputTx.concat(flatten(inputTxResult))
      await new Promise((sleep) => setTimeout(sleep, 1500))
    }
  }

  let totalAmount = inputTx.reduce(
    (prev, curr) => prev + Number(curr.amount),
    0,
  )
  // minus fee: depends on number of collecing wallet
  totalAmount -= Number(fee) * wallets.length

  if (totalAmount <= 0) {
    throw new Error('Balance is too small or was collected.')
  }

  console.log('Unspent transactions input:', inputTx)
  const rawTx = await TrezorConnect.signTransaction({
    inputs: inputTx,
    outputs: [
      {
        address: receiverAddress,
        amount: String(totalAmount),
        script_type: 'PAYTOADDRESS',
      },
    ],
    coin: trezorSymbol,
  })

  if (!rawTx.success) {
    throw new Error(rawTx.payload.error)
  }

  const result = await TrezorConnect.pushTransaction({
    tx: rawTx.payload.serializedTx,
    coin: trezorSymbol,
  })

  if (!result.success) {
    throw new Error(result.payload.error)
  }

  return result
}

const getUnspentBchFromAddress = (wallet) => {
  const utxoList = {
    'bitcoincash:qrr9sft8t6vpv4rffrmsvddf9qrl635k2sjwv7gfcu': [
      {
        address_n: [],
        prev_index: 0,
        prev_hash:
          'f24cffd36d79a9577a6b38e6e4cfbd2183a1d0d8524db7c1eb22bffaf4e055a2',
        script_type: 'SPENDADDRESS',
        amount: String(100000000 * 0.155843),
        sequence: 754069,
      },
    ],
    'bitcoincash:qzee6hjkamldd8l23njwks05da8twytnfu5w23w0l7': [
      {
        address_n: [],
        prev_index: 1,
        prev_hash:
          '269f6f05785adb66ce350b54dc639a5d3fd783a46ea3c8458e51df3204d9f2da',
        script_type: 'SPENDADDRESS',
        amount: String(100000000 * 0.00054486),
        sequence: 752697,
      },
      {
        address_n: [],
        prev_index: 0,
        prev_hash:
          'bf44c67d9ef9e57e6c9c807cef3d578ea164963f3defab3f3cb266c073a7d501',
        script_type: 'SPENDADDRESS',
        amount: String(100000000 * 0.0463831),
        sequence: 752684,
      },
    ],
    'bitcoincash:qpvc2qyt9z4zsy5w5a92m0pjd672m3pe5gajexwnzv': [
      {
        address_n: [],
        prev_index: 0,
        prev_hash:
          'cfd41c3ef1b856506a82d8ce264020a3bedf69b2c665dd7c3ad9cf634dd920a0',
        script_type: 'SPENDADDRESS',
        amount: String(100000000 * 0.00117629),
        sequence: 753933,
      },
    ],
  }

  const unspent = utxoList[wallet.address]

  if (!unspent) {
    throw new Error('Unknown BCH address')
  }

  return unspent.map((input) => ({
    ...input,
    address_n: convertHdPathToBit(wallet.path),
  }))
}

const getUnspentBtcFromAddress = async (
  address: string,
  hdpath: string,
  symbol: string,
  network: string,
) => {
  const unspentTransactions = [] as Array<TxInputType>
  const uriNetwork = network === ENV_MAINNET ? 'main' : 'test3'
  const response = await blockcypherGet(
    `/${symbol}/${uriNetwork}/addrs/${address}/full?limit=100&unspentOnly=true&includeScript=true&token=c6709296d8714b8a8691cb69e43ba826`,
  )
  let spentTransaction = [] as Array<string>

  response.txs.forEach((transaction) => {
    spentTransaction = spentTransaction.concat(
      transaction.inputs.map((item) => item.prev_hash),
    )

    transaction.outputs.forEach((output, index) => {
      if (!output.addresses.includes(address) || output.spent_by) {
        return
      }

      unspentTransactions.push({
        address_n: convertHdPathToBit(hdpath),
        prev_index: index,
        prev_hash: transaction.hash,
        script_type: scriptTypeTransform[output.script_type] ?? 'SPENDADDRESS',
        amount: String(output.value),
        sequence: transaction.inputs[0].sequence,
      })
    })
  })

  return unspentTransactions.filter(
    (unspent) => !spentTransaction.includes(unspent.prev_hash),
  )
}

export async function collectFromEthereumAddress(
  wallet: TrezorWallet,
  receiverAddress: string,
  gasLimit: string,
  gasPrice: string,
  network: {
    env: string
    contractAddress?: string
    decimal: string
  },
) {
  let signatureRequest: Response<EthereumSignedTx>
  const amount = new BigNumber(wallet.balance).multipliedBy(network.decimal)
  let hexGasLimit = '0x' + new BigNumber(gasLimit).toString(16)
  const hexGasPrice = '0x' + new BigNumber(gasPrice).toString(16)
  const nonce = await getEthereumNonce(wallet.address, network.env)
  const ethBalance = await getEthereumBalance(wallet.address, network.env)
  let transactionPayload = {
    to: receiverAddress,
    value: '0x' + amount.toString(16),
    data: '0x01',
    chainId: ethChainId[network.env] || ethChainId.testnet,
    nonce: hexValue(nonce),
    gasPrice: hexGasPrice,
    gasLimit: hexGasLimit,
  }

  if (wallet.symbol === 'eth') {
    if (
      ethBalance.lt(new BigNumber(gasLimit).multipliedBy(gasPrice).toString())
    ) {
      throw Error('Balance is too small')
    }

    transactionPayload.value =
      '0x' +
      new BigNumber(ethBalance.toString())
        .minus(new BigNumber(gasLimit).multipliedBy(gasPrice))
        .toString(16)
    signatureRequest = TrezorConnect.ethereumSignTransaction({
      path: wallet.path,
      transaction: transactionPayload,
    })
  } else {
    if (ethBalance.lte(0)) {
      throw Error('Balance ETH is too small')
    }

    if (
      ethBalance.lt(new BigNumber(gasLimit).multipliedBy(gasPrice).toString())
    ) {
      hexGasLimit =
        '0x' +
        new BigNumber(ethBalance.toString())
          .dividedToIntegerBy(gasPrice)
          .toString(16)
    }

    const balanceErc20 = await getErc20Balance(
      wallet.address,
      network.contractAddress || '',
      network.env,
    )

    if (balanceErc20.eq(0)) {
      throw Error('Balance Erc20 is too small')
    }

    const data = new Web3().eth.abi.encodeFunctionCall(
      {
        name: 'transfer',
        type: 'function',
        inputs: [
          {
            name: '_to',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
      },
      [receiverAddress, balanceErc20.toString()],
    )
    transactionPayload = {
      to: network.contractAddress as string,
      value: '0x0',
      data: data,
      chainId: ethChainId[network.env] ?? ethChainId.testnet,
      nonce: hexValue(nonce),
      gasPrice: hexGasPrice,
      gasLimit: hexGasLimit,
    }

    signatureRequest = TrezorConnect.ethereumSignTransaction({
      path: wallet.path,
      transaction: transactionPayload,
    })
  }

  const signature = await signatureRequest

  if (!signature.success) {
    throw new Error(signature.payload.error)
  }

  const etherTx = Object.assign({}, { ...transactionPayload, nonce: nonce })
  const serializedTx = serializeTransaction(etherTx, {
    r: signature.payload.r,
    s: signature.payload.s,
    v: EthersBN.from(signature.payload.v).toNumber(),
  })

  const transactionResponse = await sendEthereumRawTransaction(
    serializedTx,
    network.env,
  )

  return transactionResponse
}

const sendEthereumRawTransaction = async (
  signature: string,
  network: string,
) => {
  const rpcUrl =
    network === ENV_MAINNET
      ? 'https://mainnet.infura.io/v3/b2dcb53edcb54bb4bdb191eff8279b24'
      : 'https://goerli.infura.io/v3/d6a3e2479627495180921dfdd4339298'
  const provider = new JsonRpcProvider(rpcUrl)

  return provider.sendTransaction(signature)
}

const getEthereumNonce = async (address: string, network: string) => {
  const rpcUrl =
    network === ENV_MAINNET
      ? 'https://mainnet.infura.io/v3/b2dcb53edcb54bb4bdb191eff8279b24'
      : 'https://goerli.infura.io/v3/d6a3e2479627495180921dfdd4339298'
  const provider = new JsonRpcProvider(rpcUrl)

  return provider.getTransactionCount(address)
}

const getEthereumBalance = async (address: string, network: string) => {
  const rpcUrl =
    network === ENV_MAINNET
      ? 'https://mainnet.infura.io/v3/b2dcb53edcb54bb4bdb191eff8279b24'
      : 'https://goerli.infura.io/v3/d6a3e2479627495180921dfdd4339298'
  const provider = new JsonRpcProvider(rpcUrl)

  return provider.getBalance(address)
}

const getErc20Balance = async (
  address: string,
  contractAddress: string,
  network: string,
) => {
  const rpcUrl =
    network === ENV_MAINNET
      ? 'https://mainnet.infura.io/v3/b2dcb53edcb54bb4bdb191eff8279b24'
      : 'https://goerli.infura.io/v3/d6a3e2479627495180921dfdd4339298'
  const provider = new JsonRpcProvider(rpcUrl)
  let balance = new BigNumber(0)

  const contract = new Contract(
    contractAddress,
    [
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ],
    provider,
  )
  const res = await contract.balanceOf(address)
  if (res) {
    balance = new BigNumber(res.toString())
  }

  return balance
}

export async function collectXrpFromAddress(
  wallet: TrezorWallet,
  receiverAddress: string,
  gasLimit: string,
  network: {
    env: string
    contractAddress?: string
    decimal: string
  },
) {
  const account = await getXrpAccount(network.env, wallet.address)

  if (!account.result?.account_data) {
    throw new Error('Failed to get XRP wallet info')
  }

  const remainAmount = new BigNumber(10).multipliedBy(network.decimal)
  const amount = new BigNumber(account.result?.account_data?.Balance)
    .minus(gasLimit)
    .minus(remainAmount)

  if (amount.lt(0)) {
    throw Error('Balance XRP is too small')
  }

  const signedTransaction = await TrezorConnect.rippleSignTransaction({
    path: wallet.path,
    transaction: {
      fee: gasLimit,
      sequence: account.result?.account_data?.Sequence,
      payment: {
        amount: amount.toString(),
        destination: receiverAddress,
      },
    },
  })

  if (!signedTransaction.success) {
    throw new Error(signedTransaction.payload.error)
  }

  return xrplClientSubmit(network.env, [
    {
      tx_blob: signedTransaction.payload.serializedTx,
    },
  ])
}
