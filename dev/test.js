import Blockchain from './blockchain.js';

const bitcoin = new Blockchain();

const previousBlockHash = 'sdcs46ccd3s5csd54s';

const blockData = [
  {
    amount: 100,
    sender: 'ALEXNDVNDV8D5V2',
    recepeint: 'JANEKJNVKNVKDF85SVV5',
  },
  {
    amount: 500,
    sender: 'ALEXNDVNDV8D5V5',
    recepeint: 'JANEKJNVKNVKDF85SVV5',
  },
  {
    amount: 1000,
    sender: 'ALEXNDVNDV8D5V5',
    recepeint: 'JANEKJNVKNVKDF85SVV5',
  },
];
const nonce = bitcoin.proofOfWork(previousBlockHash, blockData);
console.log('proof of work=>', nonce);

const hashed = bitcoin.hashBlock(previousBlockHash, blockData, nonce);
