import {createContext,useState} from 'react'

export const Web3Context=createContext();

const Context=(props)=>{
    const [web3States, setWeb3State] = useState({ web3: null, contractMultiSig: null, account: null,getBalanceETHAccount:null})
   
    return (
        <Web3Context.Provider value={{web3States,setWeb3State}}>
            {props.children}
        </Web3Context.Provider>
    )
}

export default Context