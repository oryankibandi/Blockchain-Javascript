import express from 'express';
import bodyParser from 'body-parser';
import Blockchain from './blockchain.js';
import { v4 as uuidv4 } from 'uuid';

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
  const amount = req.body.amount;
  const sender = req.body.sender;
  const recepient = req.body.recepient;
  const blockNumber = bitcoin.createNewTransaction(amount, sender, recepient);
  res.send({ message: `transaction will be added to block ${blockNumber}` });
});

app.get('/mine', function (req, res) {
  const previousBlock = bitcoin.getLastBlock();
  const previousBlockHash = previousBlock.hash;
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: bitcoin.getLastBlock.index,
  };
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);

  const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
  bitcoin.createNewTransaction(12.5, '00', nodeAddres);
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, hash);

  res.json({
    note: 'New Block mined successfully',
    block: newBlock,
  });
});

app.post('/register-and-broadcast-node', function (req, res) {});

app.post('/register-node', function (req, res) {});

app.listen(port, function () {
  console.log(`listening on port ${port}...`);
});
