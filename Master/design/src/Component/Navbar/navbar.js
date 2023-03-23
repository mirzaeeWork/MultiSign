import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import Connect from '../Connect/connect';
import { useContext, useEffect, useState } from 'react';
import { Web3Context } from "../context";

const NavbarComponenet = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [balance, setBalance] = useState()
    let UpdateWeb3States = { ...web3States }

    useEffect(() => {
        setBalance(web3States.getBalanceETHAccount)
    }, [web3States.getBalanceETHAccount])


    return (<>

        <Navbar className='fs-6' bg="dark" variant="dark">
            <Container>
                <Nav.Link className="me-auto">
                    <Connect />
                    <Button variant="light" className='ms-2'>
                        {balance ? balance : 0}موجودی اکانت
                    </Button>

                </Nav.Link >
            </Container>
        </Navbar>

    </>)
}

export default NavbarComponenet