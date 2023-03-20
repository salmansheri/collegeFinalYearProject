import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Search from "./components/Search";
import Home from "./components/Home";

// ABIs
import RealEstate from "./abis/RealEstate.json";
import Escrow from "./abis/Escrow.json";

// Config
import config from "./config.json";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null); 
  const [escrow, setEscrow] = useState(null); 
  const [homes, setHomes] = useState([]); 
  const [home, setHome] = useState({})
  const [isToggle, setIsToggle]= useState(false); 

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);
    setProvider(provider)

    const network = await provider.getNetwork()
    let realEstateAddress = config[network.chainId].realEstate.address
    let escrowAddress = config[network.chainId].escrow.address
    console.log(realEstateAddress, escrowAddress); 
    // Real estate Smart contracts 
    const realEstate = new ethers.Contract(realEstateAddress, RealEstate, provider);
    // getting the total supply 
    const totalSupply = await realEstate.totalSupply(); 
    const homes = []; 
    for (var i=1; i<= totalSupply; i++) {
      const uri = await realEstate.tokenURI(i); 
      const response = await fetch(uri); 
      const metadata = await response.json(); 
      homes.push(metadata); 
    }

    setHomes(homes); 
    console.log(homes); 
    
    // console.log(totalSupply.toString()); 
    // Escrow smartContract 
    const escrow = new ethers.Contract(escrowAddress, Escrow, provider); 
    setEscrow(escrow); 


    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const togglePop = (home) => {
    setHome(home)
    isToggle ? setIsToggle(false) : setIsToggle(true)
  }

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search />
      <div className="cards__section">
        <h3>Homes for you</h3>
        <hr />
        <div className="cards">
        {homes.map((home, index) => (

          <div className="card" key={index} onClick={() => togglePop(home)}>
            <div className="card__image">
              <img src={home.image} alt="Home"  />
            </div>
            <div className="card__info">
              <h4>{home.attributes[0].value} ETH</h4>
              <p>
                <strong>{home.attributes[2].value}</strong> beds |
                <strong>{home.attributes[3].value}</strong> ba |
                <strong>{home.attributes[4].value}</strong> sqft.
              </p>
              <p>{home.address}</p>

            </div>
          </div>
        ) )}

        </div>
      </div>

      {isToggle && (
        <Home home={home} provider={provider} account={account} escrow={escrow} togglePop={togglePop} />
      ) }
    </div>
  );
}

export default App;
