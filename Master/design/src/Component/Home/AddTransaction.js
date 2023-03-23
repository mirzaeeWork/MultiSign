import { Col, Container, Button, Row, ToastContainer, Toast } from "react-bootstrap"
import { useContext, useEffect, useState } from 'react';
import { Web3Context } from "../context";


const AddTransaction = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [show, setShow] = useState(false);
    const [myShowToast, setMyShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [paramAddress, setParamAddress] = useState()
    const [paramData, setParamData] = useState()
    const [amountETH, setAmountETH] = useState()
    let getBalanceETHAccount
    let UpdateWeb3States = { ...web3States }

    function AddTransaction() {
        if (web3States.contractMultiSig && web3States.account) {
            setMyShowToast(false)

            if (paramAddress.trim() != '') {
                contineuAddTransaction()
            } else {
                setMessage("ورودی آدرس وارد شود و ورودی اتر کمتر از موجودی اکانت و بزرگتر از صفر باشد")
                setShow(true)
            }
        } else {
            setMessage("ابتدا به کیف پول خود وصل شوید")
            setShow(true)
        }
    }

    function contineuAddTransaction() {
        const data = `0x${Buffer.from(paramData, 'utf8').toString('hex')}`;
        const Amount = Number(amountETH) * 10 ** 18;
        web3States.contractMultiSig.methods.AddTransaction(paramAddress, data).send({
            from: web3States.account,
            value: Amount.toString()
        }).then(async result => {
            setShow(true)
            setMyShowToast(true)
            setAmountETH("")
            setParamAddress("")
            setParamData("")
            setMessage(`تراکنش ثبت شد و برای ارسال نیاز به تایید دارد`)
            getBalanceETHAccount = await web3States.web3.eth.getBalance(web3States.account);
            getBalanceETHAccount = Number(web3States.web3.utils.fromWei(getBalanceETHAccount, 'ether')).toFixed(5);
            UpdateWeb3States.getBalanceETHAccount=getBalanceETHAccount
            setWeb3State(UpdateWeb3States)
        }).catch((error) => {
            setShow(true)
            setMessage("انتقال اتر به قراردادهوشمند انجام شد")

        })

    }

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

        <Container >
            <Row className=' d-flex justify-content-around ' >
                <Col className='d-flex flex-column align-self-stretch py-4 ' style={{ backgroundColor: "rgb(187, 192, 190)" }}>
                    <label className=' mt-1'>مقدار ETH :</label>
                    <input type="number" id='AmountETH' className='form-control mt-1' name='AmountETH' value={amountETH} onChange={(e) => setAmountETH(e.target.value)} placeholder='تعداد ETH' />

                    <label className=' mt-1'>آدرس برای ارسال اتر :</label>
                    <input type="input" id='َParamAddress' className='form-control mt-1' name='َParamAddress' value={paramAddress} onChange={(e) => setParamAddress(e.target.value)} placeholder='آدرس' />
                    <label className=' mt-1'>اطلاعات(data) :</label>
                    <input type="input" id='ParamData' className='form-control mt-1' name='ParamData' value={paramData} onChange={(e) => setParamData(e.target.value)} placeholder='اطلاعات' />
                    <Button className='mt-3' variant="outline-dark" onClick={AddTransaction}>
                        افزودن تراکنش (AddTransaction)
                    </Button>
                </Col>
            </Row>
        </Container>
    </>)
}

export default AddTransaction