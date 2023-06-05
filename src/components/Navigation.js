import logo from '../assets/logo.svg';

const Navigation = ({ account, setAccount }) => {

    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
        setAccount(accounts[0]); 
    }
    return (
        <nav style={{
            display: "flex", 
            justifyContent: "space-between",
            height: "80px",
            alignItems: "center",
            width: "100%",
        }}>
            <ul className="nav__links">
                <li><a href="#">Buy</a></li>
                <li><a href="#">Rent</a></li>
                <li><a href="#">Sell</a></li>
            </ul>

           

            {account ? (
                <button type="button" className="nav__connect">
                    {account.slice(0,6) + "..." + account.slice(38, 42)}
                </button>

            ): (
                <button type="button" className="nav__connect" onClick={connectHandler}>
                    Connect to Wallet
                </button>

            )}

           
        </nav>
    )

}

export default Navigation;
