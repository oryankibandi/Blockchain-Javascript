import Blockchain from './blockchain.js';

const bitcoin = new Blockchain();

const chains = {
  chain: [
    {
      index: 1,
      timestamp: 1642339028571,
      transactions: [],
      nonce: 100,
      previousBlockHash: '0',
      hash: '0',
    },
    {
      index: 2,
      timestamp: 1642339080723,
      transactions: [
        {
          amount: 6520,
          sender: 'Elon',
          recipient: 'Bill',
          transactionId: 'b00c027d20c24d86bc168f6673b12076',
        },
        {
          amount: 20,
          sender: 'Elon',
          recipient: 'Bill',
          transactionId: '547205a7303f4e8996d9b07d021f055a',
        },
        {
          amount: 22.5,
          sender: 'Elon',
          recipient: 'Bill',
          transactionId: '0dc7e17fd8114bc8aabb4f2b3f467bdf',
        },
        {
          amount: 50,
          sender: 'Elon',
          recipient: 'Bill',
          transactionId: '159e675e03b5430bbc06fd892eddea78',
        },
      ],
      nonce: 93980,
      previousBlockHash: '0',
      hash: '0000c353d7a540a2578bd1e403f7ba4a7ff68dbcda11949c48f6a2b81846a884',
    },
    {
      index: 3,
      timestamp: 1642339387325,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: '15788422ec6d4eacbb3cdfd5f2881306',
          transactionId: 'b97c7a2ba48b4bd5b2eecce27f60fd73',
        },
        {
          amount: 12.856,
          sender: 'Patrick-Bett David',
          recipient: 'Mark Cuban',
          transactionId: '72faa714bed24493b425dbed4aa084bd',
        },
        {
          amount: 19.46,
          sender: 'Patrick-Bett David',
          recipient: 'Mark Cuban',
          transactionId: '8d9a67b3c60448fa8fc98379bf8316f5',
        },
        {
          amount: 20.46,
          sender: 'Patrick-Bett David',
          recipient: 'Mark Cuban',
          transactionId: 'd3a8efb25d40439bb05d375c4b04d6ca',
        },
      ],
      nonce: 39559,
      previousBlockHash:
        '0000c353d7a540a2578bd1e403f7ba4a7ff68dbcda11949c48f6a2b81846a884',
      hash: '00009c34920e08705c15ee1f4eb230b99fad6d1dcc2cab8e6f4ac38c6340c0d7',
    },
  ],
  pendingTransactions: [
    {
      amount: 12.5,
      sender: '00',
      recipient: '15788422ec6d4eacbb3cdfd5f2881306',
      transactionId: '5bc018d8e2b94bcbaa2bace6a1a5c0ef',
    },
  ],
  currentNodeUrl: 'http://localhost:3003',
  networkNodes: [],
};

console.log(chains.chain[0]);
const isValid = bitcoin.chainIsValid(chains.chain);
console.log('isValid: ', isValid);
