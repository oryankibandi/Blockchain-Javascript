import express from 'express';
import bodyParser from 'body-parser';
import Blockchain from './blockchain.js';
import { v4 as uuidv4 } from 'uuid';
import requestPromise from 'request-promise';
import axios from 'axios';

const nodeAddres = uuidv4().split('-').join('');
const port = process.argv[2];

const bitcoin = new Blockchain();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});

app.post('/transaction', function (req, res) {
  console.log('in /transaction');
  const newTransaction = req.body;
  console.log('newTransaction in /transaction', newTransaction);
  const blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);

  res.json({ note: `transaction will be added in block ${blockIndex}` });
});

app.post('/transaction/broadcast', function (req, res) {
  const newTransaction = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  bitcoin.addTransactionToPendingTransaction(newTransaction);
  // TODO: add transaction to pending since request broadcasts to other nodes
  console.log('req.body.amount:', req.body.amount);
  console.log('req.body.sender:', req.body.sender);
  console.log('req.body.recipient:', req.body.recipient);
  console.log('new transaction => ', newTransaction);

  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const url = networkNodeUrl + '/transaction';

    requestPromises.push(axios.post(url, newTransaction));
  });
  console.log('requestPromises array=>', requestPromises);
  Promise.all(requestPromises)
    .then((response) => {
      // console.log(response[0].data.note);
      res.json({ note: 'Transaction created and broadcasted successfully' });
    })
    .catch((err) => {
      console.log('something went wrong: ', err);
      res.json({ note: 'Transaction not broadcasted' });
    });
});

app.get('/mine', function (req, res) {
  const previousBlock = bitcoin.getLastBlock();
  const previousBlockHash = previousBlock.hash;
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: bitcoin.getLastBlock().index,
  };
  console.log('currentblockdata', currentBlockData);
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);

  const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, hash);

  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const url = networkNodeUrl + '/receive-new-block';

    requestPromises.push(axios.post(url, { newBlock: newBlock }));
  });
  Promise.all(requestPromises)
    .then(() => {
      const url = bitcoin.currentNodeUrl + '/transaction/broadcast';

      const body = {
        amount: 12.5,
        sender: '00',
        recipient: nodeAddres,
      };
      return axios.post(url, body);
    })
    .then((data) => {
      res.json({
        note: 'New Block mined & broadcasted successfully',
        block: newBlock,
      });
    })
    .catch((err) => console.log('sth went wrong', err));
});

app.post('/receive-new-block', function (req, res) {
  const newBlock = req.body.newBlock;
  console.log('in /receive-new-block');
  //check whether the block is valid by ensuring previous hash and current hash is the same
  const lastBlock = bitcoin.getLastBlock();
  console.log('lastBlock=>', lastBlock);
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  console.log('correctHash=>', correctHash);
  //check whether the index is correct
  const correctIndex = lastBlock.index + 1 === newBlock.index;
  if (correctHash && correctIndex) {
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions = [];

    res.json({ note: 'new block added', block: newBlock });
  } else {
    res.json({
      note: 'New Block rejected',
      block: newBlock,
    });
  }
});

//register a node and broadcast it in the network
app.post('/register-and-broadcast-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  console.log('newNodeUrl=->', newNodeUrl);
  if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {
    console.log(
      'check in reg and broadcst:',
      bitcoin.networkNodes.indexOf(newNodeUrl) === -1
    );
    bitcoin.networkNodes.push(newNodeUrl);
  }

  const regNodesPromises = [];
  //for each node in the array a request is made and stored in regNodePromises then executed
  bitcoin.networkNodes.forEach((networkNode) => {
    const url = networkNode + '/register-node';
    // const requestOptions = {
    //   method: 'POST',
    //   url: networkNode + '/register-node',
    //   body: {
    //     newNodeUrl: newNodeUrl,
    //   },
    //   json: true,
    // };

    regNodesPromises.push(
      axios.post(url, { newNodeUrl: bitcoin.currentNodeUrl })
    );
  });
  const allNetworkNodes = [...bitcoin.networkNodes, newNodeUrl];
  console.log('allNetworkNodes=>', allNetworkNodes);
  Promise.all(regNodesPromises)
    .then((data) => {
      //use the data
      const url = newNodeUrl + '/register-nodes-bulk';
      const bulkRegisterOptions = {
        allNetworkNodes: allNetworkNodes,
      };
      console.log('allNetworkNodes=>', [
        ...bitcoin.networkNodes,
        bitcoin.currentNodeUrl,
      ]);
      return axios.post(url, bulkRegisterOptions);
    })
    .then((data) => {
      res.json({ note: 'New node registered with network successfully' });
    })
    .catch((err) => console.log('Something went wrong =>', err));
});

