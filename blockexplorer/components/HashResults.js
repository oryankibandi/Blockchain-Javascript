import HashResult from './HashResult';

function HashResults({ hashResponse }) {
  return (
    <div className='flex-col bg-white mx-2 my-2 mb-2 rounded-lg'>
      <HashResult name='Index' value={hashResponse.index} />
      <HashResult name='TimeStamp' value={hashResponse.timestamp} />
      <HashResult name='Previous Hash' value={hashResponse.previousBlockHash} />
      <HashResult name='hash' value={hashResponse.hash} />
    </div>
  );
}

export default HashResults;
