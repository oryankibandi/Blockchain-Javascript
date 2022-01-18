function TransactionResult({ name, value }) {
  return (
    <div className='flex text-white items-center justify-between border-b-2 space-y-2 pb-2 px-2'>
      <h1 className='text-black'>{name}</h1>
      <h1 className='text-blue-600 text-ellipsis overflow-hidden'>{value}</h1>
    </div>
  );
}

export default TransactionResult;
