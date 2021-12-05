import React, { useEffect, useState } from 'react';
import CandyMachine from './CandyMachine';
import './App.css';

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const checkIfPhantomIsConnected = async () => {
    try {
      await connectToPhantomWallet();
    } catch (e) {
      console.log('Error:', e);
      if (e.code === 4001 && e.message === 'User rejected the request.')
        window.alert('An error occured. Make sure to login to Phantom.');
    }
  };

  useEffect(() => {
    // Phantom Wallet team suggested doing this to ensure window is loaded up first
    const onLoad = async () => {
      await checkIfPhantomIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  const connectToPhantomWallet = async () => {
    const { solana } = window;

    if (solana.isPhantom) {
      console.log('Connected to Phantom wallet');
      const resp = await window.solana.connect({ onlyIfTrusted: true });
      setWalletAddress(resp);
    } else {
      console.log(
        'Phantom wallet not found. Please connect to a Phantom wallet'
      );
    }
  };

  return (
    <div className='App'>
      <div className='container'>
        <div className='header-container'>
          <p className='header'>🍭 Candy Drop</p>
          <p className='sub-text'>NFT drop machine with fair mint</p>
          {!walletAddress && (
            <button
              className='cta-button connect-wallet-button'
              onClick={connectToPhantomWallet}
            >
              Connect to Wallet
            </button>
          )}
        </div>
        {walletAddress && <CandyMachine walletAddress={walletAddress} />}
      </div>
    </div>
  );
};

export default App;
