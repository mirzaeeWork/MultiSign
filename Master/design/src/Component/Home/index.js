import { useContext,useState  } from "react";
import { Col, Alert, Container, Button, Row, ToastContainer, Toast, Form } from "react-bootstrap"
import { Web3Context} from "../context";
import AddSigner from "./addSigner";
import AddTransaction from "./AddTransaction";
import ConfirmTransaction from "./confirmTransaction";
import ShowTransaction from "./ShowTransaction";

const Home = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [show, setShow] = useState(false);
    const [myShowToast, setMyShowToast] = useState(false);
    const [message, setMessage] = useState("");



    return (<>
        <Col xs={6}>
            <ToastContainer className="p-3" position="top-center">
                <Toast onClose={() => setShow(false)}
                    show={show} delay={5000} autohide>
                    <Toast.Header className={myShowToast ? "bg-success" : "bg-danger"}  >
                        <strong className="text-white me-auto">پیام</strong>
                    </Toast.Header>
                    <Toast.Body className="bg-light">{message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Col>

        <Container dir='rtl' className='mb-3'>
            <Row className='d-flex  justify-content-around mt-4' >
                <Col xs={12} md={5} className='d-flex flex-column align-self-stretch py-3 ' style={{ backgroundColor: "rgb(155, 156, 156)" }}>
                    <AddTransaction/>
                </Col>

            </Row>
            {/* <Row className='d-flex  justify-content-around mt-4' >
                <Col xs={12} md={5} className='d-flex flex-column align-self-stretch py-3 ' style={{ backgroundColor: "rgb(155, 156, 156)" }}>
                    <AddSigner/>
                </Col>

            </Row> */}
            <ShowTransaction/>
            <ConfirmTransaction/>

        </Container>




    </>)
}

export default Home