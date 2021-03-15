import React, { useState, useEffect } from "react"
import Podatak from "./Podatak"

import Form from "react-bootstrap/Form"
import NewData from "./NewData";
import Badge from "react-bootstrap/Badge"
import LoginForm from "./LoginForm"
import Alert from "react-bootstrap/Alert"

import podaciServer from "../services/podaci"

const HomePage = (props) => {
  const [podaci, postaviPodatke] = useState([])
  const [typeForReRenderForm, mathodForReRenderForm] = useState("")
  const [categoryAll, setCategoryAll] = useState([])
  const [user, setUser] = useState(null)
  const [show, setShow] = useState(true);


  const postaviUser = (korisnik) => {
    props.changeUser(korisnik.ime)
    setUser(korisnik)

  }

  useEffect(() => {
    const prijavljeni = window.localStorage.getItem("prijavljeniKorisnik")
    if (prijavljeni) {
      const korisnik = JSON.parse(prijavljeni)
      setUser(korisnik)
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

  }, [user])

  useEffect(() => {
    console.log("Effect2")
    podaciServer.axiosGet().then((response) => {
      var b = response.data.filter(r => r.type === "special")
      setCategoryAll(b)
      console.log("CATEGORYALL")
      console.log(b)
    })

  }, [user])

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
    if (user === null) {
      return <LoginForm postaviUser={postaviUser}></LoginForm>
    }
    else {
      return (
        <div className="container">
          <h2>Home page</h2>

          {
            show === true ? <Alert variant="success" onClose={() => setShow(false)} dismissible>
              <Alert.Heading>Welcome!</Alert.Heading>
              <p>
                Logged in as <b>{user.ime}</b>
              </p>
            </Alert> : null
          }

          <div>{podaci.map((p) => (<Podatak categoryAll={categoryAll} key={p.id} podatak={p} podaci={podaci} updateData={updateData} brisiPodatak={() => brisanjePodatka(p.id)}></Podatak>))}</div>
          <br></br>

          <div style={myStyle}>
            <h3>Enter a new record</h3>
            <Form.Label>Type {b(typeForReRenderForm)}</Form.Label>
            <Form.Control as="select" onChange={changeType} value={typeForReRenderForm}>
              <option>Choose...</option>
              <option>expediture</option>
              <option>income</option>
            </Form.Control>

            <NewData categoryAll={categoryAll} typeForReRenderForm={typeForReRenderForm} noviPodatak={noviPodatak} p={""}></NewData>
          </div>
        </div>
      );
    }

  }
  else {
    return null
  }
};

export default HomePage