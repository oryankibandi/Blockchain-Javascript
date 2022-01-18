function UserIdResult({ amount, sender, recipient, transactionId }) {
  return (
    <div className='flex-col bg-white mx-2 my-2 mb-2 rounded-lg'>
      <div className='flex text-white items-center justify-between border-b-2 space-y-2 pb-2 px-2'>
        <h1 className='text-black'>amount</h1>
        <h1 className='text-blue-600 text-ellipsis overflow-hidden'>
          {amount}
        </h1>
      </div>
      <div className='flex text-white items-center justify-between border-b-2 space-y-2 pb-2 px-2'>
        <h1 className='text-black'>sender</h1>
        <h1 className='text-blue-600 text-ellipsis overflow-hidden'>
          {sender}
        </h1>
      </div>
      <div className='flex text-white items-center justify-between border-b-2 space-y-2 pb-2 px-2'>
        <h1 className='text-black'>recipient</h1>
        <h1 className='text-blue-600 text-ellipsis overflow-hidden'>
          {recipient}
        </h1>
      </div>
      <div className='flex text-white items-center justify-between border-b-2 space-y-2 pb-2 px-2'>
        <h1 className='text-black'>Transaction Id</h1>
        <h1 className='text-blue-600 text-ellipsis overflow-hidden'>
          {transactionId}
        </h1>
      </div>
    </div>
  );
}

export default UserIdResult;
