import './App.css';
import * as fcl from '@onflow/fcl'
import react, {useState} from 'react'

import {getNFT} from "./cadence/scripts/getNFT.js"
import {TotalSupply} from "./cadence/scripts/getTotalSupply.js"
import {createNFT} from "./cadence/transactions/createNFT.js"
// 0x94925fdb92008088

fcl.config()
 .put("app.detail.title", "My Flow NFT DApp")
 .put("app.detail.icon", "https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat5.svg")
 .put("accessNode.api", "https://rest-testnet.onflow.org")
 .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function App() {

  const [user, setUser] = useState();
  const [totalsupply, setTotalSupply] = useState();
  const [NFTURL, setNFTURL] = useState();

  const ImageURLS = ["https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat1.svg", "https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat2.svg", "https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat3.svg", "https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat4.svg", "https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat5.svg", "https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat6.svg", "https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat7.svg"]

  const logIn =  () => {
    fcl.authenticate();
    fcl.currentUser().subscribe(setUser);
    GetTotalSupply()
  }

  const GetMyNFT = async () =>{

    const result = await fcl.send([
      fcl.script(getNFT), fcl.args([fcl.arg(user.addr, fcl.t.Address)])
    ]).then(fcl.decode)

    setNFTURL(result[1])
    console.log(result[1])

  }

  const GetTotalSupply = async () =>{
    const result = await fcl.send([
      fcl.script(TotalSupply)
    ]).then(fcl.decode)

    setTotalSupply(result)
    console.log(result)
  }

  const CreateNFT = async () =>{
    const transactionID = await fcl.send([
      fcl.transaction(createNFT),
      fcl.args([fcl.arg(ImageURLS[parseInt(totalsupply)], fcl.t.String)]),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(9999)
    ]).then(fcl.decode)

    console.log(transactionID)
  }

  return (
    <div className="App">
      <h1>My Flow NFT DApp</h1>
      <h2>Current Address : {user && user.addr ? user.addr : ''}</h2>
      <button onClick={() => logIn()}>LogIn</button>
      <p>-------------------</p>
      <button onClick={() => CreateNFT()}>CreateNFT</button>
      <p>-------------------</p>
      <button onClick={() => GetMyNFT()}>GetMyNFT</button>
      <p>
      <img height={60} src={NFTURL}/>
      </p>
      

    </div>
  );
}

export default App;
