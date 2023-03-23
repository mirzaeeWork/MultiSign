import { Button, Table, Modal, InputGroup, Form, Col, Toast, ToastContainer, Row, Container } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../context";

const ConfirmTransaction = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [show, setShow] = useState(false);
    const [myShowToast, setMyShowToast] = useState(false);
    const [listTransaction, setListTransaction] = useState()
    const [message, setMessage] = useState("");
    let getBalanceETHAccount
    let UpdateWeb3States = { ...web3States }


    function showListTransactionForSign(){
        if (web3States.contractMultiSig) {
            web3States.contractMultiSig.methods.getIdsSign().call({ from: web3States.account }).then(async res => {
                if (res) {
                    setListTransaction(
                        await web3States.contractMultiSig.methods.getTransaction(res).call()
                    )
                }
            })
        }
    }


    function confirmTransaction(id) {
        if (web3States.contractMultiSig) {
            web3States.contractMultiSig.methods.getTransactionHash(id).call({ from: web3States.account }).then(async _hash => {
                console.log("hash : " + _hash)
                window.ethereum.request({
                    method: 'personal_sign',
                    params: [_hash, web3States.account],
                }).then(async sign => {
                    console.log('sign : ' + sign);
                    // setSigner([...signer, sign])
                    let getAddress = await web3States.contractMultiSig.methods.recover(_hash, sign).call()
                    if (getAddress.toLowerCase() === web3States.account.toLowerCase()) {
                        console.log(`Successfully ecRecovered signer as ${getAddress}`);
                    } else {
                        console.log(
                            `Failed to verify signer when comparing ${getAddress} to ${web3States.account}`,
                        );
                    }
                    web3States.contractMultiSig.methods.confirmTransaction(id, sign).send({ from: web3States.account }).then(async result => {
                        console.log(result.events.Confirmation.returnValues[0], result.events.Confirmation.returnValues[1])
                        console.log(result.events.Execution.returnValues[0], result.events.Execution.returnValues[1])
                        setShow(true)
                        setMyShowToast(true)
                        setMessage(`امضا ثبت شد`)
                        getBalanceETHAccount = await web3States.web3.eth.getBalance(web3States.account);
                        getBalanceETHAccount = Number(web3States.web3.utils.fromWei(getBalanceETHAccount, 'ether')).toFixed(5);
                        UpdateWeb3States.getBalanceETHAccount=getBalanceETHAccount
                        setWeb3State(UpdateWeb3States)

                    }).catch((error) => {
                        setShow(true)
                        setMessage("امضا تایید نشد")

                    })
                })

            })
        }
    }

    useEffect(() => {
        showListTransactionForSign()

    }, [web3States.account, web3States.getBalanceETHAccount])





    return (<>

        <Col xs={6}>
            <ToastContainer className="p-3" position="top-center">
                <Toast onClose={() => setShow(false)}
                    show={show} delay={5000} autohide>
                    <Toast.Header className={myShowToast ? "bg-success" : "bg-danger"}  >
                        <strong className="text-white ms-auto">پیام</strong>
                    </Toast.Header>
                    <Toast.Body className="bg-light">{message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Col>

        {/* Tabale */}
        <Row id="myTablee" className='d-flex  justify-content-around mt-4 '  >
            <Col xs={12} md={12} className='d-flex flex-column align-self-stretch py-3 ' style={{ backgroundColor: "rgb(155, 156, 156)" }}>
                <p className="fs-5 text-center"> لیست تراکنشهایی که بایستی امضا شوند</p>
                <Table className='mt-4 ' >
                    <thead >
                        <tr className='bg-light'>
                            <th ></th>
                            <th>ارسال کننده</th>
                            <th>دریافت کننده</th>
                            <th>مقدار(ETH)</th>
                            <th>اطلاعات</th>
                            <th>امضا کردن تراکنش </th>

                        </tr>
                    </thead>
                    <tbody >

                        {listTransaction ?
                            listTransaction.filter(x => !x['executed']).map((trList, idx) => {
                                return (
                                    <tr key={idx} value={trList.id}>
                                        <td>{idx + 1}</td>
                                        <td >
                                            {trList.admin.substring(0, 4) + '...' + trList.admin.slice(-4)}
                                        </td>
                                        <td>{trList.destination.substring(0, 4) + '...' + trList.destination.slice(-4)}</td>
                                        <td>
                                            Eth {web3States.web3.utils.fromWei(trList.value, 'ether')}
                                        </td>
                                        <td>{trList.data.substring(0, 20)}</td>
                                        <td >
                                            <Button className="me-2" variant="light"
                                                onClick={() => confirmTransaction(trList.id)}>
                                                امضاکردن
                                            </Button>
                                        </td>

                                    </tr>
                                );
                            }) : null
                        }
                    </tbody>
                </Table>

            </Col>

        </Row>

    </>)
}
export default ConfirmTransaction