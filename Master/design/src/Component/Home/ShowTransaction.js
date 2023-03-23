import { Button, Table, Modal, InputGroup, Form, Col, Toast, ToastContainer, Row, Container } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../context";

const ShowTransaction = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [show, setShow] = useState(false);
    const [myShowToast, setMyShowToast] = useState(false);
    const [showsign, setShowsign] = useState(false);
    const [countSign, setCountSign] = useState()
    const [confirmSign, setConfirmSign] = useState()

    const [message, setMessage] = useState("");
    const [listTransaction, setListTransaction] = useState()
    const [showBoxSign, setShowBoxSign] = useState(false)
    const [showBoxDeleteSign, setShowDeleteBoxSign] = useState(false)
    const [paramAddress, setParamAddress] = useState()
    const [paramAddressDel, setParamAddressDel] = useState()

    const [idTransaction, setIdTransaction] = useState()
    const [signiterTransaction, setSigniterTransaction] = useState()
    let getBalanceETHAccount
    let UpdateWeb3States = { ...web3States }

    async function getBalance(){
        getBalanceETHAccount = await web3States.web3.eth.getBalance(web3States.account);
        getBalanceETHAccount = Number(web3States.web3.utils.fromWei(getBalanceETHAccount, 'ether')).toFixed(5);
        UpdateWeb3States.getBalanceETHAccount=getBalanceETHAccount
        setWeb3State(UpdateWeb3States)

    }

    function showListTransaction() {
        if (web3States.contractMultiSig) {
            web3States.contractMultiSig.methods.getShowCountTransaction().call({ from: web3States.account }).then(async res => {
                if (res) {
                    setListTransaction(
                        await web3States.contractMultiSig.methods.getTransaction(res).call()
                    )
                }
            })
        }
    }

    function BoxSign(id) {
        setShowBoxSign(true)
        setIdTransaction(id)
    }
    function addSigner() {
        if (web3States.contractMultiSig) {
            web3States.contractMultiSig.methods.addSigner(idTransaction, paramAddress).send({ from: web3States.account })
                .then(async result => {
                    setShow(true)
                    setMyShowToast(true)
                    setParamAddress("")
                    setMessage(`آدرس اضافه شد`)
                    setShowBoxSign(false)
                    getBalance()
                })
        }
    }

    async function showListSign(_id) {
        web3States.contractMultiSig.methods.getOwners(_id).call().then(async result => {
            setMessage(result.map(i => {
                if (i != "0x0000000000000000000000000000000000000000") return i + "   |    "
            }))
            setCountSign(await web3States.contractMultiSig.methods.getRequireds(_id).call())
            setConfirmSign(await web3States.contractMultiSig.methods.getCountOwners(_id).call())
            setShowsign(true)
        })
    }

    function ShowDeleteSigniter(id) {
        setShowDeleteBoxSign(true)
        setIdTransaction(id)
    }

    function removeSigner() {
        if (web3States.contractMultiSig) {
            web3States.contractMultiSig.methods.removeSigner(idTransaction, paramAddressDel).send({ from: web3States.account })
                .then(async result => {
                    setShow(true)
                    setMyShowToast(true)
                    setParamAddress("")
                    setMessage(`آدرس حذف شد`)
                    setShowDeleteBoxSign(false)
                    getBalance()
                })
        }

    }

    useEffect(() => {
        showListTransaction()

    }, [web3States.account, web3States.getBalanceETHAccount])


    return (
        <>

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
            {/* showSigniter */}
            <Col xs={6}>
                <ToastContainer className="p-3" position="top-center">
                    <Toast onClose={() => setShowsign(false)}
                        show={showsign} delay={10000} autohide>
                        <Toast.Header className="bg-success" >
                            <strong className="text-white ms-auto">آدرسهای امضا کننده تراکنش</strong>
                        </Toast.Header>
                        <Toast.Body className="bg-light">{message}</Toast.Body>
                        <Toast.Body className="bg-light">تعداد آدرسهایی که باید تراکنش را تایید کنند : {countSign} </Toast.Body>
                        <Toast.Body className="bg-light">تعداد {confirmSign}  آدرس تراکنش را تایید کرده اند </Toast.Body>
                    </Toast>
                </ToastContainer>
            </Col>
            {/* Add Signiter */}
            {showBoxSign ?
                <Container id="signer" >
                    <Row className=' d-flex justify-content-around mt-2' >
                        <Col xs={12} md={5} className='d-flex flex-column align-self-stretch py-4 ' style={{ backgroundColor: "rgb(187, 192, 190)" }}>

                            <label className=' mt-1'>آدرس برای امضای تراکنش :</label>
                            <input type="input" id='َParamAddress' className='form-control mt-1' name='َParamAddress' value={paramAddress} onChange={(e) => setParamAddress(e.target.value)} placeholder='آدرس' />
                            <Button className='mt-3' variant="outline-dark" onClick={addSigner}>
                                افزودن امضا کننده (addSigner)
                            </Button>
                        </Col>
                    </Row>
                </Container>
                : null
            }
            {/* Delete Signiter */}
            {showBoxDeleteSign ?
                <Container id="signer" >
                    <Row className=' d-flex justify-content-around mt-2' >
                        <Col xs={12} md={5} className='d-flex flex-column align-self-stretch py-4 ' style={{ backgroundColor: "rgb(187, 192, 190)" }}>

                            <label className=' mt-1'>آدرس برای حذف امضای تراکنش :</label>
                            <input type="input" id='َParamAddress' className='form-control mt-1' name='َParamAddress' value={paramAddressDel} onChange={(e) => setParamAddressDel(e.target.value)} placeholder='آدرس' />
                            <Button className='mt-3' variant="outline-dark" onClick={removeSigner}>
                                حذف امضا کننده (removeSigner)
                            </Button>
                        </Col>
                    </Row>
                </Container>
                : null
            }



            {/* Tabale */}
            <Row id="myTable" className='d-flex  justify-content-around mt-4 '  >
                <Col xs={12} md={12} className='d-flex flex-column align-self-stretch py-3 ' style={{ backgroundColor: "rgb(155, 156, 156)" }}>
                    <p className="fs-5 text-center"> لیست تراکنش ها</p>

                    <Table className='mt-2 ' >
                        <thead >
                            <tr className='bg-light'>
                                <th ></th>
                                <th>ارسال کننده</th>
                                <th>دریافت کننده</th>
                                <th>مقدار(ETH)</th>
                                <th>اطلاعات</th>
                                <th> افزودن امضاکننده </th>
                                <th>حذف امضاکننده</th>
                                <th>لیست امضا کنندگان</th>
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
                                                    onClick={() => BoxSign(trList.id)}>
                                                    افزودن
                                                </Button>
                                            </td>
                                            <td >
                                                <Button className="me-2" variant="light"
                                                    onClick={() => ShowDeleteSigniter(trList.id)}>
                                                    حذف
                                                </Button>
                                            </td>

                                            <td >
                                                <Button className="me-2" variant="light"
                                                    onClick={() => showListSign(trList.id)}>
                                                    نمایش لیست
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


        </>
    )
}

export default ShowTransaction