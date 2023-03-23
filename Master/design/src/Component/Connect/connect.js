import Web3 from 'web3';
import { Button, Col, Toast, ToastContainer } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Web3Context } from '../context';
import { AbiMultiSig } from '../ABI/AbiMultiSig';

const Connect = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [account, setAccount] = useState();
    let contractMultiSig,getBalanceETHAccount

    window.ethereum.on('accountsChanged', (accounts) => {
        connectToWallet()
    });

    window.ethereum.on('chainChanged', (chainId) => {
        setAccount()
    });


    async function connectToWallet() {
        let web3;
        if (typeof window.ethereum !== "undefined") {
            let accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            web3 = new Web3(Web3.givenProvider);
            web3.eth.getChainId().then(async res => {
                if (res == "80001") {
                    setAccount(accounts[0])
                    contractMultiSig = new web3.eth.Contract(AbiMultiSig, "0x1875Efa8D285be463930aDa51484b28c2D25652E")
                    getBalanceETHAccount = await web3.eth.getBalance(accounts[0]);
                    getBalanceETHAccount = Number(web3.utils.fromWei(getBalanceETHAccount, 'ether')).toFixed(5);
                    setWeb3State({ web3: web3, contractMultiSig: contractMultiSig, account: accounts[0],getBalanceETHAccount:getBalanceETHAccount})
                } else {
                    setMessage("mumbai شبکه تستی مد نظر می باشد")
                    setShow(true)
                }
            })
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            setMessage("متامسک را نصب کنید")
            setShow(true)
        }
    }

    async function startApp() {
        let web3;
        web3 = new Web3('https://rpc-mumbai.maticvigil.com');
        contractMultiSig = new web3.eth.Contract(AbiMultiSig, "0x1875Efa8D285be463930aDa51484b28c2D25652E")

        setWeb3State({ web3: web3, contractStreamer: contractMultiSig, account:null})
    }

    useEffect(() => {
        startApp()
    }, [])


        
    return (
        <>
            <Col xs={6}>
                <ToastContainer className="p-3" position="top-center">
                    <Toast onClose={() => setShow(false)}
                        show={show} delay={5000} autohide>
                        <Toast.Header className="text-white bg-danger">
                            <strong className="ms-auto">خطا</strong>
                        </Toast.Header>
                        <Toast.Body className="bg-light">{message}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Col>
            <Button onClick={connectToWallet} variant="light">
                {account ? (account.substring(0, 4) + '...' + account.slice(-4)) : 'اتصال به کیف پول'}
            </Button>
        </>
    );
}

export default Connect