import React, { useState, useEffect } from "react"
import Podatak from "./Podatak"

import Form from "react-bootstrap/Form"
import NewData from "./NewData";
import Badge from "react-bootstrap/Badge"

import podaciServer from "../services/podaci"
import { Row, Col } from "react-bootstrap";
import Container from "react-bootstrap/Container"


const SearchPage = (props) => {
    const [podaci, postaviPodatke] = useState([])
    const [typeForReRenderForm, mathodForReRenderForm] = useState("")
    const [categoryAll, setCategoryAll] = useState([])
    const [pretraga, postaviPretragu] = useState("")
    const [minVrijednost, setMinVrijednost] = useState(0)
    const [maxVrijednost, setMaxVrijednost] = useState(Number.MAX_SAFE_INTEGER)

    useEffect(() => {
        const prijavljeni = window.localStorage.getItem("prijavljeniKorisnik")
        if (prijavljeni) {
            const korisnik = JSON.parse(prijavljeni)
            //setUser(korisnik)
            podaciServer.postaviToken(korisnik.token)
        }
    }, [])

    useEffect(() => {
        console.log("Effect")
        podaciServer.axiosGet().then((response) => {
            var a = response.data.filter(r => r.type !== "special")
            postaviPodatke(a)
            console.log(a)
        })

    }, [])

    useEffect(() => {
        console.log("Effect2")
        podaciServer.axiosGet().then((response) => {
            var b = response.data.filter(r => r.type === "special")
            setCategoryAll(b)
            console.log(b)
        })

    }, [])

    const promjenaMinVrijednost = (e) => {
        setMinVrijednost(e.target.value)
    }

    const promjenaMaxVrijednost = (e) => {
        setMaxVrijednost(e.target.value)
    }

    const promjenaPretrage = (e) => {
        postaviPretragu(e.target.value)
    }

    const noviPodatak = (obj) => {
        podaciServer.axiosPost(obj).then((response) => {
            postaviPodatke(podaci.concat(response.data))

        })
    }

    const brisanjePodatka = (id) => {
        podaciServer.axiosDelete(id).then(
            (response) => {
                postaviPodatke(
                    podaci.filter(
                        (p) => p.id !== id
                    )
                )
            }
        )
    }

    const updateData = (obj) => {
        podaciServer.axiosPut(obj.id, obj).then(
            (response) => {
                postaviPodatke(podaci.map(p => p.id === obj.id ? obj : p))
            }
        )
    }

    const changeType = (e) => {
        mathodForReRenderForm(e.target.value)
    }

    const myStyle = {
        borderRadius: 5,
        background: '#484848',
        padding: 20,
        color: "white"
    }

    const b = (title) => {

        if (title === "income") {
            return (<Badge variant="success">income</Badge>)
        }
        else if (title === "expediture") {
            return (<Badge variant="danger">expediture</Badge>)
        }
        else return ("");
    }

    if (podaci !== undefined) {
        return (
            <div className="container">
                <h2>Search page</h2>

                <div style={myStyle}>

                    <Container>
                        <Row>
                            <Col xs={3}><Form.Label>Search by description:</Form.Label></Col>
                            <Col><Form.Control type="text" placeholder="Enter description..." value={pretraga} onChange={promjenaPretrage} /></Col>

                        </Row>
                        <br></br>
                        <Row>
                            <Col xs={3}><Form.Label>Value range:</Form.Label></Col>
                            <Col><Form.Control type="text" value={minVrijednost} onChange={promjenaMinVrijednost} /></Col>
                            <Col md="auto"> - </Col>
                            <Col><Form.Control type="text" value={maxVrijednost} onChange={promjenaMaxVrijednost} /></Col>
                        </Row>
                    </Container>





                </div>
                <br></br>
                <div>{podaci.map((p) =>
                (p.description.toLowerCase().includes(pretraga) && p.value >= minVrijednost && p.value <= maxVrijednost
                    ? <Podatak categoryAll={categoryAll} key={p.id} podatak={p} podaci={podaci} updateData={updateData} brisiPodatak={() => brisanjePodatka(p.id)}></Podatak>
                    : null))}</div>
                <br></br>

                <div style={myStyle}>
                    <h3>Enter a new record</h3>
                    <Form.Label>Type {b(typeForReRenderForm)}</Form.Label>
                    <Form.Control as="select" onChange={changeType} value={typeForReRenderForm}>
                        <option>Choose...</option>
                        <option>expediture</option>
                        <option>income</option>
                    </Form.Control>

                    <NewData categoryAll={categoryAll} typeForReRenderForm={typeForReRenderForm} noviPodatak={noviPodatak}></NewData>
                </div>
            </div>
        );
    }
    else {
        return null
    }
};

export default SearchPage