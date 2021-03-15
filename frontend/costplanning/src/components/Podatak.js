import React, { useState } from "react"
import { Accordion, Card, Form, Row, Col, Button, Spinner } from "react-bootstrap"



const Podatak = (props) => {
  const [unosPodatka, postaviUnos] = useState(props.podatak.description)
  const [podatakVrijednost, setPodatakVrijednost] = useState(props.podatak.value)
  const [podatakKategorija, setPodatakKategorija] = useState(props.podatak.category)

  const promjenaUnosa = (e) => {
    postaviUnos(e.target.value)
  }

  const promjenaPodatakVrijednost = (e) => {
    setPodatakVrijednost(e.target.value)
  }

  const promjenaPodatakKategorija = (e) => {
    setPodatakKategorija(e.target.value)
  }

  var noviObjekt = null;
  const azuriraniPodatak = (e) => {

    e.preventDefault()
    noviObjekt = {

      type: props.podatak.type,
      category: podatakKategorija,
      date: new Date().toISOString().substring(0, 10),
      value: podatakVrijednost,
      id: props.podatak.id,
      description: unosPodatka
    }
    props.updateData(noviObjekt)
  }
  var title;
  if (props.podatak.type === "expediture") {

    title = <b>{props.podatak.category} <span style={{ color: 'red' }}>-{props.podatak.value} HRK</span></b>
  }
  else {
    title = <b>{props.podatak.category} <span style={{ color: 'green' }}>+{props.podatak.value} HRK</span></b>
  }

  const divStyle = {
    borderRadius: 5,
    background: '#DCDADA',
    padding: 20,
    color: "white",
    height: 100 + "%"
  }

  const divStyleRed = {
    borderRadius: 5,
    background: '#FFB2B2',
    padding: 20,
    color: "white"
  }

  if (props.categoryAll[0] === undefined) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    )
  }
  else {
    return (
      <div>
        <Accordion key={props.podatak.id}>
          <Card>
            <Card.Header>
              {title}

              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Show details
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>

                <Row>
                  <Col key={1}>
                    <b>Details</b>
                    <div>Type: {props.podatak.type}</div>
                    <div>Category: {props.podatak.category}</div>
                    <div>Date: {props.podatak.date}</div>
                    <div>Amount: {props.podatak.value}</div>
                    <div>Description: {props.podatak.description}</div>
                    <br></br>
                    <div style={divStyleRed}>
                      <Button variant="danger" onClick={props.brisiPodatak}>Delete</Button>
                      <Form.Text className="text-muted">Danger zone! If you delete this one, there is no coming back.</Form.Text>
                    </div>
                  </Col>
                  <Col key={2}>
                    <div style={divStyle}>
                      <Form.Text className="text-muted">You can change description, amount or category!</Form.Text>
                      <Form onSubmit={azuriraniPodatak}>


                        <Form.Text>Description:</Form.Text>
                        <Form.Control type="text" placeholder={unosPodatka} value={unosPodatka} onChange={promjenaUnosa} />

                        <Form.Row>

                          <Col>
                            <Form.Text>Amount:</Form.Text>
                            <Form.Control type="text" placeholder={podatakVrijednost} value={podatakVrijednost} onChange={promjenaPodatakVrijednost} />
                          </Col>
                          <Col>
                            <Form.Text>Category:</Form.Text>
                            <Form.Control as="select" onChange={promjenaPodatakKategorija} value={podatakKategorija}>
                              {
                                props.podatak.type === "income" ? props.categoryAll[0].special.income.map((c) => (<option key={c}>{c}</option>)) : props.categoryAll[0].special.expediture.map((c) => (<option key={c}>{c}</option>))
                              }
                            </Form.Control>


                          </Col>
                        </Form.Row>

                        <br></br>
                        <Button type="submit" variant="outline-secondary">Update</Button>
                      </Form>
                    </div>
                    <br></br>
                  </Col>
                </Row>

              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    )
  }

}

export default Podatak