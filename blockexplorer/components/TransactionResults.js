import TransactionResult from './TransactionResult';

function TransactionResults({ transactionData }) {
  return (
    <div className='flex-col bg-white mx-2 my-2 mb-2 rounded-lg'>
      <TransactionResult value={transactionData.amount} name='Amount' />
      <TransactionResult value={transactionData.sender} name='Sender' />
      <TransactionResult value={transactionData.recipient} name='recipient' />
      <TransactionResult
        value={transactionData.transactionId}
        name='Transaction Id'
      />
    </div>
  );
}

export default TransactionResults;
