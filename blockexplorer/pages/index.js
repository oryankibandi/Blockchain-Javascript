import Head from 'next/head';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HashResults from '../components/HashResults';
import TransactionResults from '../components/TransactionResults';
import UserIdResults from '../components/UserIdResults';

export default function Home() {
  const [dropDown, setDropDown] = useState(false);
  const [searchParameter, setSearchParameter] = useState('Hash');
  const [hashResults, setHashResults] = useState(null);
  const [transactionResults, setTransactionResults] = useState(null);
  const [userIdResults, setUserIdResults] = useState(null);
  const searchInput = useRef(null);

  function getSearchParameter(parameter) {
    setSearchParameter(parameter);
    setDropDown(false);
  }

  async function searchBlock() {
    //reset the results values
    setTransactionResults(null);
    setHashResults(null);
    setUserIdResults(null);
    var url = '';
    if (searchInput) {
      //get input
      //check state of searchParameter and set url accordingly
      //send get request
      const userInput = searchInput.current.value;
      console.log('user input:', userInput);
      if (searchParameter === 'Hash') {
        url = `http://localhost:3001/block/${userInput}`;
        const response = await axios.get(url);
        setHashResults(response.data.block);
        console.log(hashResults);
        console.log('response+=>', response.data.block);
      } else if (searchParameter === 'TransactionId') {
        url = `http://localhost:3001/transaction/${userInput}`;
        const response = await axios.get(url);
        console.log('response', response.data.correctTransaction);
        setTransactionResults(response.data.correctTransaction);
      } else if (searchParameter === 'UserId') {
        url = `http://localhost:3001/address/${userInput}`;
        const response = await axios.get(url);
        console.log('response', response.data.addressData);
        setUserIdResults(response.data.addressData);
      }
    }
    searchInput.current.value = null;
  }

  return (
    <div className='py-10'>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className=' flex flex-col sm:flex-row items-center justify-center relative'>
        <div className='flex flex-col sm:flex-row items-center justify-center space-y-5 space-x-5 w-full '>
          <div className='flex items-center  space-x-2'>
            <input
              type='text'
              placeholder={`Search with ${searchParameter}`}
              className='outline-none border-none px-3 py-2 rounded-lg sm:w-100 lg:w-320'
              ref={searchInput}
            />
            <div className='flex flex-col'>
              <div
                className='flex items-center cursor-pointer bg-white rounded-lg'
                onClick={() => setDropDown(!dropDown)}
              >
                <div className=' px-5'>
                  <h1>{searchParameter}</h1>
                </div>
                {dropDown ? (
                  <ChevronUpIcon className='h-10 w-10 text-black' />
                ) : (
                  <ChevronDownIcon className='h-10 w-10 text-black' />
                )}
              </div>
              {dropDown ? (
                <div className='flex flex-col bg-gray-100 flex-shrink absolute right-20 z-50 rounded-sm py-2'>
                  <div
                    className='hover:bg-gray-300 cursor-pointer p-2 items-center justify-center'
                    onClick={() => getSearchParameter('Hash')}
                  >
                    <h2>Hash</h2>
                  </div>
                  <div
                    className='hover:bg-gray-300 cursor-pointer p-2 items-center justify-center'
                    onClick={() => getSearchParameter('TransactionId')}
                  >
                    <h2>Transaction Id</h2>
                  </div>
                  <div
                    className='hover:bg-gray-300 cursor-pointer p-2 items-center justify-center'
                    onClick={() => getSearchParameter('UserId')}
                  >
                    <h2>User Id</h2>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <button
            className='text-white py-2 px-5 rounded-md bg-cyan-600'
            onClick={() => searchBlock()}
          >
            Search
          </button>
        </div>
      </div>

      {hashResults && <HashResults hashResponse={hashResults} />}
      {transactionResults && (
        <TransactionResults transactionData={transactionResults} />
      )}
      {userIdResults && <UserIdResults userIdResults={userIdResults} />}
    </div>
  );
}
