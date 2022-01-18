import { sha256 } from 'js-sha256';
import { v4 as uuidv4 } from 'uuid';

const nodeUrl = process.argv[3];

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.createNewBlock(100, '0', '0');
    this.currentNodeUrl = nodeUrl;
    this.networkNodes = [];
  }

  createNewBlock(nonce, previousBlockHash, hash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce: nonce,
      previousBlockHash: previousBlockHash,
      hash: hash,
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  createNewTransaction(amount, sender, recipient) {
    const newTransaction = {
      amount: amount,
      sender: sender,
      recipient: recipient,
      transactionId: uuidv4().split('-').join(''),
    };

    return newTransaction;
  }

  addTransactionToPendingTransaction(transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1;
  }

  hashBlock(previousBlockHash, currentBlockData, nonce) {
    const dataAsString =
      previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);

    const hash = sha256(dataAsString);
    return hash;
  }

  proofOfWork(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== '0000') {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
      //console.log('rounds:', rounds++);
    }
    return nonce;
  }

  //check if the chain is valid by comparing previousHash and currentHash, checking if every hash begins with '0000' and ensuring the genesis block has the correct properties
  chainIsValid(blockchain) {
    var validChain = true;
    for (var i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      console.log('currentBlock=>', currentBlock.hash);
      const previousBlock = blockchain[i - 1];
      const currentBlockData = {
        transactions: currentBlock.transactions,
        index: previousBlock.index,
      };
      console.log('currentBlockData: ', currentBlockData);
      const blockHash = this.hashBlock(
        currentBlock.previousBlockHash,
        currentBlockData,
        currentBlock.nonce
      );
      console.log('blockhash', blockHash);

      if (currentBlock.previousBlockHash !== previousBlock.hash) {
        validChain = false;
        console.log('previousBlockhash !== currentblockHash');
      }
      if (blockHash.substring(0, 4) !== '0000') {
        validChain = false;
        console.log('hash doesnt begin with 0000');
      }
    }
    const genesisBlock = blockchain[0];
    console.log('genesisBlock', genesisBlock);
    const correctNonce = genesisBlock.nonce === 100;
    const correctHash = genesisBlock.hash === '0';
    const correctPreviousHash = genesisBlock.previousBlockHash === '0';
    if (!correctNonce || !correctHash || !correctPreviousHash) {
      validChain = false;
    }
    return validChain;
  }

  //this method searches for the blockchain with the given hash
  getBlock(blockHash) {
    let correctBlock = null;
    this.chain.forEach((block) => {
      if (blockHash === block.hash) {
        correctBlock = block;
      }
    });
    return correctBlock;
  }

  getTransaction(transactionId) {
    let correctBlock = null;
    let correctTransaction = null;
    this.chain.forEach((block) => {
      block.transactions.forEach((transaction) => {
        if (transaction.transactionId === transactionId) {
          correctTransaction = transaction;
          correctBlock = block;
        }
      });
    });
    return {
      correctBlock: correctBlock,
      correctTransaction: correctTransaction,
    };
  }

  getAddressData(address) {
    const addressData = [];

    this.chain.forEach((block) => {
      block.transactions.forEach((transaction) => {
        if (
          transaction.sender === address ||
          transaction.recipient === address
        ) {
          addressData.push(transaction);
        }
      });
    });
    // this.pendingTransactions.forEach((pendTransaction) => {
    //   if (
    //     pendTransaction.sender === address ||
    //     pendTransaction.recipient === address
    //   ) {
    //     addressData.push(pendTransaction);
    //   }
    // });
    let balance = 0;
    addressData.forEach((transaction) => {
      if (transaction.recipient === address) {
        balance += transaction.amount;
      } else if (transaction.sender === address) {
        balance -= transaction.amount;
      }
    });

    return { transactions: addressData, balance: balance };
  }
}

export default Blockchain;