//register a node to the network
app.post('/register-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  console.log(`newNodeUrl: ${newNodeUrl}`);
  var isInArray = bitcoin.networkNodes.indexOf(newNodeUrl) === -1;
  var isSameAsNode = bitcoin.currentNodeUrl !== newNodeUrl;
  console.log('isInArray:', isInArray);
  console.log('isSameAsNode:', isSameAsNode);
  if (
    bitcoin.networkNodes.indexOf(newNodeUrl) === -1 &&
    bitcoin.currentNodeUrl !== newNodeUrl
  ) {
    console.log(`pushing node ${newNodeUrl} to bitcoin.networkNodes`);
    bitcoin.networkNodes.push(newNodeUrl);
  } else {
    console.log('Node already exists');
  }

  res.json({ note: `node ${newNodeUrl} registered with node` });
});

//register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach((networkNode) => {
    if (
      bitcoin.networkNodes.indexOf(networkNode) === -1 &&
      bitcoin.currentNodeUrl !== networkNode
    ) {
      bitcoin.networkNodes.push(networkNode);
    }
  });
  res.json({ note: 'Bulk register successful.' });
});

//the consensus endpoint checks if a node has a valid blockchain and is in synch with the network
app.get('/consensus', function (req, res) {
  const blockchainRequests = [];
  bitcoin.networkNodes.forEach((networkNode) => {
    const url = networkNode + '/blockchain';

    blockchainRequests.push(axios.get(url));
  });

  Promise.all(blockchainRequests).then((response) => {
    const blockchains = response;
    console.log('blockchains=>', blockchains);
    const currentChainLength = bitcoin.chain.length;
    let maxchainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach((blockchain) => {
      console.log('blockchain returned from promise', blockchain);
      console.log('blockchain data=>', blockchain.data);
      const chainInBlock = blockchain.data;
      if (chainInBlock.chain.length > currentChainLength) {
        newLongestChain = chainInBlock;
        maxchainLength = chainInBlock.chain.length;
        newPendingTransactions = chainInBlock.pendingTransactions;
      }
    });

    if (
      !newLongestChain ||
      (newLongestChain && !bitcoin.chainIsValid(newLongestChain.chain))
    ) {
      res.json({
        note: 'Current Chain hasnt been replaced',
        chain: bitcoin.chain,
      });
    } else {
      bitcoin.chain = newLongestChain.chain;
      bitcoin.pendingTransactions = newPendingTransactions;
      res.json({
        note: 'This chain has been replaced',
        chain: bitcoin.chain,
      });
    }
  });
});

app.get('/block/:blockHash', function (req, res) {
  const blockHash = req.params.blockHash;
  const correctBlock = bitcoin.getBlock(blockHash);
  if (correctBlock) {
    res.json({
      block: correctBlock,
    });
  } else {
    res.json({
      block: 'block with the given hash not found',
    });
  }
});

app.get('/transaction/:transactionId', function (req, res) {
  const transactionId = req.params.transactionId;
  const correctData = bitcoin.getTransaction(transactionId);

  if (correctData.correctBlock) {
    res.json({
      correctBlock: correctData.correctBlock,
      correctTransaction: correctData.correctTransaction,
    });
  } else {
    res.json({
      transaction: 'Not found',
    });
  }
});

app.get('/address/:address', function (req, res) {
  const address = req.params.address;
  const addressData = bitcoin.getAddressData(address);
  if (addressData.transactions.length > 0) {
    res.json({
      addressData: addressData.transactions,
      balance: addressData.balance,
    });
  } else {
    res.json({
      addressData: 'No activity found',
    });
  }
});

app.listen(port, function () {
  console.log(`listening on port ${port}...`);
});
