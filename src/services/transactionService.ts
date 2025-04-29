import axios from 'axios';

// Etherscan API endpoints
const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';
// Use environment variable for API key
const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY || 'YOURAPIKEYTOKEN';

export interface Transaction {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

export const fetchTransactions = async (address: string): Promise<Transaction[]> => {
  try {
    console.log('Fetching transactions for address:', address);
    
    // For demonstration purposes, using a mock response if API key is not set
    if (ETHERSCAN_API_KEY === 'YOURAPIKEYTOKEN') {
      console.warn('Using mock transaction data because no Etherscan API key is provided. Add VITE_ETHERSCAN_API_KEY to your .env file.');
      return getMockTransactions(address);
    }
    
    const response = await axios.get(ETHERSCAN_API_URL, {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10,
        sort: 'desc',
        apikey: ETHERSCAN_API_KEY
      }
    });

    if (response.data.status === '1') {
      return response.data.result;
    } else {
      console.error('Error fetching transactions:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

// For testing and development without an API key
const getMockTransactions = (address: string): Transaction[] => {
  const now = Math.floor(Date.now() / 1000);
  
  return [
    {
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      blockNumber: '12345678',
      timeStamp: (now - 3600).toString(), // 1 hour ago
      from: address,
      to: '0xdef0123456789abcdef0123456789abcdef012345',
      value: '1000000000000000000', // 1 ETH
      gas: '21000',
      gasPrice: '20000000000',
      isError: '0',
      txreceipt_status: '1',
      input: '0x',
      contractAddress: '',
      confirmations: '12',
      methodId: '0x',
      functionName: 'Transfer'
    },
    {
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      blockNumber: '12345677',
      timeStamp: (now - 86400).toString(), // 1 day ago
      to: address,
      from: '0x9876543210fedcba9876543210fedcba98765432',
      value: '500000000000000000', // 0.5 ETH
      gas: '21000',
      gasPrice: '20000000000',
      isError: '0',
      txreceipt_status: '1',
      input: '0x',
      contractAddress: '',
      confirmations: '24',
      methodId: '0x',
      functionName: 'Transfer'
    },
    {
      hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
      blockNumber: '12345676',
      timeStamp: (now - 172800).toString(), // 2 days ago
      from: address,
      to: '0x1234509876543210fedcba9876543210fedcba98',
      value: '100000000000000000', // 0.1 ETH
      gas: '150000',
      gasPrice: '25000000000',
      isError: '0',
      txreceipt_status: '1',
      input: '0x123456789abcdef',
      contractAddress: '0xcontract123456789abcdef123456789abcdef123456',
      confirmations: '36',
      methodId: '0xa9059cbb',
      functionName: 'transfer(address,uint256)'
    }
  ];
};

// Utility function to format transactions
export const formatTransactionValue = (value: string): string => {
  const valueInEth = parseInt(value) / 1e18;
  return valueInEth.toFixed(4);
};

// Utility to format transaction timestamp
export const formatTransactionTime = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleString();
};

// Determine if transaction is incoming or outgoing
export const isIncomingTransaction = (transaction: Transaction, currentAddress: string): boolean => {
  return transaction.to.toLowerCase() === currentAddress.toLowerCase();
};

// Get transaction type description
export const getTransactionTypeLabel = (transaction: Transaction, currentAddress: string): string => {
  if (isIncomingTransaction(transaction, currentAddress)) {
    return 'Received';
  } else {
    return 'Sent';
  }
}; 