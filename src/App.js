import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [isMetamaskAvailable, setIsMetamaskAvailable] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");
  const [chainName, setChainName] = useState("");

  const { ethereum } = window;

  useEffect(() => {
    if (!ethereum) {
      setIsMetamaskAvailable(false);
      return;
    }

    const handleChainChanged = (chainId) => {
      setChainName(getChainName(chainId));
    };

    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [ethereum]);

  const getChainName = (id) => {
    switch (parseInt(id)) {
      case 1:
        return "Ethereum Main Network (Mainnet)";
      case 42:
        return "Kovan Test Network";
      case 3:
        return "Ropsten Test Network";
      case 4:
        return "Rinkeby Test Network";
      case 5:
        return "Goerli Test Network";
      default:
        return "Unknown";
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccountAddress(accounts[0]);

      const chainId = await ethereum.request({ method: "eth_chainId" });
      setChainName(getChainName(chainId));

      setIsConnected(true);
    } catch (error) {
      console.log("Error while trying to connect Metamask", error);
      setIsConnected(false);
    }
  };

  return (
    <div className="App">
      {!isMetamaskAvailable ? (
        <div>Please install Metamask extension</div>
      ) : isConnected ? (
        <>
          <div>Status: {isConnected ? "Connected" : "Disconnected"}</div>

          <div>Account: {accountAddress}</div>
          <div>Network: {chainName}</div>
        </>
      ) : (
        <button className="btn" onClick={connectWallet}>
          Connect to Metamask
        </button>
      )}
    </div>
  );
}

export default App;
