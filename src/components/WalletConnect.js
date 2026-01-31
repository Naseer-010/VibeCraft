import { useState } from "react";
import { connectWallet } from "../utils/wallet";

function WalletConnect() {
  const [address, setAddress] = useState(
    localStorage.getItem("wallet")
  );

  const handleConnect = async () => {
    const wallet = await connectWallet();
    if (wallet) {
      setAddress(wallet);
      localStorage.setItem("wallet", wallet);
    }
  };

  return (
    <div>
      {address ? (
        <p>
          Connected: {address.slice(0, 6)}...
          {address.slice(-4)}
        </p>
      ) : (
        <button onClick={handleConnect}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default WalletConnect;
